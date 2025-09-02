import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/components/Login.page";
import RegisterPage from "./features/auth/components/Register.page";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import { PasswordResetFlow } from "./features/auth/components/ForgotPassword.page";
import DashboardLayout from "./features/dashboard/components/DashboardLayout";
import CreateEventPage from "./features/events/components/CreateEventPage";
import { Toaster } from "react-hot-toast";
import CategoryManagement from "./features/categories/components/CategoryManagement";
import AttendeeInsights from "./features/attendence/attendence";
import EventAttendeeInsights from "./features/attendenceDetails/attendenceDetails";
import CreateCategoryPage from "./features/categories/components/createCategory";
import UpdateCategoryPage from "./features/categories/components/updateCategory";
import Dashboard from "./features/dashboard/components/dashboard.page";
import EventDetailsPage from "./features/eventDetails/eventDetails";
import EventManagement from "./features/eventManagement/eventManagement";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<PasswordResetFlow />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/events/*" element={<DashboardLayout />}>
            <Route path="" element={<EventManagement />} />
            <Route path="create" element={<CreateEventPage />} />
            <Route path=":id" element={<EventDetailsPage />} />
          </Route>
          <Route path="/attendees/*" element={<DashboardLayout />}>
            <Route path="" element={<AttendeeInsights />} />
            <Route path=":id" element={<EventAttendeeInsights />} />
          </Route>
          <Route path="/categories/*" element={<DashboardLayout />}>
            <Route path="" element={<CategoryManagement />} />
            <Route path="create" element={<CreateCategoryPage />} />
            <Route path=":id/edit" element={<UpdateCategoryPage />} />
          </Route>
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<h1 className="text-center text-2xl mt-20">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
