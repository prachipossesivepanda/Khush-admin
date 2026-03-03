import { Routes, Route, Navigate } from "react-router-dom";

import DriverLogin from "../driver/drivercomponent/Auth/Login";
import DriverOTP from "../driver/drivercomponent/Auth/Otp";
import DriverDashboard from "../driver/drivercomponent/dashboard/home.jsx";
import Exchangeorder from "../driver/drivercomponent/dashboard/Exchangeorder.jsx";
import BottomNavLayout from "../driver/drivercomponent/common/bottomlayout";
import OrderDetails from "../driver/drivercomponent/Home/orderdetails.jsx";
import Exchangeorderdetails from "../driver/drivercomponent/Home/Exchangeorderdetails.jsx";
import Replacement from "../driver/drivercomponent/Home/Replacement.jsx";
import Reason from "../driver/drivercomponent/Reasons/reason.jsx";
import Payment from "../driver/drivercomponent/Payment/Payment.jsx";
import Cash from "../driver/drivercomponent/Payment/Cash.jsx"
import Online from "../driver/drivercomponent/Payment/Online.jsx"
import OrderHistory from "../driver/drivercomponent/Order/orderHistory.jsx";
import ExchangeOrderHistory from "../driver/drivercomponent/order/exchangeorderhistory.jsx";
import Deliveryhistory from "../driver/drivercomponent/order/Deliveredorderhstory.jsx";
import Details from "../driver/drivercomponent/order/Details.jsx";
import Profile from "../driver/drivercomponent/Profile/Profile.jsx"
const DriverRoutes = () => {
  return (
    <Routes>

      {/* Auth Routes */}
      <Route path="login" element={<DriverLogin />} />
      <Route path="verify-otp" element={<DriverOTP />} />

      {/* Routes WITH Bottom Navbar */}
      <Route element={<BottomNavLayout />}>
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="exchange-orders" element={<Exchangeorder/>}/>
        <Route path="order-history" element={<OrderHistory/>}/>
        <Route path="deliver-history" element={<Deliveryhistory/>}/>
              <Route path="deliveryhistory" element={<Deliveryhistory/>}/>
              <Route path="details" element={<Details/>}/>
              <Route path="profile" element={<Profile/>}/>

      </Route>
      <Route path="orderdetails" element={<OrderDetails/>}/>
      <Route path ="exchange-orderdetails" element={<Exchangeorderdetails/>}/>
      <Route path="replacement" element={<Replacement/>}/>
      <Route path ="reasons" element={<Reason/>}/>
      <Route path="payment" element={<Payment/>}/>
      <Route path="cash" element={<Cash/>}/>
      <Route path="online" element={<Online/>}/>
      <Route path="exchangeorderdetails" element={<ExchangeOrderHistory/>}/>
      {/* <Route path="deliveryhistory" element={<Deliveryhistory/>}/> */}
      
      {/* Redirects */}
      <Route path="/driver" element={<Navigate to="/driver/login" replace />} />
      <Route path="*" element={<Navigate to="/driver/login" replace />} />

    </Routes>
  );
};

export default DriverRoutes;