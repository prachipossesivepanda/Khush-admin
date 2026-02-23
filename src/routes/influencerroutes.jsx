import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../influencer/influencercomponents/Auth/Login";
import VerifyOtpPage from "../influencer/influencercomponents/Auth/otp";
import Layout from "../influencer/influencercomponents/common/sidebar";
// import ProtectedRoute from "../utils/ProtectedRoute";
import Dashboard from "../influencer/influencercomponents/dashboard/Dashboard";

const InfluencerRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<Login />} />
      <Route path="verify-otp" element={<VerifyOtpPage />} />

      {/* <Route element={<ProtectedRoute />}> */}
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      {/* </Route> */}

      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default InfluencerRoutes;