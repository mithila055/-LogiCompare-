import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Profile() { const { user, login } = useAuth(); const [saved, setSaved] = useState(false); const [name, setName] = useState(user?.name || 'Rafi Ahmed'); return <div className="app-page"><div className="page-heading"><div><p className="eyebrow">Account settings</p><h1>Your profile</h1><p>Manage your contact details and saved pickup addresses.</p></div></div><form className="workflow-panel profile-form" onSubmit={(event) => { event.preventDefault(); login({ ...user, name }); setSaved(true); }}><Input label="Full name" value={name} onChange={(event) => setName(event.target.value)} /><Input label="Phone number" value="01700000000" readOnly /><Input label="Default pickup address" value="Dhaka, Bangladesh" readOnly /><Button type="submit">Save changes ↗</Button>{saved && <p className="success-message">Profile saved successfully.</p>}</form></div>; }
