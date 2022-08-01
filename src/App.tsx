import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeView from "./views/homeView";
import CategoriesView from "./views/categoriesView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/categories" element={<CategoriesView />} />
      </Routes>
    </Router>
  );
}

export default App;
