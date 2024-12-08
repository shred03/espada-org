import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, X, FileImage } from 'lucide-react';

function DragDropUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload an image.');
        return;
      }

      if (file.size > maxSize) {
        setError('File is too large. Maximum size is 5MB.');
        return;
      }

      setSelectedFile(file);
      setError('');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      // Redirect to gallery after successful upload
      navigate('/gallery');
    } catch (error) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text 
            bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            ESPADA
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Image Upload Platform
          </p>
        </div>

        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 
          ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
          shadow-xl hover:shadow-2xl`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="relative">
              <div className="flex flex-col items-center">
                <FileImage className="w-16 h-16 text-blue-500 mb-4" />
                <p className="text-gray-700 mb-2">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
                <button 
                  onClick={clearFile}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop an image here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to select a file
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                id="fileUpload"
              />
              <label 
                htmlFor="fileUpload" 
                className="cursor-pointer inline-flex items-center px-6 py-2 
                bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg 
                hover:from-blue-600 hover:to-purple-600 
                transition duration-300 ease-in-out transform hover:scale-105 
                shadow-md hover:shadow-lg"
              >
                <Upload className="mr-2 w-5 h-5" />
                Select File
              </label>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 w-full py-3 
            bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg 
            hover:from-green-600 hover:to-teal-600 
            transition duration-300 ease-in-out
            flex items-center justify-center
            disabled:bg-gray-400 disabled:cursor-not-allowed
            shadow-md hover:shadow-lg"
          >
            {loading ? (
              <div className="flex items-center">
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </div>
            ) : (
              <>
                <Upload className="mr-2 w-5 h-5" />
                Upload Image
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default DragDropUpload;