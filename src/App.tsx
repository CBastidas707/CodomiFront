import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import LoginForm from "./components/Auth/LoginForm";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminCommunication from "./pages/admin/AdminCommunication";
import AdminBuildings from "./pages/admin/AdminBuildings";
import Profile from "./pages/Profile";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerAnnouncements from "./pages/owner/OwnerAnnouncements";
import OwnerCommunication from "./pages/owner/OwnerCommunication";
import JuntaDashboard from "./pages/junta/JuntaDashboard";
import JuntaAnnouncements from "./pages/junta/JuntaAnnouncements";
import JuntaCommunication from "./pages/junta/JuntaCommunication";
import NotFound from "./pages/NotFound";
import AdminOwners from "./pages/admin/AdminOwners";
import AdminApartments from "./pages/admin/AdminApartments";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, selectedBuilding } = useAuth();
  
  if (!user) {
    return <LoginForm />;
  }
  
  // Require a building to be selected for all users
  if (!selectedBuilding) {
    return <LoginForm />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    const redirectPath = user.role === 'admin' ? '/admin' : user.role === 'junta' ? '/junta' : '/owner';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, selectedBuilding } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          user ? (
            !selectedBuilding ? (
              <LoginForm />
            ) : (
              <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'junta' ? '/junta' : '/owner'} replace />
            )
          ) : (
            <LoginForm />
          )
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/owners" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOwners />
          </ProtectedRoute>
        } />
        <Route path="/admin/apartments" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminApartments />
          </ProtectedRoute>
        } />
        <Route path="/admin/announcements" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAnnouncements />
          </ProtectedRoute>
        } />
        <Route path="/admin/communication" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCommunication />
          </ProtectedRoute>
        } />
        <Route path="/admin/buildings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminBuildings />
          </ProtectedRoute>
        } />
        
        {/* Profile Route - Available for all users */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['admin', 'owner', 'junta']}>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Owner Routes */}
        <Route path="/owner" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/owner/announcements" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerAnnouncements />
          </ProtectedRoute>
        } />
        <Route path="/owner/communication" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerCommunication />
          </ProtectedRoute>
        } />
        
        {/* Junta Routes */}
        <Route path="/junta" element={
          <ProtectedRoute allowedRoles={['junta']}>
            <JuntaDashboard />
          </ProtectedRoute>
        } />
        <Route path="/junta/announcements" element={
          <ProtectedRoute allowedRoles={['junta']}>
            <JuntaAnnouncements />
          </ProtectedRoute>
        } />
        <Route path="/junta/communication" element={
          <ProtectedRoute allowedRoles={['junta']}>
            <JuntaCommunication />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
