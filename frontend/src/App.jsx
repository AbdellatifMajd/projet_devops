import { Route, Routes } from "react-router";
import AuthLayout from "./components/auth/AuthLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CheckAuth from "./components/auth/CheckAuth";
import UnAuth from "./components/admin/UnAuth";
import AdminLayout from "./components/admin/AdminLayout";
import BookingLayout from "./components/booking/BookingLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuthUser } from "./store/AuthSlice";
import Room from "./pages/admin/Room";
import BookingListing from "./pages/client/BookingListing";
import CheckoutBooking from "./pages/client/CheckoutBooking";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthUser());
  }, [dispatch]);


  return (
    <>
    <ToastContainer position="top-right" autoClose={1500}/>
      <Routes>
        <Route
          path="/"
          element={<CheckAuth user={user} isAuthenticated={isAuthenticated} />}
        />

        <Route
          path="/auth"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route  path="chambres"  element={<Room />} />
          <Route path="unAuth" element={<UnAuth />} />
        </Route>

        <Route
          path="/booking"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <BookingLayout />
            </CheckAuth>
          }
        >
          <Route path="listing" element={<BookingListing />} />
          <Route path="checkout" element={<CheckoutBooking />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
