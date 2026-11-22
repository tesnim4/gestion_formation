import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function ThemeFormPage() {
    const { id } = useParams(); // Récupère l'ID depuis l'URL (ex: /themes/5/edit)
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [form, setForm] = useState({ theme: '', motsCles: '' });
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);

    // Si on est en mode modification, on charge les données du thème
    useEffect(() => {
        if (isEditMode) {
            axiosClient.get(`/themes/${id}`)
                .then(res => {
                    setForm({ 
                        theme: res.data.theme || '', 
                        motsCles: res.data.motsCles || '' 
                    });
                })
                .catch(err => {
                    console.error(err);
                    setError("Impossible de charger les données de ce thème.");
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axiosClient.put(`/themes/${id}`, form);
            } else {
                await axiosClient.post('/themes', form);
            }
            navigate('/themes'); // Redirection vers la liste
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'enregistrement. Vérifiez les champs.");
        }
    };

    if (loading) return <div style={{ padding: 30 }}>Chargement...</div>;

    return (
        <div style={{ padding: 30, maxWidth: 600, margin: '0 auto' }}>
            <Link to="/themes">← Retour à la liste</Link>
            <h2>{isEditMode ? "Modifier le thème" : "Ajouter un thème"}</h2>
            
            {error && <div style={{ color: 'red', background: '#ffeeee', padding: 10, borderRadius: 4, marginBottom: 15 }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15, background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Intitulé du thème :</label>
                    <input 
                        value={form.theme} 
                        onChange={e => setForm({...form, theme: e.target.value})} 
                        required 
                        style={{ width: '100%', padding: 8 }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Mots-clés :</label>
                    <input 
                        value={form.motsCles} 
                        onChange={e => setForm({...form, motsCles: e.target.value})} 
                        style={{ width: '100%', padding: 8 }} 
                    />
                </div>

                <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                    <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        {isEditMode ? "Mettre à jour" : "Ajouter"}
                    </button>
                    <Link to="/themes">
                        <button type="button" style={{ padding: '10px 20px', cursor: 'pointer' }}>Annuler</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}