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
        <div style={{ padding: 30 }}>
            <Link to="/accueil">← Accueil</Link>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Gestion des Apprenants</h2>
                {isAdmin && (
                    <Link to="/apprenants/nouveau">
                        <button style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                            + Ajouter un apprenant
                        </button>
                    </Link>
                )}
            </div>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Numéro</th>
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {apprenants.map(a => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.nom}</td>
                            <td>{a.prenom}</td>
                            <td>{a.email}</td>
                            <td>{a.numero}</td>
                            {isAdmin && (
                                <td>
                                    {/* Utilisation de Link pour aller vers la page d'édition */}
                                    <Link to={`/apprenants/${a.id}/edit`}>
                                        <button style={{ marginRight: 10, cursor: 'pointer' }}>Modifier</button>
                                    </Link>
                                    <button onClick={() => remove(a.id)} style={{ color: 'red', cursor: 'pointer' }}>Supprimer</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}