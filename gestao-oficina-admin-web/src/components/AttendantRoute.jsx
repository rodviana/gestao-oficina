import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';

/** Admin ou atendente — cadastros e abertura de OS. */
export default function AttendantRoute() {
  const { session } = useAuth();
  const role = session?.role;
  if (role !== UserRole.ADMIN && role !== UserRole.ATTENDANT) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
