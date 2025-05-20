import { useState, useEffect} from "react";
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
        const token = localStorage.getItem("token");
        const fetchFoodItems = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/admin/PendingOrders-items", {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                const sortedItems = response.data.Orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort the items globally by createdAt
                setFoodItems(sortedItems);
            } catch (error) {
                console.error("Error fetching food items:", error);
            }
        };

        fetchFoodItems();
        const interval = setInterval(fetchFoodItems, 5000);  // Refresh data every 5 seconds
        return () => clearInterval(interval);
    }, []);

      const handleStatusToggle = async (item) => {
        const token=localStorage.getItem('token');
        const updatedStatus = item.approved === "Approved" ? "Not Approved" : "Approved";
    
        try {
            await axios.put(`http://localhost:8000/api/v1/admin/Orders-itemsStatus/${item._id}`, {
                approved: updatedStatus,
            },{
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
    

            setFoodItems((prevItems) =>
                prevItems.map((prevItem) =>
                    prevItem._id === item._id
                        ? { ...prevItem, approved: updatedStatus }
                        : prevItem
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredProducts = foodItems
        .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((product) => {
            if (statusFilter) {
                return product.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
            }
            return true;
        })
        .filter((product) => {
     
            if (startDate && endDate) {
                const createdAt = new Date(product.createdAt);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return createdAt >= start && createdAt <= end;
            }
            return true;
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);


    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Pending Orders</h1>
            <div className="card">
            <div className="card-header flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
                <p className="text-lg font-medium text-white">Total Pending Orders: <span className="font-bold">{currentItems.length}</span></p> {/* Display total pending orders */}
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
                                <option value={20}>30</option>
                                <option value={20}>40</option>
                                <option value={20}>50</option>
                                <option value={20}>60</option>
                            </select>
                        </div>


                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Serial No.</th>
                                    <th>Name</th>
                                    <th>Food Items</th>
                                    <th>Description</th>
                                    <th>Acknowledgement</th>
                                    <th>Approved Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <Fragment key={item._id}>
                                        <tr>
                                            <td>{index + indexOfFirstItem + 1}</td>
                                            <td>{item.name}</td>
                                            <td>
                                                {item.foodItems.map((foodItem, i) => (
                                                    <div key={i}>
                                                        {foodItem.name} - Qty: {foodItem.quantity}
                                                    </div>
                                                ))}
                                            </td>
                                            <td>{item.adviceforcook}</td>
                                            <td>
                                                <textarea
                                                    placeholder="Describe the issue..."
                                                    rows="3"
                                                    className="border rounded w-full p-2"
                                                    value={item.problem || ""}
                                                    onChange={(e) => handleProblemChange(e, item)} // Call handleProblemChange function
                                                />
                                            </td>
                                            <td>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="toggle-checkbox hidden"
                                                        checked={item.approved === 'Approved'}
                                                        onChange={() => handleStatusToggle(item)}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="5">
                                                <hr className="my-2 border-t-2 border-gray-300" />
                                            </td>
                                        </tr>
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
