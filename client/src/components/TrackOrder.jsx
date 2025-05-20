import React, { useState } from 'react';

const TrackOrder = () => {
  const [orderToken, setOrderToken] = useState('');
  const [email, setEmail] = useState('');
  const [trackingStatus, setTrackingStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    // Show loading state while tracking
    setLoading(true);

    try {
      // Replace with your actual backend API endpoint
      const url = `http://localhost:8000/track-order?orderToken=${orderToken}&email=${email}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // Handle successful response
      if (response.status === 200) {
        if (data.message) {
          // Display the message if the order is already delivered
          setTrackingStatus(data.message);
        } else if (data.notDeliveredOrdersCount >= 0) {
          // Display the number of orders remaining before the current order
          setTrackingStatus(
            `There are ${data.notDeliveredOrdersCount} orders remaining before yours is processed.`
          );
        } else {
          setTrackingStatus('Your order is being processed.');
        }
      } else {
        // Handle errors from the server
        setTrackingStatus(data.error || 'Error tracking the order.');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error tracking order:', error);
      setTrackingStatus('Failed to track order. Please try again later.');
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Track Your Order</h2>
      <p className="text-center mb-6">Enter your order details to track your order status.</p>

      <form onSubmit={handleTrackOrder} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="orderToken" className="block text-lg font-medium">
            Order Token
          </label>
          <input
            type="text"
            id="orderToken"
            value={orderToken}
            onChange={(e) => setOrderToken(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </div>
      </form>

      {trackingStatus && (
        <div className="mt-4 text-center">
          <p className="text-lg">{trackingStatus}</p>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
