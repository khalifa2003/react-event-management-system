import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/components/Login.page";
import RegisterPage from "./features/auth/components/Register.page";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import { PasswordResetFlow } from "./features/auth/components/ForgotPassword.page";
import DashboardLayout from "./features/dashboard/components/DashboardLayout";
import { Toaster } from "react-hot-toast";
import CategoryManagement from "./features/categories/components/CategoryManagement";
import CreateUser from "./features/users/components/CreateUser";
import UpdateUser from "./features/users/components/UpdateUser";
import AttendeeInsights from "./features/attendence/Attendence";
import EventAttendeeInsights from "./features/attendenceDetails/AttendenceDetails";
import CreateCategoryPage from "./features/categories/components/CreateCategory";
import UpdateCategoryPage from "./features/categories/components/UpdateCategory";
import Dashboard from "./features/dashboard/components/Dashboard.page";
import EventManagement from "./features/events/components/EventManagement";
import UsersList from "./features/users/components/UsersList";
import UserProfile from "./features/users/components/UserProfile";
import CreateEvent from "./features/events/components/CreateEventPage";
import EventDetailsPage from "./features/events/components/EventDetails";
import UpdateEvent from "./features/events/components/UpdateEventPage";
import BookTicket from "./features/tickets/components/BookTicket";
function App() {
  return (
    <Router>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
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
            <Route path="create" element={<CreateEvent />} />
            <Route path=":id/edit" element={<UpdateEvent />} />
            <Route path=":id" element={<EventDetailsPage />} />
          </Route>
          <Route path="/attendees/*" element={<DashboardLayout />}>
            <Route path="" element={<AttendeeInsights />} />
            <Route path=":id" element={<EventAttendeeInsights />} />
          </Route>
          <Route path="/tickets/*" element={<DashboardLayout />}>
            <Route path="book/:eventId" element={<BookTicket />} />
            <Route path=":id" element={<EventAttendeeInsights />} />
          </Route>
          <Route path="/categories/*" element={<DashboardLayout />}>
            <Route path="" element={<CategoryManagement />} />
            <Route path="create" element={<CreateCategoryPage />} />
            <Route path=":id/edit" element={<UpdateCategoryPage />} />
          </Route>
          <Route path="/users/*" element={<DashboardLayout />}>
            <Route path="" element={<UsersList />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="create" element={<CreateUser />} />
            <Route path=":id/edit" element={<UpdateUser />} /> 
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
