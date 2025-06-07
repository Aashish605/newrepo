import React, { useState } from "react";
import axios from "axios";
import { generateUniqueId } from "esewajs";

const PaymentForm = () => {
  const [amount, setAmount] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    const productId = generateUniqueId();
    console.log("Generated Product ID:", productId);

    try {
      const response = await axios.post(
        "https://newrepo-backend.vercel.app/initiate-payment",
        {
          amount,
          productId,
        }
      );
      console.log("Payment initiation response:", response.data);
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error initiating payment:", error.response?.data || error.message);
    }
  };
  return (
    <div>
      <h1>eSewa Payment Integration</h1>

      <div className="form-container" onSubmit={handlePayment}>
        <form className="styled-form">
          <div className="form-group">
            <label htmlFor="Amount">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
            />
          </div>

          <button type="submit" className="submit-button">
            Pay with eSewa
          </button>
        </form>
      </div>
    </div>
  )
}

export default PaymentForm