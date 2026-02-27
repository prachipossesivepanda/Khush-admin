import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute";
// Import driver auth components when available
 import DriverLogin from "../driver/drivercomponent/Auth/Login";
 import DriverOTP from "../driver/drivercomponent/Auth/Otp";
import DriverDashboard from "../driver/drivercomponent/dashboard/home";
const DriverRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes - Add when driver login/OTP components are created */}
      <Route path="login" element={<DriverLogin />} /> 
      <Route path="verify-otp" element={<DriverOTP />} />  
      <Route path="dashboard" element={<DriverDashboard/>}/>
      {/* Protected Routes - Add your driver dashboard and other pages here */}
       {/* Example: */}
       {/* <Route 
        path="dashboard" 
        element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <DriverDashboard />
          </ProtectedRoute>
        } 
      />  */}
      
      {/* Redirect root to login */}
      <Route path="/driver" element={<Navigate to="/driver/login" replace />} />
      
      <Route path="*" element={<Navigate to="/driver/login" replace />} />
    </Routes>
  );
};

export default DriverRoutes;
