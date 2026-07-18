import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import RequireAuth from './features/auth/RequireAuth';
import LoginPage from './features/auth/LoginPage';
import PortalShell from './features/account/components/PortalShell';
import AccountHomePage from './features/account/pages/AccountHomePage';
import HistoryPage from './features/account/pages/HistoryPage';
import VehiclesPage from './features/account/pages/VehiclesPage';
import TrackHomePage from './features/tracking/pages/TrackHomePage';
import TrackDetailPage from './features/tracking/pages/TrackDetailPage';
import TrackSearchPage from './features/tracking/pages/TrackSearchPage';

function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/conta' : '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/consulta" element={<TrackHomePage />} />
          <Route path="/busca" element={<TrackSearchPage />} />
          <Route path="/os/:id" element={<TrackDetailPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/conta" element={<PortalShell />}>
              <Route index element={<AccountHomePage />} />
              <Route path="historico" element={<HistoryPage />} />
              <Route path="veiculos" element={<VehiclesPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
