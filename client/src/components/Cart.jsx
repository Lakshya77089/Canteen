import React, { useState } from 'react';
import axios from 'axios';

function Cart({ cart, updateQuantity, onOrderNow }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate the total price of the cart
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Check the stock and validate the cart items
  const checkStockAndOrder = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    const updatedCart = [...cart];
    let isValid = true;

    // Loop through each item in the cart and check if it is in stock
    for (let i = 0; i < updatedCart.length; i++) {
      const item = updatedCart[i];

      try {
        // Make an API call to check the stock status of the item
        const response = await axios.get(`http://localhost:8000/food-items/${item.id}`);
        console.log(response);
        if (response.data.status === 'Out of stock') {
          isValid = false;
          updatedCart.splice(i, 1);  // Remove the out-of-stock item from the cart
          i--;  // Adjust the index after removal
        }
      } catch (error) {
        console.error('Error fetching food item status:', error.message);
        setErrorMessage('There was an error checking the stock status.');
        isValid = false;
        break; // Exit loop if an error occurs
      }
    }

    // If the cart has any out-of-stock items, show an error and don't proceed with the order
    if (!isValid) {
      setErrorMessage('One or more items in your cart are out of stock. The cart has been updated. Please reload the page to see the latest updates.');

      // Update the cart state to reflect the removed items
      // You can also set a new state for the cart in the parent component if necessary
    } else {
      onOrderNow();  // Proceed to the order
    }

    setIsProcessing(false);
  };

  return (
    <div className='mt-4'>
      <h2 className='text-xl font-bold mb-4'>Your Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id} className='flex justify-between items-center mb-4'>
            <div className='flex items-center'>
              <img src={item.image} alt={item.name} className='w-16 h-16 object-cover mr-4' />
              <div>
                <h3 className='font-semibold'>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <div className='flex items-center mt-2'>
                  <button
                    className='bg-blue-500 text-white p-2 rounded'
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className='mx-2'>{item.quantity}</span>
                  <button
                    className='bg-blue-500 text-white p-2 rounded'
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <p>₹{item.price * item.quantity}</p>
          </li>
        ))}
      </ul>

      {errorMessage && (
        <div className='text-red-500 text-center mt-4'>
          <p>{errorMessage}</p>
        </div>
      )}

      <div className='flex justify-between text-xl font-semibold'>
        <p>Total: ₹{totalPrice}</p>
        <button
          className='bg-green-500 text-white p-2 rounded'
          onClick={checkStockAndOrder} // Use the checkStockAndOrder function
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Order Now'}
        </button>
      </div>
    </div>
  );
}

export default Cart;
