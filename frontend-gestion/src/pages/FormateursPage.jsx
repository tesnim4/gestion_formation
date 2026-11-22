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
        <div>
            <div className="page-head">
                <div>
                    <h2>Formateurs</h2>
                    <p>{formateurs.length} formateur(s) enregistré(s)</p>
                </div>
                <Link to="/formateurs/nouveau" className="btn btn-primary">+ Ajouter un formateur</Link>
            </div>

            <div className="card table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Nom</th><th>Prénom</th><th>Email</th><th>Grade</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formateurs.length === 0 && (
                            <tr><td colSpan={6} className="empty">Aucun formateur pour le moment.</td></tr>
                        )}
                        {formateurs.map(f => (
                            <tr key={f.id}>
                                <td className="id-cell">#{f.id}</td>
                                <td className="strong">{f.nom}</td>
                                <td>{f.prenom}</td>
                                <td>{f.email}</td>
                                <td>{f.grade && <span className="tag green">{f.grade}</span>}</td>
                                <td>
                                    <div className="actions">
                                        <Link to={`/formateurs/${f.id}/edit`} className="btn btn-sm btn-edit">Modifier</Link>
                                        <button onClick={() => remove(f.id)} className="btn btn-sm btn-danger">Supprimer</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
