import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useNavigate } from "react-router-dom";
import AddTransaction from "./addTransactionWidget";
import "../styles/topBarStyles.scss";

const styledButtons = makeStyles({
  root: {
    textTransform: "none",
    fontWeight: "bold",
    color: "white",
    borderColor: "gray",
    marginLeft: "6px",
    marginRight: "6px",
  },

  selected: {
    textTransform: "none",
    fontWeight: "bold",
    color: "white",
    borderColor: "#f25d70",
    background: "linear-gradient(0.25turn, #f25d70, 90%, #c05e92)",
    boxShadow: "0px 0px 20px 5px rgba(99, 48, 84, 0.75)",
    marginLeft: "6px",
    marginRight: "6px",
  },
});

function TopBar(props: { selectedTab: string }) {
  const classes = styledButtons();
  const navigate = useNavigate();
  const [tab, setTab] = useState(props.selectedTab);
  const [addTransaction, setAddTransaction] = useState(false);
  const [merchants, setMerchants] = useState<any[]>([]);

  const getAllMerchants = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch("/transactions/getallmerchants", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setMerchants(data.message);
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addTransactionOnClick = () => {
    if (!addTransaction) {
        getAllMerchants();
    }

    setAddTransaction(!addTransaction);
  };

  const homeTabOnClick = () => {
    if (tab === "Home") {
      return;
    }

    setTab("Home");
    navigate("/home");
  };

  const categoriesTabOnClick = () => {
    if (tab === "Categories") {
      return;
    }

    setTab("Categories");
    navigate("/categories");
  };

  return (
    <div className="top-bar">
      <div className="top-bar-container">
        <div className="top-bar__budget-container">
          <MonetizationOnIcon className="top-bar__budget-icon-container" />
          <div className="top-bar__budget-title-container">BUDGET</div>
        </div>

        <div className="top-bar__tab-container">
          <Button
            disableRipple
            className={tab === "Home" ? classes.selected : classes.root}
            variant="outlined"
            onClick={homeTabOnClick}
          >
            Home
          </Button>

          <Button
            disableRipple
            className={tab === "Categories" ? classes.selected : classes.root}
            variant="outlined"
            onClick={categoriesTabOnClick}
          >
            Categories
          </Button>
        </div>

        <div>
          <IconButton disableRipple>
            <AddIcon
              className="top-bar__add-button"
              onClick={addTransactionOnClick}
            />
          </IconButton>
        </div>
      </div>

      {addTransaction ? (
        <div className="top-bar__add-transaction-container">
          <AddTransaction merchants={merchants} />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default TopBar;
