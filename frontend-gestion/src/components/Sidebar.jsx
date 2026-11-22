import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MENU_ITEMS, canSee, sidebarTip } from './menuConfig';

export default function Sidebar({ open }) {
    const { user } = useAuth();
    const tip = sidebarTip(user);

    return (
        <aside className={`sidebar ${open ? 'open' : ''}`}>
            <p className="sidebar-title">Navigation</p>
            <nav>
                {MENU_ITEMS.filter(item => canSee(item, user)).map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="ico">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-card">
                <b>{tip.title}</b>
                {tip.text}
            </div>
        </aside>
    );
}
