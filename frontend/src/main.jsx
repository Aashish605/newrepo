import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Contactus from "./components/nav/Contactus";
import Aboutus from "./components/nav/Aboutus";
import Cart_lists from "./components/cart/Cart_lists";
import AddItems from "./components/additems/Add_items";
import Adminpanel from "./components/nav/Adminpanel";
import WrapComponent from './Wrapcomponent.jsx'
import Protectedroute from './components/protectedroute/Protectedroute.jsx'
import Signup from "./components/login_admin/Signup";
import Login from "./components/login_admin/Login";
import Failure from "./components/Esewa/Failure.jsx";
import Sucess from "./components/Esewa/Sucess.jsx";
import PaymentForm from "./components/Esewa/PaymentForm.jsx";

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    <Route path='' element={<WrapComponent />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route element={<Protectedroute />}>
      <Route path="/adminpanel" element={<Adminpanel />} />
      <Route path="/additems" element={<AddItems />} /> 
    </Route>
    <Route path="/contactus" element={<Contactus />} />
    <Route path="/aboutus" element={<Aboutus />} />
    <Route path="/carting" element={<Cart_lists />} />
    <Route path='/pay' element={<PaymentForm/>} />
    <Route path='/pay-sucess' element={<Sucess/>} />
    <Route path='/pay-fail' element={<Failure/>} />
  </Route>
));
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
      limit={2}
      newestOnTop={true}
    />
  </StrictMode>,
)
