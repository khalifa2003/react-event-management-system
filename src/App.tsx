import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/components/Login.page";
import RegisterPage from "./features/auth/components/Register.page"
import Dashboard from "./features/dashboard/components/dashboard.page";
import EventDetailsPage from "./features/eventDetails/eventDetails";
import EventManagement from "./features/eventManagement/eventManagement";
import AttendeeInsights from "./features/attendence/attendence";
import EventAttendeeInsights from "./features/attendenceDetails/attendenceDetails";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import { PasswordResetFlow } from "./features/auth/components/ForgotPassword.page";
import DashboardLayout from "./features/dashboard/components/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - No Sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/forgot-password" 
          element={<PasswordResetFlow />} 
        />
        
        {/* Dashboard Routes - With Sidebar */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes inside dashboard layout */}
          <Route index element={<Dashboard />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="attendees" element={<AttendeeInsights />} />
          <Route path="attendees/:id" element={<EventAttendeeInsights />} />
        </Route>

        {/* Events Management Route */}
        <Route 
          path="/events" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EventManagement />} />
        </Route>

        {/* Individual Event Details Route */}
        <Route 
          path="/events/:id" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EventDetailsPage />} />
        </Route>

        {/* Attendee Insights Route */}
        <Route 
          path="/attendees" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AttendeeInsights />} />
        </Route>

        {/* Event Attendee Insights Route */}
        <Route 
          path="/attendees/:id" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EventAttendeeInsights />} />
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