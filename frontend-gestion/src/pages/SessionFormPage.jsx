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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resThemes, resFormateurs] = await Promise.all([
                    axiosClient.get('/themes'),
                    axiosClient.get('/formateurs')
                ]);
                setThemes(resThemes.data);
                setFormateurs(resFormateurs.data);

                if (isEditMode) {
                    const resSession = await axiosClient.get(`/sessions/${id}`);
                    const s = resSession.data;

                    setForm({
                        description: s.description || '',
                        dateDebut: s.dateDebut ? s.dateDebut.split('T')[0] : '',
                        dateFin: s.dateFin ? s.dateFin.split('T')[0] : '',
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

        if (form.dateDebut && form.dateFin && form.dateFin <= form.dateDebut) {
            setError("La date de fin doit être postérieure à la date de début.");
            return;
        }
        setError(null);
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

    if (loading) return <div className="state-box">Chargement...</div>;

    return (
        <div>
            <Link to="/sessions" className="back-link">← Retour à la liste</Link>

            <div className="card form-card">
                <h2>{isEditMode ? "Modifier la session" : "Créer une session"}</h2>
                <p className="sub">Définissez la période, le thème et le formateur.</p>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field full">
                            <label>Description</label>
                            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                        </div>

                        <div className="field">
                            <label>Date début</label>
                            <input type="date" value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })} required />
                        </div>
                        <div className="field">
                            <label>Date fin</label>
                            <input type="date" value={form.dateFin} min={form.dateDebut} onChange={e => setForm({ ...form, dateFin: e.target.value })} required />
                        </div>

                        <div className="field">
                            <label>Thème</label>
                            <select value={form.themeId} onChange={e => setForm({ ...form, themeId: e.target.value })} required>
                                <option value="">-- Sélectionner un thème --</option>
                                {themes.map(t => <option key={t.id} value={t.id}>{t.theme}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label>Formateur</label>
                            <select value={form.formateurId} onChange={e => setForm({ ...form, formateurId: e.target.value })}>
                                <option value="">-- Sélectionner un formateur --</option>
                                {formateurs.map(f => <option key={f.id} value={f.id}>{f.nom} {f.prenom}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-success">
                            {isEditMode ? "Mettre à jour" : "Créer"}
                        </button>
                        <Link to="/sessions" className="btn btn-ghost">Annuler</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}