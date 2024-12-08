import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Copy, 
  Trash2, 
  ExternalLink, 
  Image as ImageIcon,
  LayoutGrid,
  Menu 
} from 'lucide-react';

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/images');
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching images');
      setLoading(false);
      console.error('Fetch error:', error);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      // Remove the deleted image from the state
      setImages(images.filter(img => img._id !== imageId));
      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete image');
      console.error('Delete error:', error);
    }
  };

  const copyImageLink = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Image link copied!'))
      .catch(err => toast.error('Failed to copy link'));
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text 
          bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          ESPADA
        </h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text 
          bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          ESPADA
        </h1>
        <div className="text-red-500 bg-red-50 p-6 rounded-lg">
          {error}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4">
      <ToastContainer />
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text 
            bg-gradient-to-r from-blue-600 to-purple-600 mb-4 sm:mb-0 text-center w-full sm:w-auto">
            ESPADA
          </h1>
          <div className="flex items-center space-x-4 justify-center w-full sm:w-auto">
            <span className="text-gray-600 text-sm sm:text-base">Gallery</span>
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              title="Toggle View Mode"
            >
              <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md">
            <ImageIcon className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-base sm:text-lg">No images uploaded yet</p>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-4 sm:gap-6`}>
            {images.map((image) => (
              <div 
                key={image._id} 
                className="bg-white rounded-xl overflow-hidden 
                transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                shadow-md"
              >
                <div className="relative">
                  <img 
                    src={image.url} 
                    alt="Uploaded" 
                    className={`w-full ${viewMode === 'grid' ? 'h-36 sm:h-48' : 'h-auto'} object-cover`}
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => copyImageLink(image.url)}
                      className="bg-white/70 p-1 rounded-full hover:bg-white/90 
                      transition-all duration-300 hover:scale-110"
                      title="Copy Link"
                    >
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="bg-white/70 p-1 rounded-full hover:bg-white/90 
                      transition-all duration-300 hover:scale-110"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <a 
                      href={image.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 
                      flex items-center hover:underline text-sm sm:text-base"
                    >
                      View Full Size
                      <ExternalLink className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {new Date(image.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;