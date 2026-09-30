import { Link, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function CustomerLayout() { const { user, logout } = useAuth(); return <div className="react-layout"><header className="react-header"><Link className="brand" to="/"><span className="brand-mark">LC</span><span>LogiCompare</span></Link><nav><Link to="/compare">Compare</Link><Link to="/booking">Book pickup</Link><Link to="/tracking">Track</Link><Link to="/profile">Profile</Link></nav><div className="react-user">{user?.name || 'Customer'}<button type="button" onClick={logout}>Log out</button></div></header><Outlet /></div>; }
