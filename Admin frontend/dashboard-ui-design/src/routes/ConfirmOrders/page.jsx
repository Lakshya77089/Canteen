import { useState, useEffect } from "react";
import React, { Fragment } from 'react';
import axios from 'axios';
import './styles.css';

const FoodItem = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [foodItems, setFoodItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState(""); 
    const [itemsPerPage, setItemsPerPage] = useState(5); 

    useEffect(() => {
        const token=localStorage.getItem("token");
        const fetchFoodItems = async () => {
          try {
            const response = await axios.get("http://localhost:8000/api/v1/admin/ConfirmOrders-items",{
                headers: {
                    Authorization: `Bearer ${token}`, 
                  },
            });
            setFoodItems(response.data.Orders);
          } catch (error) {
            console.error("Error fetching food items:", error);
          }
        };
    
        fetchFoodItems();
        const interval = setInterval(fetchFoodItems, 5000);
        return () => clearInterval(interval);
      }, []);

      const handleStatusToggle = async (item) => {
        const token=localStorage.getItem("token");
        const updatedStatus = item.deliveryStatus === "Delivered" ? "Not Delivered" : "Delivered";
    
        try {
            await axios.put(`http://localhost:8000/api/v1/admin/Orders-items-deliveryStatus/${item._id}`, {
                ...item,
                deliveryStatus: updatedStatus,
            },{
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
    

            setFoodItems((prevItems) =>
                prevItems.map((prevItem) =>
                    prevItem._id === item._id
                        ? { ...prevItem, deliveryStatus: updatedStatus }
                        : prevItem
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredItems = foodItems
        .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((item) => {
            if (statusFilter) {
                return item.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
            }
            return true;
        })
        .filter((item) => {
     
            if (startDate && endDate) {
                const createdAt = new Date(item.createdAt);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return createdAt >= start && createdAt <= end;
            }
            return true;
        });

        const sortedItems = filteredItems.sort((a, b) => {
            const dateA = new Date(a.approvedAt || 0); 
            const dateB = new Date(b.approvedAt || 0);
            return dateB - dateA; // Sort in descending order based on 'approvedAt'
        });
    
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Confirm Orders</h1>
            <div className="card">
            <div className="card-header flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
                <p className="text-lg font-medium text-white">Total Confirm Orders: <span className="font-bold">{currentItems.length}</span></p> {/* Display total pending orders */}
            </div>
        </div>
                <div className="card-body p-0">
                    <div className="relative w-full flex-shrink-0 overflow-auto rounded-none">
                        <div className="mb-4 p-2">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

   
                        <div className="mb-4">
                            <label htmlFor="rowsPerPage" className="mr-2 text-white">
                                Rows per page:
                            </label>
                            <select
                                id="rowsPerPage"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1); 
                                }}
                                className="p-2 border border-gray-300 rounded-md"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                        </div>


                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Token</th>
                                    <th>Name</th>
                                    <th>Number</th>
                                    <th>Order Type</th>
                                    <th>Address</th>
                                    <th>Food Items</th>
                                    <th>Total Price</th>
                                    <th>Description</th>
                                    <th>Delivered Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <Fragment key={item._id}>
                                        <tr>
                                            <td style={{ width: '80px', wordBreak: 'break-word' }}>{item.orderToken}</td>
                                            <td>{item.name}</td>
                                            <td>{item.phoneno}</td>
                                            <td>{item.ordertype}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                {item.foodItems.map((foodItem, i) => (
                                                    <div key={i}>
                                                        {foodItem.name} - Qty: {foodItem.quantity}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>{item.Price}</td>
                                            <td>{item.adviceforcook}</td>
                                            <td>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="toggle-checkbox hidden"
                                                        checked={item.deliveryStatus === 'Delivered'}
                                                        onChange={() => handleStatusToggle(item)}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </td>
                                        </tr>
                                        <tr style={{ borderTop: '1px solid #ddd' }}></tr> {/* Separator Line */}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>


                        <div className="flex justify-between items-center mt-4 p-2">
                            <button
                                className="btn text-white"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                Previous
                            </button>
                            <span className="text-white">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="btn text-white"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodItem;
