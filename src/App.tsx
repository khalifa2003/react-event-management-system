import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/components/Login.page";
import RegisterPage from "./features/auth/components/Register.page"
import Dashboard from "./features/dashboard/components/dashboard.component";
import DashboardLayout from "./features/dashboard/components/dashboard-layout.page";

// import ManageEvents from "./pages/ManageEvents";
// import BookingTickets from "./pages/BookingTickets";
// import AttendeeInsights from "./pages/AttendeeInsights";
// import Analytics from "./pages/Analytics";
// import ContactSupport from "./pages/ContactSupport";
// import Notifications from "./pages/Notifications";
// import Settings from "./pages/Settings";
// import Marketing from "./pages/Marketing";
// import EventCategories from "./pages/EventCategories";
// import ManageUsers from "./pages/ManageUsers";

import ProtectedRoute from "./features/auth/ProtectedRoute";
import { PasswordResetFlow } from "./features/auth/components/ForgotPassword.page";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/forgot-password" 
          element={<PasswordResetFlow />} 
        />
        
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          {/* Nested routes inside dashboard layout */}
          <Route index element={<Dashboard />} />
          {
          /* 
          <Route path="events" element={<ManageEvents />} />
          <Route path="bookings" element={<BookingTickets />} />
          <Route path="attendees" element={<AttendeeInsights />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="support" element={<ContactSupport />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="categories" element={<EventCategories />} />
          <Route path="users" element={<ManageUsers />} /> */
          }
        </Route>

        {/* Redirect root to login or dashboard based on auth */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch all route - 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;