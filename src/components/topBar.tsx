import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import "../styles/topBarStyles.scss";

const styledButtons = makeStyles({
  root: {
    textTransform: "none",
    fontWeight: "bold",
    color: "white",
    borderColor: "gray",
    marginLeft: "8px",
    marginRight: "8px",
  },

  selected: {
    textTransform: "none",
    fontWeight: "bold",
    color: "white",
    borderColor: "#f25d70",
    background: "linear-gradient(0.25turn, #f25d70, 90%, #c05e92)",
    boxShadow: "0px 0px 20px 5px rgba(99, 48, 84, 0.75)",
    marginLeft: "8px",
    marginRight: "8px",
  },
});

function TopBar() {
  const classes = styledButtons();
  const [tab, setTab] = useState("Home");

  return (
    <div className="bar">
      <div className="barContainer">
        <div className="budgetContainer">
          <MonetizationOnIcon className="budgetIconContainer" />
          <div className="budgetTitleContainer">BUDGET</div>
        </div>

        <div>
          <Button
            className={tab === "Home" ? classes.selected : classes.root}
            variant="outlined"
            onClick={() => {
              setTab("Home");
            }}
          >
            Home
          </Button>

          <Button
            className={tab === "Categories" ? classes.selected : classes.root}
            variant="outlined"
            onClick={() => {
              setTab("Categories");
            }}
          >
            Categories
          </Button>
        </div>

        <div>
          <IconButton>
            <AddIcon className="addButton" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
