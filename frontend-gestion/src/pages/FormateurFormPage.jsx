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
            navigate('/formateurs');
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'enregistrement. Vérifiez les champs.");
        }
    };

    if (loading) return <div className="state-box">Chargement...</div>;

    return (
        <div>
            <Link to="/formateurs" className="back-link">← Retour à la liste</Link>

            <div className="card form-card">
                <h2>{isEditMode ? "Modifier le formateur" : "Ajouter un formateur"}</h2>
                <p className="sub">Renseignez les informations du formateur.</p>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field full">
                            <label>CIN</label>
                            <input value={form.cin} onChange={e => setForm({ ...form, cin: e.target.value })} required />
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
                        <div className="field">
                            <label>Grade</label>
                            <input value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
                        </div>
                        <div className="field">
                            <label>Fonction</label>
                            <input value={form.fonction} onChange={e => setForm({ ...form, fonction: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-success">
                            {isEditMode ? "Mettre à jour" : "Ajouter"}
                        </button>
                        <Link to="/formateurs" className="btn btn-ghost">Annuler</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
