import React, { useState } from 'react';

const OrderForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); 
  const [description, setDescription] = useState(''); // New state for description

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    // console.log(email);
    onSubmit(name,email,description); // Pass both name and email to the onSubmit handler
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Complete Your Order
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter additional details"
              rows="4"
            ></textarea>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-lg border text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
