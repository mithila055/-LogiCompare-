import { Link, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function CourierLayout() { const { logout } = useAuth(); return <div className="react-layout courier-layout"><header className="react-header"><Link className="brand" to="/courier"><span className="brand-mark">LC</span><span>Courier partner</span></Link><nav><Link to="/courier">Assigned tasks</Link><Link to="/courier/status">Update status</Link></nav><button type="button" onClick={logout}>Log out</button></header><main className="react-main"><Outlet /></main></div>; }
