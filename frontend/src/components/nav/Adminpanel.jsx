// Adminpanel.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminOrderList from "./AdminOrderList";
import { toast } from "react-toastify";
import {io} from 'socket.io-client'

export default function Adminpanel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmedOrderIds, setConfirmedOrderIds] = useState(new Set());
  const [updateTrigger, setUpdateTrigger] = useState(false); // State to track updates

    const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://newrepo-backend.vercel.app/getorders");
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
    const socket = io("http://localhost:8080");
    socket.on("orderUpdated",() => {
      fetchData();
    }
    )
    return () => {
      socket.disconnect();
    }
    
  }, [updateTrigger]); 

  const handleTableIdUpdate = () => {
    setUpdateTrigger((prev) => !prev); // Toggle the state to trigger useEffect
  };

  if (loading) {
    return (
      <div className="mt-[10vh] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        <span className=" h-[50vh] w-full text-center  text-3xl ">Loading order data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <h2 className="text-xl font-semibold mb-2">Error Loading Orders</h2>
        <p>{error.message}</p>
        {error.response && (
          <div>
            <p>Status: {error.response.status}</p>
            {error.response.data && (
              <pre className="mt-2">
                {JSON.stringify(error.response.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    );
  }

  const handleConfirmPayment = async (orderId) => {
    try {
      await axios.post("https://newrepo-backend.vercel.app/confirm-payment", {
        orderId,
      });
      setConfirmedOrderIds((prevSet) => new Set(prevSet).add(orderId));
    } catch (err) {
      console.error("Error confirming payment:", err);
      notifyError("Failed to confirm payment. Check console.");
    }
  };

  const handlePaid = async (orderId) => {
    if (!confirmedOrderIds.has(orderId)) {
      notifyError("Order must be confirmed before marking as paid.");
      return;
    }
    try {
      await axios.patch(`https://newrepo-backend.vercel.app/orders/${orderId}/paid`, {
        paid: true,
      });
      setData((prevData) =>
        prevData.map((order) =>
          order._id === orderId ? { ...order, paid: true } : order
        )
      );
      setConfirmedOrderIds((prevSet) => {
        const newSet = new Set(prevSet);
        newSet.delete(orderId);
        return newSet;
      });
    } catch (err) {
      console.error("Error marking order as paid:", err);
      notifyError("Failed to mark order as paid.");
    }
  };

  return (
    <div className="p-6 min-h-[50vh]">
      {data.length > 0 ? (
        <AdminOrderList
          orders={data}
          confirmedOrderIds={confirmedOrderIds}
          handleConfirmPayment={handleConfirmPayment}
          handlePaid={handlePaid}
          onTableIdUpdate={handleTableIdUpdate} // Pass the callback to AdminOrderList
        />
      ) : (
        <div className="text-gray-600 italic">No orders found.</div>
      )}
    </div>
  );
}
