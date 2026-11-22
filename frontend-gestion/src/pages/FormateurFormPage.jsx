import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function FormateurFormPage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [form, setForm] = useState({ 
        cin: '', 
        nom: '', 
        prenom: '', 
        email: '', 
        grade: '', 
        fonction: '' 
    });
    
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);

    // Chargement des données en mode modification
    useEffect(() => {
        if (isEditMode) {
            axiosClient.get(`/formateurs/${id}`)
                .then(res => {
                    const f = res.data;
                    setForm({ 
                        cin: f.cin || '', 
                        nom: f.nom || '', 
                        prenom: f.prenom || '', 
                        email: f.email || '', 
                        grade: f.grade || '', 
                        fonction: f.fonction || '' 
                    });
                })
                .catch(err => {
                    console.error(err);
                    setError("Impossible de charger les données de ce formateur.");
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axiosClient.put(`/formateurs/${id}`, form);
            } else {
                await axiosClient.post('/formateurs', form);
            }
            navigate('/formateurs'); // Redirection vers la liste
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'enregistrement. Vérifiez les champs.");
        }
    };

    if (loading) return <div style={{ padding: 30 }}>Chargement...</div>;

    return (
        <div style={{ padding: 30, maxWidth: 600, margin: '0 auto' }}>
            <Link to="/formateurs">← Retour à la liste</Link>
            <h2>{isEditMode ? "Modifier le formateur" : "Ajouter un formateur"}</h2>
            
            {error && <div style={{ color: 'red', background: '#ffeeee', padding: 10, borderRadius: 4, marginBottom: 15 }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15, background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>CIN :</label>
                    <input value={form.cin} onChange={e => setForm({...form, cin: e.target.value})} required style={{ width: '100%', padding: 8 }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Nom :</label>
                    <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required style={{ width: '100%', padding: 8 }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Prénom :</label>
                    <input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} required style={{ width: '100%', padding: 8 }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Email :</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ width: '100%', padding: 8 }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Grade :</label>
                    <input value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} style={{ width: '100%', padding: 8 }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Fonction :</label>
                    <input value={form.fonction} onChange={e => setForm({...form, fonction: e.target.value})} style={{ width: '100%', padding: 8 }} />
                </div>

                <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                    <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        {isEditMode ? "Mettre à jour" : "Ajouter"}
                    </button>
                    <Link to="/formateurs">
                        <button type="button" style={{ padding: '10px 20px', cursor: 'pointer' }}>Annuler</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}