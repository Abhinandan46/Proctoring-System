import React from 'react';

const WarningAlert = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Warning!</h3>
        <p className="mb-4">{message}</p>
        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">OK</button>
      </div>
    </div>
  );
};

export default WarningAlert;