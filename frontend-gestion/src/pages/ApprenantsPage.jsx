import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function ApprenantsPage() {
    const [apprenants, setApprenants] = useState([]);
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    const load = () => axiosClient.get('/apprenants').then(res => setApprenants(res.data));

    useEffect(() => {
        load();
    }, []);

    const remove = async (id) => {
        if (window.confirm('Supprimer cet apprenant ?')) {
            await axiosClient.delete(`/apprenants/${id}`);
            load();
        }
    };

    return (
        <div>
            <div className="page-head">
                <div>
                    <h2>Apprenants</h2>
                    <p>{apprenants.length} apprenant(s) enregistré(s)</p>
                </div>
                {isAdmin && (
                    <Link to="/apprenants/nouveau" className="btn btn-primary">+ Ajouter un apprenant</Link>
                )}
            </div>

            <div className="card table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Numéro</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {apprenants.length === 0 && (
                            <tr><td colSpan={isAdmin ? 6 : 5} className="empty">Aucun apprenant pour le moment.</td></tr>
                        )}
                        {apprenants.map(a => (
                            <tr key={a.id}>
                                <td className="id-cell">#{a.id}</td>
                                <td className="strong">{a.nom}</td>
                                <td>{a.prenom}</td>
                                <td>{a.email}</td>
                                <td>{a.numero}</td>
                                {isAdmin && (
                                    <td>
                                        <div className="actions">
                                            <Link to={`/apprenants/${a.id}/edit`} className="btn btn-sm btn-edit">Modifier</Link>
                                            <button onClick={() => remove(a.id)} className="btn btn-sm btn-danger">Supprimer</button>
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
