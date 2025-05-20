import { useState, useEffect } from "react";
import axios from 'axios';
import './styles.css';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const FoodItem = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [foodItems, setFoodItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState(""); // State for filter
    const [startDate, setStartDate] = useState(""); // Start date state
    const [endDate, setEndDate] = useState(""); // End date state
    const [itemsPerPage, setItemsPerPage] = useState(5); // Dynamic rows per page

    useEffect(() => {
        const token=localStorage.getItem("token");
        const fetchFoodItems = async () => {
          try {
            const response = await axios.get("http://localhost:8000/api/v1/admin/AlDeliveredOrders-items",{
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

    const filteredProducts = foodItems
        .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((product) => {
            if (statusFilter) {
                return product.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
            }
            return true;
        })
        .filter((product) => {
            // Apply date range filter if start and end dates are provided
            if (startDate && endDate) {
                const createdAt = new Date(product.createdAt);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return createdAt >= start && createdAt <= end;
            }
            return true;
        });
        const sortedItems = filteredProducts.sort((a, b) => {
            const dateA = a.deliveryAt ? new Date(a.deliveryAt) : new Date(0);
            const dateB = b.deliveryAt ? new Date(b.deliveryAt) : new Date(0);
            return dateB - dateA; // Descending order
        });
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

    const handleStatusFilter = (status) => {
        setStatusFilter(status === statusFilter ? "" : status); // Toggle filter
    };

    const handleDownloadExcel = () => {
        // Create a new workbook and a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Orders");
    
        // Define the columns for the table
        worksheet.columns = [
            { header: "Serial No.", key: "serial", width: 10 },
            { header: "Name", key: "name", width: 20 },
            { header: "Email", key: "email", width: 25 },
            { header: "Phone Number", key: "phoneno", width: 15 },
            { header: "Token", key: "orderToken", width: 15 },
            { header: "Food Items", key: "foodItems", width: 50 }, // Increase width for foodItems
            { header: "Order Type", key: "ordertype", width: 15 },
            { header: "Price", key: "price", width: 10 },
            { header: "Ordered At", key: "orderedAt", width: 25 },
        ];
    
        // Map data to rows
        const dataToExport = filteredProducts.map((item, index) => ({
            serial: index + 1,
            name: item.name,
            email: item.email,
            phoneno: item.phoneno,
            orderToken: item.orderToken,
            foodItems: item.foodItems
                .map((foodItem) => `${foodItem.name} (Qty: ${foodItem.quantity})`)
                .join("\n"), // Use "\n" for line breaks in Excel
            ordertype: item.ordertype,
            price: item.Price,
            orderedAt: new Date(item.createdAt).toLocaleString(),
        }));
    
        // Add rows to the worksheet
        dataToExport.forEach((row) => {
            const newRow = worksheet.addRow(row);
    
            // Set alignment for the "foodItems" column to enable text wrapping
            newRow.getCell("foodItems").alignment = { wrapText: true, vertical: "top" };
        });
    
        worksheet.addTable({
            name: "OrderTable",
            ref: "A1", // Start from cell A1
            headerRow: true,
            totalsRow: false,
            style: {
                theme: "TableStyleMedium2",
                showRowStripes: true,
            },
            columns: worksheet.columns.map((col) => ({
                name: col.header,
                filterButton: true,
            })),
            rows: dataToExport.map((row) =>
                worksheet.columns.map((col) => row[col.key])
            ),
        });
    
        // Adjust row height dynamically
        worksheet.eachRow((row) => {
            row.height = undefined; // Auto-adjust the height for wrapped text
        });
    
        // Write the workbook and download as a file
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer]), "Orders.xlsx");
        });
    };

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Delivered Orders</h1>
            <div className="card">
            <div className="card-header flex justify-between items-center mb-4">

            <div className="flex items-center space-x-4">
                <p className="text-lg font-medium text-white">Total Delivered Orders: <span className="font-bold">{currentItems.length}</span></p> {/* Display total pending orders */}
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

                        {/* Rows per page selection */}
                        <div className="mb-4">
                            <label htmlFor="rowsPerPage" className="mr-2 text-white">
                                Rows per page:
                            </label>
                            <select
                                id="rowsPerPage"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1); // Reset to the first page
                                }}
                                className="p-2 border border-gray-300 rounded-md"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                        </div>

                        {/* Date range filters */}
                        <div className="flex gap-4 mb-4">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md"
                            />
                            <button
                                className="btn px-4 py-2 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700"
                                onClick={handleDownloadExcel}
                            >
                                Download Excel
                            </button>
                        </div>

                        <table className="table">
        <thead>
          <tr>
       
            <th>Token</th>
            <th>Name</th>
            <th>Number</th>
            <th>Email</th>
            <th>Order Type</th>
            <th>Address</th>
            <th>Food Items</th>
            <th>Total Price</th>
            <th>Description</th>
            <th>Ordered At</th>
          </tr>
        </thead>
        <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.orderToken}</td>
                                        <td>{item.name}</td>
                                        <td>{item.phoneno}</td>
                                        <td>{item.email}</td>
                                        <td>{item.ordertype}</td>
                                        <td>{new Date(item.deliveryAt).toLocaleString()}</td>
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
                                    </tr>
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
