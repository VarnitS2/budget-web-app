import React, { useState, useEffect } from "react";
import { Button, makeStyles } from "@material-ui/core";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import "../styles/homeSideBarStyles.scss";

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

function HomeSideBar(props: { dataRefresh: boolean }) {
  const classes = styledButtons();
  const [balance, setBalance] = useState(0.0);
  const [income, setIncome] = useState(0.0);
  const [expense, setExpense] = useState(0.0);

  useEffect(() => {
    getBalance();
  }, [props.dataRefresh]);

  const getBalance = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_date: "",
        end_date: "",
      }),
    };

    fetch("/transactions/getsidebar", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setBalance(data.message.balance);
          setIncome(data.message.income);
          setExpense(data.message.expense);
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="home-side-bar">
      <div className="home-side-bar__tab-container">
        <Button disableRipple className={classes.selected} variant="outlined">
          Breakdown
        </Button>

        <Button disableRipple className={classes.root} variant="outlined">
          Categories
        </Button>

        <Button disableRipple className={classes.root} variant="outlined">
          Notes
        </Button>
      </div>

      <div className="home-side-bar__body">
        <div className="home-side-bar__body__container">
          <div className="home-side-bar__body__container__balance-title">
            Balance
          </div>

          <div className="home-side-bar__body__container__balance-amount">
            ${balance.toLocaleString("en", { useGrouping: true })}
          </div>
        </div>

        <div className="home-side-bar__body__container"></div>
      </div>
    </div>
  );
}

export default HomeSideBar;
