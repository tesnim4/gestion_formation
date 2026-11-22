import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function InscriptionsPage() {
    const [inscriptions, setInscriptions] = useState([]);
    const { user } = useAuth();
    const isApprenant = user?.roles?.includes('ROLE_APPRENANT');

    const loadData = () => {
        axiosClient.get('/inscriptions').then(res => setInscriptions(res.data));
    };

    useEffect(() => { 
        loadData(); 
    }, []);

    const remove = async (id) => {
        if (window.confirm('Annuler cette inscription ?')) {
            await axiosClient.delete(`/inscriptions/${id}`);
            loadData();
        }
    };

    return (
        <div style={{ padding: 30 }}>
            <Link to="/accueil">← Retour à l'accueil</Link>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Gestion des Inscriptions</h2>
                {!isApprenant && (
                    <Link to="/inscriptions/nouveau">
                        <button style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                            + Nouvelle Inscription
                        </button>
                    </Link>
                )}
            </div>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f4f4f4' }}>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Apprenant</th>
                        <th>Session</th>
                        {!isApprenant && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {inscriptions.map(i => (
                        <tr key={i.id}>
                            <td>{i.id}</td>
                            <td>{i.dateInscription}</td>
                            <td>{i.apprenantNomComplet}</td>
                            <td>{i.sessionDescription}</td>
                            {!isApprenant && (
                                <td>
                                    <Link to={`/inscriptions/${i.id}/edit`}>
                                        <button style={{ marginRight: 10, cursor: 'pointer' }}>Modifier</button>
                                    </Link>
                                    <button onClick={() => remove(i.id)} style={{ color: 'red', cursor: 'pointer' }}>Annuler</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}