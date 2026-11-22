import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MENU_ITEMS, ROLE_LABELS, canSee, roleClass } from '../components/menuConfig';

export default function AccueilPage() {
    const { user } = useAuth();

    const tiles = MENU_ITEMS.filter(item => !item.hideOnHome && canSee(item, user));

    return (
        <div>
            <section className="hero">
                <h1>Bonjour, {user.username} 👋</h1>
                <p>Bienvenue sur l'application de gestion des formations.</p>
                {user.roles.map(r => (
                    <span key={r} className={`role-badge ${roleClass(r)}`} style={{ marginRight: 8 }}>
                        {ROLE_LABELS[r] || r}
                    </span>
                ))}
            </section>

            <h3 className="section-title">Accès rapide</h3>
            <div className="tiles">
                {tiles.map(item => (
                    <Link key={item.to} to={item.to} className="tile">
                        <div className="tile-ico">{item.icon}</div>
                        <h3>{item.label}</h3>
                        <p>{item.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
