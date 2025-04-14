// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideBar';
import Home from './pages/Home';
import Students from './pages/NewValue';
import ListPage from './pages/ListPage';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  return (
    <Router>
      <div>
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/Students" element={<Students />} />
            <Route path="/ListPage" element={<ListPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
