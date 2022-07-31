import React from "react";
import { Button, Typography } from "@material-ui/core";
import TopBar from "../components/topBar";
import "../styles/categoriesStyles.scss";

function CategoriesView() {
  return (
    <div className="categories__background">
      <TopBar selectedTab="Categories" />
    </div>
  );
}

export default CategoriesView;
