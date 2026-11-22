import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function SessionFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [form, setForm] = useState({ 
        description: '', 
        dateDebut: '', 
        dateFin: '', 
        themeId: '', 
        formateurId: '' 
    });
    
    const [themes, setThemes] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Chargement des listes (thèmes et formateurs) + données de la session si modification
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Charger les menus déroulants
                const [resThemes, resFormateurs] = await Promise.all([
                    axiosClient.get('/themes'),
                    axiosClient.get('/formateurs')
                ]);
                setThemes(resThemes.data);
                setFormateurs(resFormateurs.data);

                // 2. Si on est en modification, charger les données de la session
                if (isEditMode) {
                    const resSession = await axiosClient.get(`/sessions/${id}`);
                    const s = resSession.data;
                    
                    setForm({
                        description: s.description || '',
                        // On coupe la date au "T" pour avoir le format YYYY-MM-DD
                        dateDebut: s.dateDebut ? s.dateDebut.split('T')[0] : '',
                        dateFin: s.dateFin ? s.dateFin.split('T')[0] : '',
                        // On récupère l'ID du thème et du formateur (selon comment ton backend renvoie les données)
                        themeId: s.themeId || (s.themeFormation ? s.themeFormation.id : ''),
                        formateurId: s.formateurId || (s.formateur ? s.formateur.id : '')
                    });
                }
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des données.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axiosClient.put(`/sessions/${id}`, form);
            } else {
                await axiosClient.post('/sessions', form);
            }
            navigate('/sessions');
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'enregistrement. Vérifiez les champs.");
        }
    };

    if (loading) return <div style={{ padding: 30 }}>Chargement...</div>;

    return (
        <div style={{ padding: 30, maxWidth: 600, margin: '0 auto' }}>
            <Link to="/sessions">← Retour à la liste</Link>
            <h2>{isEditMode ? "Modifier la Session" : "Créer une Session"}</h2>
            
            {error && <div style={{ color: 'red', background: '#ffeeee', padding: 10, borderRadius: 4, marginBottom: 15 }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15, background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
                
                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Description :</label>
                    <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} required style={{ width: '100%', padding: 8 }} />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: 5 }}>Date début :</label>
                        <input type="date" value={form.dateDebut} onChange={e => setForm({...form, dateDebut: e.target.value})} required style={{ width: '100%', padding: 8 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: 5 }}>Date fin :</label>
                        <input type="date" value={form.dateFin} onChange={e => setForm({...form, dateFin: e.target.value})} required style={{ width: '100%', padding: 8 }} />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Thème :</label>
                    <select value={form.themeId} onChange={e => setForm({...form, themeId: e.target.value})} required style={{ width: '100%', padding: 8 }}>
                        <option value="">-- Sélectionner un thème --</option>
                        {themes.map(t => <option key={t.id} value={t.id}>{t.theme}</option>)}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Formateur :</label>
                    <select value={form.formateurId} onChange={e => setForm({...form, formateurId: e.target.value})} style={{ width: '100%', padding: 8 }}>
                        <option value="">-- Sélectionner un formateur --</option>
                        {formateurs.map(f => <option key={f.id} value={f.id}>{f.nom} {f.prenom}</option>)}
                    </select>
                </div>

                <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                    <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        {isEditMode ? "Mettre à jour" : "Créer"}
                    </button>
                    <Link to="/sessions">
                        <button type="button" style={{ padding: '10px 20px', cursor: 'pointer' }}>Annuler</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}