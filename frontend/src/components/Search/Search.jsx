import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';

import axios from 'axios';

const Search = (props) => {

    const [close, setClose] = useState(false);
    const [Item, setItem] = useState([]);
    const [database, setDatabase] = useState([]);
    const [result, setResult] = useState([]);
    const [searchParams] = useSearchParams();

    const data = props.query;
    const tableId = searchParams.get("tableId");

    useEffect(() => {
        const getdata = async () => {
            try {
                const res = await axios.get("https://newrepo-backend.vercel.app/database");
                setDatabase(res.data.map(item => ({ ...item, Quantity: 1 })));
            } catch (error) {
                console.error(error);
            }
        };
        getdata();
    }, [data]);


    useEffect(() => {
        setClose(false)
    }, [data]);


    useEffect(() => {
        const closeSearch = (e) => {
            if (data && !e.target.closest('.search')) {
                setClose(true)
                // setClose(false)
            }
        }
        window.addEventListener("click", closeSearch)
        return () => {
            window.removeEventListener("click", closeSearch)
        };
    });

    useEffect(() => {
        if (database && database.length > 0) {
            performSearch(data, database);
        }
    }, [database, data ]);

    const fuseOptions = {
        isCaseSensitive: false,
        minMatchCharLength : 3 ,
        keys: ["productname"]
    };

    const performSearch = (pattern, dataToSearch) => {
        if (pattern) {
            const fuse = new Fuse(dataToSearch, fuseOptions);
            const fuseResults = fuse.search(pattern);
            setResult(fuseResults);
            console.log(fuseResults);
        } else {
            setResult([]);
        }
    };

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
    const updatedItems = database.map(element => { 
        if (element._id === id) {
            return { ...element, Quantity: element.Quantity + amount };
        }
        return element;
    });
    setDatabase(updatedItems);
};

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


    return (
        <>
            <div className={`search ${data ? " h-fit pb-6 absolute  top-[100%] shadow-md right-0 z-50 bg-white w-fit max-[815px]:w-full " : "hidden"} ${close?"hidden":""} `}>
                {result.length > 0 ? (
                    <div className='px-4  py-2 text-xl  '>
                        {result.map(item => (
                            <div className='list-disc mx-2 flex flex-wrap items-center justify-between px-8 gap-6 my-8 max-[571px]:text-[1rem] ' key={item?.item?._id}>
                                <p>{item.productname} </p>
                                <p>Rs.{item.price}</p>
                                <label className="" htmlFor="quantity">
                                    Quantity :&nbsp;
                                    <input
                                        className="w-[12vw] sm:w-[4vw] lg:w-[2vw] text-center outline-0 rounded-sm border-1 appearance-none"
                                        type="number"
                                        min={1}
                                        placeholder={item.Quantity}
                                        onChange={(e) => updateQuantity(item._id, e.target.value - item.Quantity)}
                                    />
                                </label>
                                <button className="bg-black text-white  px-1 w-fit  rounded-md hover:cursor-pointer"
                                    onClick={() => {
                                        handleAdd_To_Cart(item.productname, item.price, item.Quantity);
                                        notify(item.productname);
                                    }}
                                >Add to cart</button>
                                <p className='w-full h-1 border-b-2 '></p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </>
    );
};

export default Search;