import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';

function Success() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // const transactionId = queryParams.get('transactionId');
  const name = queryParams.get('name');
  const totalPrice = queryParams.get('totalPrice');
  // const status = queryParams.get('status');
  const createdAt = queryParams.get('createdAt');
  const foodItems = JSON.parse(decodeURIComponent(queryParams.get('foodItems')));
  const orderToken = queryParams.get('orderToken');
  const email=queryParams.get('email');
  const formattedDate = new Date(createdAt).toLocaleString();

  const captureScreenshot = () => {
    const element = document.getElementById('order-success-container');
    html2canvas(element).then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'order-success-screenshot.png';
      link.click();
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div
        id="order-success-container"
        className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center"
      >
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2l4-4m0-5a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-green-600 mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order, <span className="font-bold">{name}</span>. Your food will be delivered soon.
        </p>
        <div className="text-left bg-gray-100 p-4 rounded-md shadow-inner mb-6">
          <p><span className="font-semibold">Email ID:</span> {email}</p>
          {/* <p><span className="font-semibold">Transaction ID:</span> {transactionId}</p> */}
          <p><span className="font-semibold">Total Price:</span> ₹{totalPrice}</p>
          <p><span className="font-semibold">Order Token:</span> {orderToken}</p>
          <p><span className="font-semibold">Order Date & Time:</span> {formattedDate}</p>
          {/* <p><span className="font-semibold">Status:</span> {status}</p> */}
        </div>
        <div className="text-left bg-gray-50 p-4 rounded-md shadow-inner mb-6">
          <h2 className="text-lg font-semibold mb-2">Food Items:</h2>
          <ul className="list-disc pl-5">
            {foodItems.map((item, index) => (
              <li key={index}>
                <span className="font-semibold">{item.name}</span> - {item.quantity} x ₹{item.price}
              </li>
            ))}
          </ul>
        </div>
        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
        >
          Return to Home
        </Link>

        {/* Screenshot Button */}
        <button
          onClick={captureScreenshot}
          className="mt-4 bg-gray-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-gray-600 transition duration-300"
        >
          Take Screenshot
        </button>
      </div>
    </div>
  );
}

export default Success;
