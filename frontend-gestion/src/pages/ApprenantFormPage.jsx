import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function ApprenantFormPage() {
    // 1. On récupère l'ID depuis l'URL (ex: /apprenants/5/edit -> id = 5)
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    // Si l'ID existe, on est en mode modification
    const isEditMode = Boolean(id);

    // 2. Le state du formulaire
    const [form, setForm] = useState({ 
        cin: '', 
        nom: '', 
        prenom: '', 
        email: '', 
        numero: '', 
        datePremiereInscription: '' 
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 3. Charger les données de l'apprenant si on est en mode modification
    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            // On appelle le backend pour récupérer l'apprenant par son ID
            axiosClient.get(`/apprenants/${id}`)
                .then(res => {
                    const a = res.data;
                    // On remplit le formulaire avec les données reçues
                    setForm({ 
                        cin: a.cin || '', 
                        nom: a.nom || '', 
                        prenom: a.prenom || '', 
                        email: a.email || '', 
                        numero: a.numero || '', 
                        datePremiereInscription: a.datePremiereInscription || '' 
                    });
                })
                .catch(err => {
                    console.error(err);
                    setError("Impossible de charger les données de cet apprenant.");
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode]);

    // 4. Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                // Si on modifie : PUT
                await axiosClient.put(`/apprenants/${id}`, form);
            } else {
                // Si on crée : POST
                await axiosClient.post('/apprenants', form);
            }
            // Redirection vers la liste après succès
            navigate('/apprenants'); 
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'enregistrement. Vérifiez les champs.");
        }
    };

    // Affichage pendant le chargement des données
    if (loading) return <div style={{ padding: 30 }}>Chargement des données...</div>;

    return (
        <div style={{ padding: 30, maxWidth: 600, margin: '0 auto' }}>
            <Link to="/apprenants">← Retour à la liste</Link>
            
            <h2>{isEditMode ? "Modifier l'apprenant" : "Ajouter un apprenant"}</h2>
            
            {error && <div style={{ color: 'red', background: '#ffeeee', padding: 10, borderRadius: 4, marginBottom: 15 }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15, background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
                
                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>CIN :</label>
                    <input 
                        value={form.cin} 
                        onChange={e => setForm({...form, cin: e.target.value})} 
                        style={{ width: '100%', padding: 8 }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Nom :</label>
                    <input 
                        value={form.nom} 
                        onChange={e => setForm({...form, nom: e.target.value})} 
                        required 
                        style={{ width: '100%', padding: 8 }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Prénom :</label>
                    <input 
                        value={form.prenom} 
                        onChange={e => setForm({...form, prenom: e.target.value})} 
                        required 
                        style={{ width: '100%', padding: 8 }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Email :</label>
                    <input 
                        type="email" 
                        value={form.email} 
                        onChange={e => setForm({...form, email: e.target.value})} 
                        required 
                        style={{ width: '100%', padding: 8 }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Numéro :</label>
                    <input 
                        value={form.numero} 
                        onChange={e => setForm({...form, numero: e.target.value})} 
                        style={{ width: '100%', padding: 8 }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 5 }}>Date de 1ère inscription :</label>
                    <input 
                        type="date" 
                        value={form.datePremiereInscription} 
                        onChange={e => setForm({...form, datePremiereInscription: e.target.value})} 
                        style={{ width: '100%', padding: 8 }} 
                    />
                </div>

                <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                    <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        {isEditMode ? "Mettre à jour" : "Ajouter"}
                    </button>
                    <Link to="/apprenants">
                        <button type="button" style={{ padding: '10px 20px', cursor: 'pointer' }}>Annuler</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}