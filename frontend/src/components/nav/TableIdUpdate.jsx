import React, { useState } from 'react'
import axios from "axios";
import { toast } from "react-toastify";

const TableIdUpdate = (props) => {
    const tableId = props.tableId;
    const orderId = props.orderId;
    const [value, setValue] = useState();
    const [updating, setUpdating] = useState(false);

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


    const updateId = async () => {
        try {
            setUpdating(true)
            await axios.patch("https://newrepo-backend.vercel.app/updateId", {
                _id: orderId,
                tableId: value,
            });
            props.onClose();
            setUpdating(false)
            props.onTableIdUpdate(); // Trigger the callback to refetch orders
        } catch (err) {
            notifyError("Failed to update table ID");
            console.error(err);
        }
    }

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-10">
                <div className="h-[70vh] w-[70vw] flex items-center flex-col justify-center  bg-white shadow-xl ">
                    <h2 className='my-6 text-2xl underline mx-2'>Edit The Table Id</h2>
                    <p className='hidden'>
                        Order Id : {orderId}
                    </p>
                    <p className='text-xl'>
                        Old Table Id : {tableId}
                    </p>
                    <p>
                        <label htmlFor="new" className='text-xl'>New Table Id : </label>
                        <input type="number" className='border-2 rounded-md my-6 px-2 w-[5vw] max-sm:w-[10vw] ' name="" id="new"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value)
                            }
                            }
                        />
                    </p>
                    <button
                        className="mt-4 px-4 py-2 bg-red-500 cursor-pointer text-white rounded"
                        onClick={props.onClose}
                    >
                        Close
                    </button>
                    <button
                        className={`mt-4 px-4 py-2 bg-green-500 cursor-pointer text-white rounded disabled:bg-gray-400 disabled:text-black `}
                        onClick={updateId}
                        disabled={updating}
                    >
                        {updating ? "Updating" : "Update"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default TableIdUpdate