import { Navigate, Route, Routes } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout/CustomerLayout';
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import CourierLayout from './layouts/CourierLayout/CourierLayout';
import PrivateRoute from './routes/PrivateRoute';
import CustomerHome from './pages/customer/Home';
import Compare from './pages/customer/Compare';
import Booking from './pages/customer/Booking';
import Tracking from './pages/customer/Tracking';
import Profile from './pages/customer/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import UsersList from './pages/admin/UsersList';
import AdminShipments from './pages/admin/Shipments';
import PricingRules from './pages/admin/PricingRules';
import AssignedTasks from './pages/courier/AssignedTasks';
import UpdateStatus from './pages/courier/UpdateStatus';

export default function App() {
  return <Routes>
    <Route element={<PrivateRoute role="customer"><CustomerLayout /></PrivateRoute>}>
      <Route path="/" element={<CustomerHome />} /><Route path="/compare" element={<Compare />} /><Route path="/booking" element={<Booking />} /><Route path="/tracking/:trackingId?" element={<Tracking />} /><Route path="/profile" element={<Profile />} />
    </Route>
    <Route element={<PrivateRoute role="admin"><AdminLayout />}>
      <Route path="/admin" element={<AdminDashboard />} /><Route path="/admin/users" element={<UsersList />} /><Route path="/admin/shipments" element={<AdminShipments />} /><Route path="/admin/pricing" element={<PricingRules />} />
    </Route>
    <Route element={<PrivateRoute role="courier"><CourierLayout />}>
      <Route path="/courier" element={<AssignedTasks />} /><Route path="/courier/status" element={<UpdateStatus />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
