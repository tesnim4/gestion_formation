import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function SessionsPage() {
    const [sessions, setSessions] = useState([]);
    const { user } = useAuth();

    const isStaff = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_FORMATEUR');

    const loadSessions = () => {
        axiosClient.get('/sessions').then(res => setSessions(res.data));
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const remove = async (id) => {
        if (window.confirm('Supprimer cette session ?')) {
            await axiosClient.delete(`/sessions/${id}`);
            loadSessions();
        }
    };

    return (
        <div>
            <div className="page-head">
                <div>
                    <h2>Sessions</h2>
                    <p>{sessions.length} session(s) planifiée(s)</p>
                </div>
                {isStaff && (
                    <Link to="/sessions/nouvelle" className="btn btn-primary">+ Nouvelle session</Link>
                )}
            </div>

            <div className="card table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Description</th><th>Thème</th><th>Formateur</th><th>Début</th><th>Fin</th>
                            {isStaff && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.length === 0 && (
                            <tr><td colSpan={isStaff ? 7 : 6} className="empty">Aucune session pour le moment.</td></tr>
                        )}
                        {sessions.map(s => (
                            <tr key={s.id}>
                                <td className="id-cell">#{s.id}</td>
                                <td className="strong">{s.description}</td>
                                <td>{s.themeNom && <span className="tag">{s.themeNom}</span>}</td>
                                <td>{s.formateurNom}</td>
                                <td>{s.dateDebut}</td>
                                <td>{s.dateFin}</td>
                                {isStaff && (
                                    <td>
                                        <div className="actions">
                                            <Link to={`/sessions/${s.id}/edit`} className="btn btn-sm btn-edit">Modifier</Link>
                                            <button onClick={() => remove(s.id)} className="btn btn-sm btn-danger">Supprimer</button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}