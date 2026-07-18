import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/userRole';
import Dashboard from './Dashboard';

/** Tela inicial: dashboard (admin/atendente) ou pista (mecânico). */
export default function HomeIndex() {
  const { session } = useAuth();
  if (session?.role === UserRole.MECHANIC) {
    return <Navigate to="/pista" replace />;
  }
  return <Dashboard />;
}
