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
                const [resApprenants, resSessions] = await Promise.all([
                    axiosClient.get('/apprenants'),
                    axiosClient.get('/sessions')
                ]);
                setApprenants(resApprenants.data);
                setSessions(resSessions.data);

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
            navigate('/inscriptions');
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'enregistrement. Vérifiez les données.");
        }
    };

    if (loading) return <div className="state-box">Chargement...</div>;

    return (
        <div>
            <Link to="/inscriptions" className="back-link">← Retour à la liste</Link>

            <div className="card form-card">
                <h2>{isEditMode ? "Modifier l'inscription" : "Inscrire un apprenant"}</h2>
                <p className="sub">Associez un apprenant à une session de formation.</p>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="field full">
                            <label>Apprenant</label>
                            <select
                                value={form.apprenantId}
                                onChange={e => setForm({ ...form, apprenantId: e.target.value })}
                                required
                            >
                                <option value="">-- Choisir un apprenant --</option>
                                {apprenants.map(a => <option key={a.id} value={a.id}>{a.prenom} {a.nom}</option>)}
                            </select>
                        </div>

                        <div className="field full">
                            <label>Session</label>
                            <select
                                value={form.sessionId}
                                onChange={e => setForm({ ...form, sessionId: e.target.value })}
                                required
                            >
                                <option value="">-- Choisir une session --</option>
                                {sessions.map(s => <option key={s.id} value={s.id}>{s.description}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-success">
                            {isEditMode ? "Enregistrer les modifications" : "Inscrire"}
                        </button>
                        <Link to="/inscriptions" className="btn btn-ghost">Annuler</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
