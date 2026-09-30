import DataGrid from '../../components/admin/DataGrid';
const rows = [{ id: 1, name: 'Rafi Ahmed', role: 'Customer', status: 'Active' }, { id: 2, name: 'RedX Operations', role: 'Courier partner', status: 'Verified' }];
export default function UsersList() { return <div className="app-page"><div className="page-heading"><div><p className="eyebrow">Admin / users</p><h1>Users and partners</h1></div></div><DataGrid columns={[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }]} rows={rows} /></div>; }
