import React, { useEffect } from 'react';
import Nav from "./components/nav/Nav";
import Cart from "./components/cart/Cart";
import Footer from "./components/footer/Footer";
import { SidebarProvider } from "./components/nav/Sidebarcontext";
import {Outlet} from 'react-router-dom'
import { requestNotificationPermission } from './firebase';

const App = () => {
  useEffect(() => {
    const setupFCM = async () => {
      const token = await requestNotificationPermission();
      if (token) {
        // Send the token to the backend to store it for admin notifications
        await fetch('/api/admin/register-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      }
    };

    setupFCM();
  }, []);

  return (
    <SidebarProvider>
        <Nav />
        <Cart/>
        <Outlet/>
        <Footer />
    </SidebarProvider>
  );
};

export default App;

