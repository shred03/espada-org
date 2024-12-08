import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Upload from './pages/Upload';
import Gallery from './pages/Gallery';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <nav className="py-6 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-black text-transparent bg-clip-text 
              bg-gradient-to-r from-blue-600 to-purple-600">
              ESPADA
            </h1>
            <div className="flex space-x-4">
              <Link 
                to="/" 
                className="px-4 py-2 rounded-lg 
                bg-gradient-to-r from-blue-500 to-purple-500 
                text-white hover:from-blue-600 hover:to-purple-600 
                transition duration-300 ease-in-out transform hover:scale-105 
                shadow-md hover:shadow-lg"
              >
                Upload Image
              </Link>
              <Link 
                to="/gallery" 
                className="px-4 py-2 rounded-lg 
                bg-gradient-to-r from-green-500 to-teal-500 
                text-white hover:from-green-600 hover:to-teal-600 
                transition duration-300 ease-in-out transform hover:scale-105 
                shadow-md hover:shadow-lg"
              >
                Image Gallery
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;