import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function FormateursPage() {
    const [formateurs, setFormateurs] = useState([]);

    const load = () => axiosClient.get('/formateurs').then(res => setFormateurs(res.data));
    
    useEffect(() => { 
        load(); 
    }, []);

    const remove = async (id) => {
        if (window.confirm('Supprimer ce formateur ?')) {
            await axiosClient.delete(`/formateurs/${id}`);
            load();
        }
    };

    return (
        <div style={{ padding: 30 }}>
            <Link to="/accueil">← Accueil</Link>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2>Gestion des Formateurs</h2>
                <Link to="/formateurs/nouveau">
                    <button style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        + Ajouter un formateur
                    </button>
                </Link>
            </div>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f4f4f4' }}>
                    <tr>
                        <th>ID</th><th>Nom</th><th>Prénom</th><th>Email</th><th>Grade</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {formateurs.map(f => (
                        <tr key={f.id}>
                            <td>{f.id}</td>
                            <td>{f.nom}</td>
                            <td>{f.prenom}</td>
                            <td>{f.email}</td>
                            <td>{f.grade}</td>
                            <td>
                                <Link to={`/formateurs/${f.id}/edit`}>
                                    <button style={{ marginRight: 10, cursor: 'pointer' }}>Modifier</button>
                                </Link>
                                <button onClick={() => remove(f.id)} style={{ color: 'red', cursor: 'pointer' }}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}