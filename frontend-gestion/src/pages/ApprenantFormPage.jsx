import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function ApprenantFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditMode = Boolean(id);

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

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            axiosClient.get(`/apprenants/${id}`)
                .then(res => {
                    const a = res.data;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axiosClient.put(`/apprenants/${id}`, form);
            } else {
                await axiosClient.post('/apprenants', form);
            }
            navigate('/apprenants');
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'enregistrement. Vérifiez les champs.");
        }
    };

    if (loading) return <div className="state-box">Chargement des données...</div>;

    return (
        <div>
            <Link to="/apprenants" className="back-link">← Retour à la liste</Link>

            <div className="card form-card">
                <h2>{isEditMode ? "Modifier l'apprenant" : "Ajouter un apprenant"}</h2>
                <p className="sub">Renseignez les informations de l'apprenant.</p>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field">
                            <label>CIN</label>
                            <input value={form.cin} onChange={e => setForm({ ...form, cin: e.target.value })} />
                        </div>
                        <div className="field">
                            <label>Numéro</label>
                            <input value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
                        </div>
                        <div className="field">
                            <label>Nom</label>
                            <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
                        </div>
                        <div className="field">
                            <label>Prénom</label>
                            <input value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
                        </div>
                        <div className="field full">
                            <label>Email</label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        </div>
                        <div className="field full">
                            <label>Date de 1ère inscription</label>
                            <input type="date" value={form.datePremiereInscription} onChange={e => setForm({ ...form, datePremiereInscription: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-success">
                            {isEditMode ? "Mettre à jour" : "Ajouter"}
                        </button>
                        <Link to="/apprenants" className="btn btn-ghost">Annuler</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
