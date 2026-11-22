import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="app-shell">
            <Header onToggleSidebar={() => setSidebarOpen(o => !o)} />

            <div className="app-body">
                <Sidebar open={sidebarOpen} />
                <div
                    className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                />
                <main className="app-main">
                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>
    );
}
