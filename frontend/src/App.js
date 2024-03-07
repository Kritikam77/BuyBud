import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import SellProduct from "./components/SellProduct.js";
import Me from "./components/Me.js";
import UpdateUserDetails from "./components/UpdateUserDetails.js";
import FindFriends from "./components/FindFriends.js";
import GetUser from "./components/GetUser.js";
import GetProduct from "./components/GetProduct.js";
import Cart from "./components/Cart.js";
import Wishlist from "./components/Wishlist.js";
import Notifications from "./components/Notifications.js";
import CreatePost from "./components/CreatePost.js";
import GetPost from "./components/GetPost.js";
import ChangePassword from "./components/ChangePassword.js";
import ForgotPassword from "./components/ForgotPassword.js";
import ResetPassword from "./components/ResetPassword.js";
import PageNotFound from "./components/PageNotFound.js";
import Admin from "./components/Admin.js";


import { useAuth } from "./components/AuthContext.js";

function App() {
  const { userName } = useAuth();


  return (
    <div className="App">
      <Header />
      <Routes>
        {userName ? (
          <>
            <Route path="/" element={<Navigate to="/home/feed" />} />
            <Route path="/login" element={<Navigate to="/home/feed" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        <Route path="/home" element={<Navigate to="/home/feed" />} />

        <Route path="/home/*" element={<Home />} />

        {/* user */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/me" element={<Navigate to="/me/products" />} />
        <Route path="/me/*" element={<Me />} />
        <Route path="/me/updateDetails" element={<UpdateUserDetails />} />
        <Route path="/me/changePassword" element={<ChangePassword />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-Password/:token" element={<ResetPassword />} />

        <Route path="/findfriends" element={<FindFriends />} />
        <Route path="/user/:id/*" element={<GetUser />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* products */}
        <Route path="/sellProduct" element={<SellProduct />} />
        <Route path="/getProduct/:id" element={<GetProduct />} />

        {/* post */}
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/posts/:id/comments" element={<GetPost />} />

        {/* admin */}
        <Route path="/admin" element={<Admin />} />

        {/* for anything else */}
        {/* <Route path="*" element={<PageNotFound/>}/> */}
      </Routes>
    </div>
  );
}

export default App;
