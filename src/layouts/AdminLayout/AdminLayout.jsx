import { Link, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function AdminLayout() { const { logout } = useAuth(); return <div className="react-layout admin-layout"><aside className="react-sidebar"><Link className="brand" to="/admin"><span className="brand-mark">LC</span><span>Admin</span></Link><Link to="/admin">Overview</Link><Link to="/admin/users">Users</Link><Link to="/admin/shipments">Shipments</Link><Link to="/admin/pricing">Pricing rules</Link><button type="button" onClick={logout}>Log out</button></aside><main className="react-main"><Outlet /></main></div>; }
