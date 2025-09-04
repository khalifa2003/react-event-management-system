import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/components/Login.tsx";
import Register from "./features/auth/components/Register.tsx";
import ProtectedRoute from "./features/auth/ProtectedRoute.tsx";
import { PasswordResetFlow } from "./features/auth/components/ForgotPassword.tsx";
import { Toaster } from "react-hot-toast";
import CategoryManagement from "./features/categories/components/CategoryManagement.tsx";
import CreateUser from "./features/users/components/CreateUser.tsx";
import CreateCategory from "./features/categories/components/CreateCategory.tsx";
import UpdateUser from "./features/users/components/UpdateUser.tsx";
import EventManagement from "./features/events/components/EventManagement.tsx";
import UsersList from "./features/users/components/UsersList.tsx";
import UserProfile from "./features/users/components/UserProfile.tsx";
import CreateEvent from "./features/events/components/CreateEvent.tsx";
import EventDetails from "./features/events/components/EventDetails.tsx";
import UpdateEvent from "./features/events/components/UpdateEvent.tsx";
import BookTicket from "./features/tickets/components/BookTicket.tsx";
import MyTickets from "./features/tickets/components/MyTickets.tsx";
import AllTickets from "./features/tickets/components/AllTickets.tsx";
import UpdateCategory from "./features/categories/components/UpdateCategory.tsx";
import DashboardLayout from "./features/dashboard/components/DashboardLayout.tsx";
import Dashboard from "./features/dashboard/components/Dashboard.tsx";

function App() {
  return (
    <Router>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
            <Route path=":id" element={<EventDetails />} />
          </Route>
          <Route path="/tickets/*" element={<DashboardLayout />}>
            <Route path="" element={<MyTickets />} />
            <Route path=":eventId/tickets" element={<AllTickets />} />
            <Route path="book/:eventId" element={<BookTicket />} />
          </Route>
        </Route>
        <Route path="/users/*" element={<DashboardLayout />}>
          <Route path="profile" element={<UserProfile />} />
        </Route>
        <Route path="/categories/*" element={<DashboardLayout />}>
          <Route path="" element={<CategoryManagement />} />
        </Route>

        {/* Routes only for Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/categories/*" element={<DashboardLayout />}>
            <Route path="create" element={<CreateCategory />} />
            <Route path=":id/edit" element={<UpdateCategory />} />
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
