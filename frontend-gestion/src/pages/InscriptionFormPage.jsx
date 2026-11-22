import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function InscriptionFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [form, setForm] = useState({ apprenantId: '', sessionId: '' });
    const [apprenants, setApprenants] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Charger les listes pour les menus déroulants
                const [resApprenants, resSessions] = await Promise.all([
                    axiosClient.get('/apprenants'),
                    axiosClient.get('/sessions')
                ]);
                setApprenants(resApprenants.data);
                setSessions(resSessions.data);

                // 2. Si on est en modification, charger l'inscription
                if (isEditMode) {
                    const resInscription = await axiosClient.get(`/inscriptions/${id}`);
                    const i = resInscription.data;
                    setForm({
                        apprenantId: i.apprenantId || '',
                        sessionId: i.sessionId || ''
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
            const payload = {
                apprenantId: parseInt(form.apprenantId),
                sessionId: parseInt(form.sessionId)
            };

            if (isEditMode) {
                await axiosClient.put(`/inscriptions/${id}`, payload);
            } else {
                await axiosClient.post('/inscriptions', payload);
            }
            navigate('/inscriptions'); // Redirection vers la liste
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'enregistrement. Vérifiez les données.");
        }
    };

    if (loading) return <div style={{ padding: 30 }}>Chargement...</div>;

    return (
        <div style={{ padding: 30, maxWidth: 600, margin: '0 auto' }}>
            <Link to="/inscriptions">← Retour à la liste</Link>
            <h2>{isEditMode ? "Modifier l'inscription" : "Inscrire un apprenant"}</h2>
            
            {error && <div style={{ color: 'red', background: '#ffeeee', padding: 10, borderRadius: 4, marginBottom: 15 }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15, background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
                
                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Apprenant :</label>
                    <select 
                        value={form.apprenantId} 
                        onChange={e => setForm({...form, apprenantId: e.target.value})} 
                        required 
                        style={{ width: '100%', padding: 8 }}
                    >
                        <option value="">-- Choisir un apprenant --</option>
                        {apprenants.map(a => <option key={a.id} value={a.id}>{a.prenom} {a.nom}</option>)}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Session :</label>
                    <select 
                        value={form.sessionId} 
                        onChange={e => setForm({...form, sessionId: e.target.value})} 
                        required 
                        style={{ width: '100%', padding: 8 }}
                    >
                        <option value="">-- Choisir une session --</option>
                        {sessions.map(s => <option key={s.id} value={s.id}>{s.description}</option>)}
                    </select>
                </div>

                <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                    <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        {isEditMode ? "Enregistrer les modifications" : "Inscrire"}
                    </button>
                    <Link to="/inscriptions">
                        <button type="button" style={{ padding: '10px 20px', cursor: 'pointer' }}>Annuler</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}