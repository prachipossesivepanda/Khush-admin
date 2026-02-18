import { Routes, Route } from "react-router-dom";

import Login from "../admin/components/Auth/Login";
import OTP from "../admin/components/Auth/Otp";
import Layout from "../admin/components/common components/Layout";
import Dashboard from "../admin/components/Dashboard/Dashboard";
import Categories from "../admin/components/inventory/category";
import Subcategories from "../admin/components/inventory/Subcategory";
import Items from "../admin/components/inventory/item";
import ItemDetails from "../admin/components/inventory/Itemdetails";
import Banner from "../admin/components/Banner/Banner";
import Brand from "../admin/components/Brands/Brands";
import Section from "../admin/components/Section/Section";
import Feature from "../admin/components/Features/Feature";
import FeatureForm from "../admin/components/Features/FeatureForm";
import Filter from "../admin/components/Filter/Filter";
import FilterForm from "../admin/components/Filter/FilterForm";
import CategoryForm from "../admin/components/inventory/CategoryForm";
import SubcategoryForm from "../admin/components/inventory/SubcategoryForm";
import ItemForm from "../admin/components/inventory/ItemForm";
import BrandForm from "../admin/components/Brands/BrandForm";
import SectionForm from "../admin/components/Section/SectionForm";
import BannerForm from "../admin/components/Banner/BannerForm";
import CouponForm from "../admin/components/coupon/couponform";
import CouponPage from "../admin/components/coupon/coupon";
import CartChargeForm from "../admin/components/cart/cartform";
import CartChargesPage from "../admin/components/cart/cart";
import PincodeForm from "../admin/components/Pincode/pincodefor";
import PincodePage from "../admin/components/Pincode/pincode";
import SplashForm from "../admin/components/splash/splashform";
import SplashPage from "../admin/components/splash/splash";
import Delivery from "../admin/components/Delivery/Delivery";
import SubAdmin from "../admin/components/create subadmin/subadmin";
import SubAdminForm from "../admin/components/create subadmin/subadminform";
import Influencer from "../admin/components/influencer/influencer";
import InfluencerForm from "../admin/components/influencer/influuencerform";
import Deliveryagent from "../admin/components/Deliveryagent/Deliveryagent";
import DeliveryAgentForm from "../admin/components/Deliveryagent/Deliveryagentform";
import Warehouse from "../admin/components/Warehouse/Warehouse";
import WarehouseForm from "../admin/components/Warehouse/WarehouseForm";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/admin/otp" element={<OTP />} />

      {/* Layout Routes */}
      <Route element={<Layout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/inventory/categories" element={<Categories />} />
        <Route path="/admin/inventory/categories/create" element={<CategoryForm />} />
        <Route path="/admin/inventory/categories/edit/:id" element={<CategoryForm />} />
        <Route path="/admin/inventory/subcategories/:categoryId" element={<Subcategories />} />
        <Route path="/admin/inventory/subcategories/:categoryId/create" element={<SubcategoryForm />} />
        <Route path="/admin/inventory/subcategories/:categoryId/edit/:id" element={<SubcategoryForm />} />
        <Route path="/admin/inventory/items/:categoryId/:subcategoryId" element={<Items />} />
        <Route path="/admin/inventory/items/:categoryId/:subcategoryId/create" element={<ItemForm />} />
        <Route path="/admin/inventory/items/:categoryId/:subcategoryId/edit/:id" element={<ItemForm />} />
        <Route path="/admin/inventory/items/:itemId" element={<ItemDetails />} />

        <Route path="/admin/banners" element={<Banner />} />
        <Route path="/admin/banners/create" element={<BannerForm />} />
        <Route path="/admin/banners/edit/:id" element={<BannerForm />} />

        <Route path="/admin/brands" element={<Brand />} />
        <Route path="/admin/brands/create" element={<BrandForm />} />
        <Route path="/admin/brands/edit/:id" element={<BrandForm />} />

        <Route path="/admin/sections" element={<Section />} />
        <Route path="/admin/sections/create" element={<SectionForm />} />
        <Route path="/admin/sections/edit/:id" element={<SectionForm />} />

        <Route path="/admin/features" element={<Feature />} />
        <Route path="/admin/features/create" element={<FeatureForm />} />
        <Route path="/admin/features/edit/:id" element={<FeatureForm />} />

        <Route path="/admin/filters" element={<Filter />} />
        <Route path="/admin/filters/create" element={<FilterForm />} />
        <Route path="/admin/filters/edit/:id" element={<FilterForm />} />

        <Route path="/admin/coupons" element={<CouponPage />} />
        <Route path="/admin/coupons/create" element={<CouponForm />} />
        <Route path="/admin/coupons/edit/:id" element={<CouponForm />} />

        <Route path="/admin/cart-charges" element={<CartChargesPage />} />
        <Route path="/admin/cart-charges/create" element={<CartChargeForm />} />
        <Route path="/admin/cart-charges/edit/:id" element={<CartChargeForm />} />

        <Route path="/admin/pincode" element={<PincodePage />} />
        <Route path="/admin/pincode/create" element={<PincodeForm />} />
        <Route path="/admin/pincode/edit/:pincode" element={<PincodeForm />} />

        <Route path="/admin/splash" element={<SplashPage />} />
        <Route path="/admin/splash/create" element={<SplashForm />} />
        <Route path="/admin/splash/edit" element={<SplashForm />} />

        <Route path="/admin/delivery" element={<Delivery />} />

        <Route path="/admin/subadmin" element={<SubAdmin />} />
        <Route path="/admin/subadmin/create" element={<SubAdminForm />} />
        <Route path="/admin/subadmin/edit/:id" element={<SubAdminForm />} />

        <Route path="/admin/influencer" element={<Influencer />} />
        <Route path="/admin/influencer/create" element={<InfluencerForm />} />
        <Route path="/admin/influencer/edit/:id" element={<InfluencerForm />} />

        <Route path="/admin/driver" element={<Deliveryagent />} />
        <Route path="/admin/driver/create" element={<DeliveryAgentForm />} />
        <Route path="/admin/driver/edit/:id" element={<DeliveryAgentForm />} />

        <Route path="/admin/warehouse" element={<Warehouse />} />
        <Route path="/admin/warehouse/create" element={<WarehouseForm />} />
        <Route path="/admin/warehouse/edit/:id" element={<WarehouseForm />} />
      </Route>

      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
};

export default AdminRoutes;
