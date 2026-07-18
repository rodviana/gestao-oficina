import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ToastProvider';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AttendantRoute from './components/AttendantRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import HomeIndex from './pages/HomeIndex';
import AdminUserRegister from './pages/AdminUserRegister';
import AdminUserList from './pages/AdminUserList';
import CustomerList from './pages/CustomerList';
import CustomerForm from './pages/CustomerForm';
import CustomerDetail from './pages/CustomerDetail';
import VehicleList from './pages/VehicleList';
import VehicleForm from './pages/VehicleForm';
import VehicleDetail from './pages/VehicleDetail';
import WorkOrderList from './pages/WorkOrderList';
import WorkOrderForm from './pages/WorkOrderForm';
import WorkOrderDetail from './pages/WorkOrderDetail';
import WorkOrderPrint from './pages/WorkOrderPrint';
import CatalogPage from './pages/CatalogPage';
import PartsPage from './pages/PartsPage';

function LoginRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Login />;
}

function CustomerEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/customers/${id}?edit=1`} replace />;
}

function VehicleEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/vehicles/${id}?edit=1`} replace />;
}

function VehicleHistoryRedirect() {
  const { id } = useParams();
  return <Navigate to={`/vehicles/${id}`} replace />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route element={<ProtectedRoute />}>
              <Route path="work-orders/:id/print" element={<WorkOrderPrint />} />
              <Route element={<Layout />}>
                <Route index element={<HomeIndex />} />
                <Route path="pista" element={<Home />} />
                <Route path="dashboard" element={<Navigate to="/" replace />} />
                <Route path="work-orders" element={<WorkOrderList />} />
                <Route element={<AttendantRoute />}>
                  <Route path="work-orders/new" element={<WorkOrderForm />} />
                  <Route path="customers/new" element={<CustomerForm />} />
                  <Route path="vehicles/new" element={<VehicleForm />} />
                </Route>
                <Route path="work-orders/:id" element={<WorkOrderDetail />} />
                <Route path="customers" element={<CustomerList />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="customers/:id/edit" element={<CustomerEditRedirect />} />
                <Route path="vehicles" element={<VehicleList />} />
                <Route path="vehicles/:id" element={<VehicleDetail />} />
                <Route path="vehicles/:id/edit" element={<VehicleEditRedirect />} />
                <Route path="vehicles/:id/history" element={<VehicleHistoryRedirect />} />
                <Route path="catalogs" element={<CatalogPage />} />
                <Route path="parts" element={<PartsPage />} />

                <Route element={<AdminRoute />}>
                  <Route path="admin" element={<Navigate to="/admin/users" replace />} />
                  <Route path="admin/users" element={<AdminUserList />} />
                  <Route path="admin/users/new" element={<AdminUserRegister />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
