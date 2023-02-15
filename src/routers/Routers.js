import {Routes, Route} from 'react-router-dom'
import Prefetch from '../features/auth/Prefetch'
import PersistLogin from '../features/auth/PersistLogin'
import RequireAuth from '../features/auth/RequireAuth'
import { ROLES } from '../config/roles'
//{/* getting all data from pages folder/}

import Home from '../pages/Home'
import AccountChecker from '../pages/Chooser'
import Account from '../pages/AccountControler/Admin/Admin'
import AccountMenu from '../pages/AccountControler/Admin/Setting'

import Seller from '../pages/AccountControler/SellerPage/SellerList'
import AddProduct from '../pages/AccountControler/SellerPage/AddItem'
import ManageOrder from '../pages/AccountControler/SellerPage/OrderRecord'
import AccountSetting from '../pages/AccountControler/SellerPage/Profile'
import ManageProduct from '../pages/AccountControler/SellerPage/ManageProduct'
import UpdateProduct from '../pages/AccountControler/SellerPage/UpdateProduct'
import ItemDescription from '../pages/AccountControler/SellerPage/ItemDescription'


import Customer from '../pages/AccountControler/CustomerPage/Customer'
import ManageAddress from '../pages/AccountControler/CustomerPage/Address'
import SettingCustomer from '../pages/AccountControler/CustomerPage/Profile' 
import CustomerOrder from '../pages/AccountControler/CustomerPage/Order'
import Cart from '../pages/AccountControler/CustomerPage/Cart'

import SellerShop from '../pages/SellerShop'
import ProductDescription from '../pages/ItemDescription' 
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import SellerSignUp from '../pages/SellerRegister'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import PhoneLogin from '../pages/PhoneLogin'
import SignUpEmailSubmitCode from '../pages/signUpSubmitEmailCode'
import Verify from '../pages/Verify'
import Shop from '../components/shop/Search'
import SMSLogin from '../pages/SMSLogin'
//{/* creating path/}
const Routers = () => {
  return (
    <Routes>
        <Route path="/*" element={<Home/>} />
        <Route path='/fatandcap/home' element={<Home/>} />
        <Route path='/fatandcap/auth/register' element={<Signup/>} />
        <Route path='/fatandcap/auth/sellersignup' element={<SellerSignUp/>} />
        <Route path='/fatandcap/shop/item/details' element={<ProductDescription/>} />
        <Route path='/fatandcap/seller/shop/:id' element={<SellerShop/>} />
        <Route path='/fatandcap/shop/product' element={<Shop/>} />
        <Route path='/fatandcap/auth/forgotpassword' element={<ForgotPassword/>} />
        <Route path='/fatandcap/auth/resetpassword' element={<ResetPassword/>} />
        <Route path='/fatandcap/auth/verify' element={<Verify/>} />
        <Route path='/fatandcap/auth/login' element={<Login/>} />
        <Route path='/fatandcap/auth/mobilelogin' element={<SMSLogin/>} />
        <Route path='/fatandcap/auth/smslogin' element={<PhoneLogin/>} />
        <Route path='/fatandcap/auth/otp/submit' element={<SignUpEmailSubmitCode/>} />
        <Route path="/checker" element={<AccountChecker/>} />
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[ROLES.customer]} />}>
          <Route element={<Prefetch />}>
            <Route path='/fatandcap/auth/customer' element={<Customer/>} />
            <Route path='/fatandcap/auth/customer/deliverylocation' element={<ManageAddress/>} />
            <Route path='/fatandcap/auth/customer/AccountSetting' element={<SettingCustomer/>} />
            <Route path='/fatandcap/auth/customer/manageorder' element={<CustomerOrder/>} />
            <Route path='/fatandcap/auth/customer/cart' element={<Cart/>} />
          </Route>
        </Route>
      </Route>
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
          <Route element={<Prefetch />}>
            <Route path='/fatandcap/auth/userseller' element={<Account/>} />
            <Route path='/fatandcap/auth/userseller/AccountSetting' element={<AccountMenu/>} />
          </Route>
        </Route>
      </Route>
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[ROLES.seller]} />}>
          <Route element={<Prefetch />}>
              <Route path='/fatandcap/auth/seller' element={<Seller/>} />
              <Route path='/fatandcap/auth/seller/addproduct' element={<AddProduct/>} />
              <Route path='/fatandcap/auth/seller/manageorder' element={<ManageOrder/>} />
              <Route path='/fatandcap/auth/seller/manageproduct' element={<ManageProduct/>} />
              <Route path='/fatandcap/auth/seller/updateproduct/:itemId' element={<UpdateProduct/>} />
              <Route path='/fatandcap/auth/seller/AccountSetting' element={<AccountSetting/>} />
              <Route path='/fatandcap/auth/seller/product/details/:itemId' element={<ItemDescription/>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default Routers //{/* export data to layout/}
