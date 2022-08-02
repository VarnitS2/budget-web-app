import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomeView from "./views/homeView";
import CategoriesView from "./views/categoriesView";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/home" element={<HomeView />} />
          <Route path="/categories" element={<CategoriesView />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
