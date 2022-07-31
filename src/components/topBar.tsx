import React from "react";
import { Button } from "@material-ui/core";
import IconButton from "@mui/material/IconButton";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import "../styles/topBarStyles.scss";

function TopBar() {
  return (
    <div className="bar">
      <div className="barContainer">
        <div className="budgetContainer">
          <MonetizationOnIcon className="budgetIconContainer" />
          <div className="budgetTitleContainer">BUDGET</div>
        </div>

        <div className="barFont">Buttons</div>

        <div className="barFont">User</div>
      </div>
    </div>
  );
}

export default TopBar;
