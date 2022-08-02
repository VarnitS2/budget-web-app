import React from "react";
import { Button } from "@material-ui/core";
import TopBar from "../components/topBar";
import "../styles/categoriesStyles.scss";
import { useNavigate } from "react-router-dom";

function CategoriesView() {
  const navigate = useNavigate();

  return (
    <div className="categories__background">
      <TopBar
        selectedTab="Categories"
        addTransactionSaveCallback={() => {
          navigate("/home");
        }}
      />
    </div>
  );
}

export default CategoriesView;
