import React, { useState, useEffect } from 'react';

const ImportModal = ({ isOpen, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg p-4 sm:p-6 rounded-lg shadow-lg mx-4"> {/* Responsive adjustments */}
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Import Feedback</h2>
        <div
          className={`border-dashed border-2 p-4 text-center w-full h-[150px] flex items-center justify-center ${
            isDragging ? 'border-purple-500 bg-purple-100' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging ? (
            <span className="text-purple-500">Drop the file here</span>
          ) : (
            <span>
              Drag & Drop to <span className="text-purple-500">Choose file</span> to upload
            </span>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="text-red-500 border border-red-500 hover:bg-red-200 px-4 py-2 rounded-full mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full">
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
