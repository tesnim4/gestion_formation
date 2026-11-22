import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function SessionsPage() {
    const [sessions, setSessions] = useState([]);

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
        <div style={{ padding: 30 }}>
            <Link to="/accueil">← Accueil</Link>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Gestion des Sessions</h2>
                <Link to="/sessions/nouvelle">
                    <button style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        + Nouvelle Session
                    </button>
                </Link>
            </div>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f4f4f4' }}>
                    <tr>
                        <th>ID</th><th>Description</th><th>Thème</th><th>Formateur</th><th>Début</th><th>Fin</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map(s => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.description}</td>
                            <td>{s.themeNom}</td>
                            <td>{s.formateurNom}</td>
                            <td>{s.dateDebut}</td>
                            <td>{s.dateFin}</td>
                            <td>
                                <Link to={`/sessions/${s.id}/edit`}>
                                    <button style={{ marginRight: 10, cursor: 'pointer' }}>Modifier</button>
                                </Link>
                                <button onClick={() => remove(s.id)} style={{ color: 'red', cursor: 'pointer' }}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}