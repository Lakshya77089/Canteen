import React from 'react';

function FoodItem({ item, addToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto transition-transform duration-300 hover:scale-105">
      {/* Image Container */}
      <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />io
      </div>

      {/* Content Section */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h2>
        <p className="text-lg font-medium text-gray-600 mb-4">₹{item.price}</p>
        <button
          onClick={() => addToCart(item)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg text-lg font-medium shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default FoodItem;
