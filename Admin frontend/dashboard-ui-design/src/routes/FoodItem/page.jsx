import { useState, useEffect } from "react";
import { Package, PencilLine, Trash } from "lucide-react";
import { Footer } from "@/layouts/footer";
import axios from 'axios';
import ReactCropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import './styles.css';
const FoodItem = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        image_url: "",
        Name: "",
        Price: "",
        availability: "",
        category: "",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [cropData, setCropData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [isCropped, setIsCropped] = useState(false);
    const [cropper, setCropper] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);


 
    useEffect(() => {
        const token=localStorage.getItem("token");
        const userRole=localStorage.getItem("role");
        const fetchFoodItems = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/admin/food-items",{
                    headers: {
                        Authorization: `Bearer ${token}`, 
                      },
                });
                setFoodItems(response.data.foodItems);
               
            } catch (error) {
                console.error("Error fetching food items:", error);
            }
        };
        fetchFoodItems();
    }, []);

    // Filter products based on search query
    const filteredProducts = foodItems.filter((product) => {
        const matchesQuery = product.Name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
        return matchesQuery && matchesCategory;
    });

    // Paginate the filtered products
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handleInputChange = (e) => {
        const { Name, value } = e.target;
        setNewItem((prevState) => ({
            ...prevState,
            [Name]: value,
        }));
    };
    const confirmDelete = async () => {
        const token=localStorage.getItem("token");
        if (itemToDelete) {
            try {
                await axios.delete(`http://localhost:8000/api/v1/admin/food-items/${itemToDelete._id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`, 
                      },
                });
                setIsDeleteModalOpen(false);
                setFoodItems(foodItems.filter(item => item.id !== itemToDelete.id)); 

            } catch (error) {
                console.error("Error deleting item:", error);
            }
        }
    };
    
    const handleEdit = (item) => {
        setItemToEdit(item);
        setNewItem({
            image_url: item.image_url,
            Name: item.Name,
            Price: item.Price,
            availability: item.availability,
            category:item.category
        });
        setIsModalOpen(true); // Open the modal
    };
    
    
    const cancelDelete = () => {
        setIsDeleteModalOpen(false); // Close the modal without deleting
    };
    
    const handleCancel = () => {
        setNewItem({
            image_url: "",
            Name: "",
            Price: "",
            availability: "",
        });
        setImageFile(null);
        setCropData(null);
        setIsCropped(false);
        setCropper(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newItem.Name.trim() || !newItem.Price || !imageFile || !newItem.availability || !newItem.category) {
            alert("Fill full information!");
            return;
        }
        const formData = new FormData();
        formData.append("Name", newItem.Name);
        formData.append("Price", newItem.Price);
        formData.append("availability", newItem.availability);
        formData.append("image_url", imageFile);
        formData.append("category", newItem.category);
        const token=localStorage.getItem("token");
        try {
            if (itemToEdit) {
                await axios.put(
                    `http://localhost:8000/api/v1/admin/food-items/${itemToEdit._id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`, 
                        },
                    }
                );
            } else {
                
                await axios.post("http://localhost:8000/api/v1/admin/additems", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`, 
                    },
                });
            }

            setIsModalOpen(false);
            try {
                const response = await axios.get("http://localhost:8000/api/v1/admin/food-items", {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                setFoodItems(response.data.foodItems); 
    
            } catch (error) {
                console.error("Error fetching food items:", error);
            }

        } catch (error) {
            console.error("Error submitting item:", error);
        }
    };
    const categories = [...new Set(foodItems.map((item) => item.category))];

    const handleStatusToggle = async (item) => {
        const token=localStorage.getItem("token");
        const updatedStatus = item.availability === "true" ? "false" : "true";
    
        try {
            await axios.put(`http://localhost:8000/api/v1/admin/foodStatus/${item._id}`, {
                ...item,
                availability: updatedStatus,
            },{
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
    

            setFoodItems((prevItems) =>
                prevItems.map((prevItem) =>
                    prevItem._id === item._id
                        ? { ...prevItem, availability: updatedStatus }
                        : prevItem
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
    
    
    const handleDelete = (item) => {

        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setIsCropped(false);
        }
    };

    const handleCrop = () => {
        if (imageFile) {
            const croppedImage = cropper.getCroppedCanvas().toDataURL();
            setCropData(croppedImage);
            setIsCropped(true);
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Food Item</h1>

            <div className="card">
                <div className="card-header flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <p className="text-lg font-medium text-white">Total Items: <span className="font-bold">{foodItems.length}</span></p> {/* Display the total number of items */}
                    <button
                        className="btn btn-primary flex items-center gap-x-2 border border-gray-300 hover:border-gray-500 px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Package size={20} /> {/* Icon for Add Item */}
                        <span className="text-lg">Add Item</span>
                    </button>
                </div>
</div>

                <div className="card-body p-0">
                    <div className="relative w-full flex-shrink-0 overflow-auto rounded-none">
                        <div className="mb-4 p-2">
                            <input
                                type="text"
                                placeholder="Search by Name..."
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto p-2">
  <button
    className={`px-4 py-2 text-sm font-medium border rounded-full ${
      selectedCategory === ""
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-blue-100"
    }`}
    onClick={() => setSelectedCategory("")}
  >
    All
  </button>
  {categories.map((category) => (
    <button
      key={category}
      className={`px-4 py-2 text-sm font-medium border rounded-full ${
        selectedCategory === category
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-blue-100"
      }`}
      onClick={() => setSelectedCategory(category)}
    >
      {category}
    </button>
  ))}
</div>




                        <table className="table">
  <thead>
    <tr>
      <th>Serial No.</th>
      <th>Image</th>
      <th>Name</th>
      <th>Category</th>
      <th>Price</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
  {currentItems.map((item, index) => (
    <>
      <tr key={item._id}>
        <td>{index + indexOfFirstItem + 1}</td> {/* Adjusted serial number */}
        <td>
          <img
            src={item.image_url}
            alt={item.Name}
            className="w-15 h-20 rounded-lg"
          />
        </td>
        <td>{item.Name}</td>
        <td>{item.category}</td>
        <td>₹{item.Price}</td>
        <td>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="toggle-checkbox hidden"
              checked={item.availability === 'true'}
              onChange={() => handleStatusToggle(item)}
            />
            <span className="toggle-slider"></span>
          </label>
        </td>
        <td>
          <button
            className="text-blue-500"
            onClick={() => handleEdit(item)}
          >
            <PencilLine size={20} />
          </button>
          <button
            className="text-red-500"
            onClick={() => handleDelete(item)}
          >
            <Trash size={20} />
          </button>
        </td>
      </tr>
      <tr>
        <td colSpan="7">
          <hr className="my-2 border-t-2 border-gray-300" />
        </td>
      </tr>
    </>
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

            {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {itemToEdit ? "Edit Item" : "Add New Item"}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="image" className="block mb-2 text-lg font-medium text-gray-700">
                        Upload Image:
                    </label>
                    {itemToEdit && itemToEdit.image_url && (
                        <div className="mb-4">
                            <img
                                src={itemToEdit.image_url}
                                alt="Item"
                                className="w-32 h-32 object-cover rounded-lg mb-2"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        id="image"
                        Name="image"
                        onChange={handleImageChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {imageFile && (
                        <div className="mt-4">
                            <ReactCropper
                                src={URL.createObjectURL(imageFile)}
                                ref={(cropper) => setCropper(cropper)}
                                style={{ height: 400, width: "100%" }}
                                aspectRatio={1}
                                guides={false}
                            />
                            {isCropped && (
                                <button
                                    type="button"
                                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition"
                                    onClick={handleCrop}
                                >
                                    Save Cropped Image
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="mb-6">
                    <label htmlFor="Name" className="block mb-2 text-lg font-medium text-gray-700">
                        Item Name:
                    </label>
                    <input
                        type="text"
                        id="Name"
                        Name="Name"
                        value={newItem.Name}
                        onChange={handleInputChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter item Name"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="Price" className="block mb-2 text-lg font-medium text-gray-700">
                        Price:
                    </label>
                    <input
                        type="text"
                        id="Price"
                        Name="Price"
                        value={newItem.Price}
                        onChange={handleInputChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter item Price"
                    />
                </div>
                <div className="mb-6">
    <label htmlFor="status" className="block mb-2 text-lg font-medium text-gray-700">
        Status:
    </label>
    <select
        id="status"
        Name="availability"
        value={newItem.availability !== undefined ? String(newItem.availability) : "true"} // Default to 'true' if availability is undefined
        onChange={handleInputChange}
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="true">Available</option>
        <option value="false">Out of stock</option>
    </select>
</div>

                <div className="mb-6">
                    <label htmlFor="category" className="block mb-2 text-lg font-medium text-gray-700">
                        Category:
                    </label>
                    <input
                        type="text"
                        id="category"
                        Name="category"
                        value={newItem.category} // Display existing tags as comma separated
                        onChange={handleInputChange} // Custom handler for managing tags
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter category"
                    />
                </div>
                <div className="flex gap-x-6 justify-end">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition"
                    >
                        {itemToEdit ? "Update Item" : "Add Item"}
                    </button>
                </div>
            </form>
        </div>
    </div>
)}





{isDeleteModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Are you sure?</h2>
            <p className="text-gray-700 mb-4">Do you really want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end gap-x-4">
                <button
                    className="btn bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
                    onClick={cancelDelete}
                >
                    No
                </button>
                <button
                    className="btn bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
                    onClick={confirmDelete}
                >
                    Yes
                </button>
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default FoodItem;




