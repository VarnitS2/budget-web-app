import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeView from './views/homeView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomeView />} />
      </Routes>
    </Router>
  );
}

export default App;
