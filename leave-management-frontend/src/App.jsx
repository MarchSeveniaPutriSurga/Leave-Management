import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreateLeaveRequest from './pages/CreateLeaveRequest';
import LeaveRequests from './pages/LeaveRequests';
import LeaveRequestDetail from './pages/LeaveRequestDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import AdminLeaveRequests from './pages/AdminLeaveRequests';
import AdminLeaveRequestDetail from './pages/AdminLeaveRequestDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leave-requests" element={<LeaveRequests />} />
          <Route path="/leave-requests/create" element={<CreateLeaveRequest />} />
          <Route path="/leave-requests/:id" element={<LeaveRequestDetail />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/leave-requests" element={<AdminLeaveRequests />} />
          <Route path="/admin/leave-requests/:id" element={<AdminLeaveRequestDetail />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;