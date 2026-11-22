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
        <div>
            <div className="page-head">
                <div>
                    <h2>Inscriptions</h2>
                    <p>{inscriptions.length} inscription(s)</p>
                </div>
                {!isApprenant && (
                    <Link to="/inscriptions/nouveau" className="btn btn-primary">+ Nouvelle inscription</Link>
                )}
            </div>

            <div className="card table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Apprenant</th>
                            <th>Session</th>
                            {!isApprenant && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {inscriptions.length === 0 && (
                            <tr><td colSpan={isApprenant ? 4 : 5} className="empty">Aucune inscription pour le moment.</td></tr>
                        )}
                        {inscriptions.map(i => (
                            <tr key={i.id}>
                                <td className="id-cell">#{i.id}</td>
                                <td><span className="tag orange">{i.dateInscription}</span></td>
                                <td className="strong">{i.apprenantNomComplet}</td>
                                <td>{i.sessionDescription}</td>
                                {!isApprenant && (
                                    <td>
                                        <div className="actions">
                                            <Link to={`/inscriptions/${i.id}/edit`} className="btn btn-sm btn-edit">Modifier</Link>
                                            <button onClick={() => remove(i.id)} className="btn btn-sm btn-danger">Annuler</button>
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
