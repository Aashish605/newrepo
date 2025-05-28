// Special_eachitem.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';

export default function Nonveg_eachitem() {
  const [Item, setItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("tableId");

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 8; // Number of items per page

  const notify = (name) => {
    if (tableId) {
      toast.success(`${name} Added To Cart`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error("Scan The Qr Code", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://newrepo-backend.vercel.app/database");
        const filterResponse = response.data.filter((item) => item.category === "Nonveg");
        setItem(filterResponse.map(item => ({ ...item, Quantity: 1 })));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data", err);
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="h-[50vh] w-full flex items-center justify-center text-3xl ">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (Item.length === 0) {
    return <div>No non-veg items found.</div>;
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Item.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(Item.length / itemsPerPage);

  const handleAdd_To_Cart = (productname, price, Quantity) => {
    const item = {
      productname,
      price,
      tableId,
      Quantity,
    };

    const existingOrders = JSON.parse(localStorage.getItem("cart")) || {};
    const tableCart = existingOrders[tableId] || [];
    const existingItem = tableCart.find(e => e.productname === item.productname);

    if (existingItem) {
      existingItem.Quantity += Quantity;
    } else {
      tableCart.push(item);
    }
    const updatedOrders = {
      ...existingOrders,
      [tableId]: tableCart,
    };
    localStorage.setItem("cart", JSON.stringify(updatedOrders));
  };

  const updateQuantity = (id, amount) => {
    const updatedItems = Item.map(element => {
      if (element._id === id) {
        return { ...element, Quantity: element.Quantity + amount };
      }
      return element;
    });
    setItem(updatedItems);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="w-full text-2xl mx-3 mt-6 sm:mx-0">NON-VEG ITEMS</div>
      <div className="flex flex-wrap items-center mb-6 mx-3 sm:mx-0">
        {currentItems.map((item) => (
          <div
            key={item._id}
            className="Eachitem-container group border-gray-400 border-1 border-dashed overflow-hidden bg-gray-100 p-1 my-4 w-[42vw] 
          sm:w-[30vw] md:w-[22vw] lg:w-[15vw] max-[320px]:w-[41vw] max-[320px]: mr-3 sm:mr-8 md:mr-6 lg:mr-4"
          >
            <div className="Eachitem-photo flex justify-center overflow-hidden">
              <img
                className="h-[20vh] object-center object-contain group-hover:scale-105 duration-500"
                src={
                  item.productname === "Chicken Chowmin"
                    ? "/nonvegimg/Chicken Chowmin.png"
                    : item.productname === "Chicken Fried Rice"
                      ? "/nonvegimg/Chicken Fried Rice.webp"
                      : item.productname === "Chicken Khana"
                        ? "/nonvegimg/Chicken Khana.webp"
                        : item.productname === "Chicken Momo"
                          ? "/nonvegimg/Chicken Momo.webp"
                          : item.productname === "Chicken Rice"
                            ? "/nonvegimg/Chicken Rice.webp"
                            : item.productname === "Mutton Momo"
                              ? "/nonvegimg/Mutton Momo.webp"
                              : item.productname === "Mutton-Biryani"
                                ? "/nonvegimg/Mutton-Biryani.webp"
                                : item.productname === "Mutton-Khana"
                                  ? "/nonvegimg/Mutton-Khana.webp"
                                  : item.productname === "Mutton-Sekuwa"
                                    ? "/nonvegimg/Mutton-Sekuwa.webp"
                                    : ""
                }
                alt="loading"
              />
            </div>
            <div className="Eachitem-name text-center mt-4 sm:text-xl">
              {item.productname}
            </div>
            <div className="flex flex-col items-center my-1">
              <button
                className="bg-black text-white px-3 py-2 w-fit my-3 rounded-md hover:cursor-pointer"
                onClick={() => {
                  handleAdd_To_Cart(item.productname, item.price, item.Quantity);
                  notify(item.productname);
                }}
              >
                Add to cart
              </button>
              <label className="font-semibold mt-2" htmlFor="quantity">
                Quantity:&nbsp;
                <input
                  className="w-[12vw] sm:w-[8vw] lg:w-[4vw] text-center outline-0 rounded-sm border-1 appearance-none"
                  type="number"
                  min={1}
                  placeholder={item.Quantity}
                  onChange={(e) => updateQuantity(item._id, e.target.value - item.Quantity)}
                />
              </label>
            </div>
            <div className="Eachitem-cart flex justify-around px-1">
              <span className="Eachitem-price my-2 opacity-70 text-sm">Rs {item.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination flex justify-center items-center w-full my-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}
