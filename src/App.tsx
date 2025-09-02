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
import CreateEventPage from "./features/events/components/CreateEventPage";
import CreateCategoryPage from "./features/categories/components/createCategory";

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
        
        <Route path="/dashboard/*" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          {/* Nested routes inside dashboard layout */}
          <Route index element={<Dashboard />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="events/create" element={<CreateEventPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="attendees" element={<AttendeeInsights />} />
          <Route path="attendees/:id" element={<EventAttendeeInsights />} />

          {/* Categories */}
          <Route path="categories/create" element={<CreateCategoryPage />} />
        </Route>


        {/* Events Management Routes */}
        <Route  path="/events"  element={ <ProtectedRoute> <DashboardLayout /> </ProtectedRoute>}>
          <Route index element={<EventManagement />} />
          <Route path="create" element={<CreateEventPage />} />
          <Route path=":id" element={<EventDetailsPage />} />
        </Route>

        <Route 
          path="/attendees" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AttendeeInsights />} />
          <Route path=":id" element={<EventAttendeeInsights />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;