import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function Cart() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("tableId");

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



  const handleCarting = () => {
    if (tableId) {
      navigate(`/carting?tableId=${tableId}`);
    } else {
      notifyError("Please scan a QR code first.");

    }
  };

  return (
    <div onClick={handleCarting}>
      <img src="./cart.svg" alt=""  className="fixed cursor-pointer border-white border-2 h-13 rounded-4xl right-10 bottom-[5vh] sm:bottom-[10vh] z-10 " />
    </div>

  );
}
