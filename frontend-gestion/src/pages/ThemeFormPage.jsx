import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function ThemeFormPage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [form, setForm] = useState({ theme: '', motsCles: '' });
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);

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
            navigate('/themes');
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'enregistrement. Vérifiez les champs.");
        }
    };

    if (loading) return <div className="state-box">Chargement...</div>;

    return (
        <div>
            <Link to="/themes" className="back-link">← Retour à la liste</Link>

            <div className="card form-card">
                <h2>{isEditMode ? "Modifier le thème" : "Ajouter un thème"}</h2>
                <p className="sub">Décrivez le thème de formation.</p>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field full">
                            <label>Intitulé du thème</label>
                            <input value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })} required />
                        </div>
                        <div className="field full">
                            <label>Mots-clés</label>
                            <input value={form.motsCles} onChange={e => setForm({ ...form, motsCles: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-success">
                            {isEditMode ? "Mettre à jour" : "Ajouter"}
                        </button>
                        <Link to="/themes" className="btn btn-ghost">Annuler</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
