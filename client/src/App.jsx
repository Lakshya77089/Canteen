import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import FoodItem from './components/FoodItem';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';
import Success from './components/Success';
import Failure from './components/Failure';
import TrackOrder from './components/TrackOrder';
import axios from 'axios';

function App() {
  const [foodItems, setFoodItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingFoodItems, setFetchingFoodItems] = useState(true);
  const [selectedTag, setSelectedTag] = useState(''); // State for selected tag

  // Fetch food items on component mount
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('http://localhost:8000/food-items');
        setFoodItems(response.data || []);
      } catch (error) {
        console.error('Failed to fetch food items:', error.message);
      } finally {
        setFetchingFoodItems(false);
      }
    };
    fetchFoodItems();
  }, []);

  // Add item to cart, increase quantity if already in cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

const updateQuantity = (id, newQuantity) => {
  setCart((prevCart) =>
    prevCart
      .map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
      .filter((item) => item.quantity > 0) // Automatically remove items with quantity <= 0
  );
};


  // Handle "Order Now" button click
  const handleOrderNow = () => {
    setShowOrderForm(true);
  };

  // Submit the order and handle payment API request
  const handleSubmitOrder = async (name,email,description) => {
    // console.log(name);
    // console.log(email);
    setLoading(true);
  
    // Calculate total price
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
    // Prepare data to send to backend
    const Orderinfo = {
      name,
      email,
      totalPrice,
      description,
      MUID: 'MUIDW' + Date.now(),
      transactionId: 'T' + Date.now(),
      foodItems: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };
    try {
      const response = await axios.post('http://localhost:8000/order', Orderinfo);
      if (response.data?.data?.instrumentResponse?.redirectInfo?.url) {
        // Redirect user to payment gateway
        // sessionStorage.setItem('orderDetails', JSON.stringify(data));
        window.location.href = response.data.data.instrumentResponse.redirectInfo.url;
        // console.log(data);
      } else {
        console.error('Unexpected response:', response.data);
        window.location.href = '/failure';
      }
    } catch (error) {
      console.error('Order submission failed:', error.message);
      window.location.href = '/failure';
    } finally {
      setLoading(false);
    }
  };
  

  // Prepare food items and apply filters
  const filteredFoodItems = foodItems.map((item) => ({
    ...item,
    id: item._id, // Map _id to id for consistency
  }));

  const filteredAndSearchedFoodItems = filteredFoodItems
  .filter((item) =>
    selectedTag ? item.category === selectedTag : true // Filter by tag
  )
  .filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by search term
  )
  .filter((item) => item.status !== 'Out of stock'); // Filter out items with 'Out of Stock' status


  // Tag options
  // const tags = ['Beverages', 'Fast Food', 'Desserts', 'Snacks', 'All'];

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <div className='container mx-auto p-4'>
              <h1 className='text-3xl font-bold mb-4 text-center'>MAHIMA ENTERPRISES</h1>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              {fetchingFoodItems ? (
                <p className='text-center'>Loading food items...</p>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                  {filteredAndSearchedFoodItems.map((item) => (
                    <FoodItem key={item.id} item={item} addToCart={addToCart} />
                  ))}
                </div>
              )}
              {cart.length > 0 && (
                <Cart
                  cart={cart}
                  updateQuantity={updateQuantity}
                  onOrderNow={handleOrderNow}
                />
              )}
              {showOrderForm && (
                <OrderForm
                  onSubmit={handleSubmitOrder}
                  onCancel={() => setShowOrderForm(false)}
                />
              )}
              {loading && (
                <p className='text-center text-blue-500 mt-4'>Processing order...</p>
              )}
              {/* Track Order Button */}
              <div className="text-center mt-6">
                <Link
                  to="/track-order"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Track Order
                </Link>
              </div>
            </div>
          }
        />
        <Route path='/success' element={<Success />} />
        <Route path='/failure' element={<Failure />} />
        <Route path='/track-order' element={<TrackOrder />} /> 
      </Routes>
    </Router>
  );
}

export default App;
