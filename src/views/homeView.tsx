import React, { useState, useEffect } from "react";
import { Button, makeStyles } from "@material-ui/core";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TopBar from "../components/topBar";
import HomeSideBar from "../components/homeSideBar";
import "../styles/homeStyles.scss";

const styledButtons = makeStyles({
  root: {
    textTransform: "none",
    fontSize: "12px",
    fontWeight: "bold",
    color: "white",
    borderColor: "gray",
    borderRadius: "25px",
    marginLeft: "6px",
    marginRight: "6px",
    minWidth: "1px",
  },

  selected: {
    textTransform: "none",
    fontSize: "12px",
    fontWeight: "bold",
    color: "white",
    borderColor: "#f25d70",
    borderRadius: "25px",
    background: "linear-gradient(0.25turn, #f25d70, 90%, #c05e92)",
    boxShadow: "0px 0px 20px 5px rgba(99, 48, 84, 0.75)",
    marginLeft: "6px",
    marginRight: "6px",
    minWidth: "1px",
  },

  sort: {
    textTransform: "none",
    fontSize: "12px",
    fontWeight: "bold",
    color: "white",
    borderColor: "gray",
    borderRadius: "25px",
    marginRight: "6px",
    minWidth: "1px",
  },
});

function HomeView() {
  const classes = styledButtons();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isError, setIsError] = useState(false);
  const [reverse, setReverse] = useState(true);
  const [pingSideBar, setPingSideBar] = useState(false);

  useEffect(() => {
    getAllTransactions();
  }, [reverse]);

  const getAllTransactions = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reverse: reverse,
      }),
    };

    fetch("/transactions/getall", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setTransactions(data.message);
        } else {
          setIsError(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsError(true);
      });
  };

  const addTransactionOnSaveCallback = () => {
    getAllTransactions();
    setPingSideBar(!pingSideBar);
  }

  const sortOnClick = () => {
    setReverse(!reverse);
  };

  return (
    <div className="home__background">
      <TopBar selectedTab="Home" addTransactionSaveCallback={addTransactionOnSaveCallback} />

      <div className="home__head-container-outer">
        <div className="home__head-container-inner">
          <div className="home__head-title">Home</div>

          <div>
            <Button
              disableRipple
              className={classes.selected}
              variant="outlined"
            >
              All
            </Button>

            <Button
              disableRipple
              className={classes.root}
              variant="outlined"
              startIcon={<CalendarTodayIcon className="home__head-icon" />}
            >
              Start Date
            </Button>

            <Button
              disableRipple
              className={classes.root}
              variant="outlined"
              startIcon={<CalendarTodayIcon className="home__head-icon" />}
            >
              End Date
            </Button>
          </div>
        </div>
      </div>

      <div className="home__body">
        <HomeSideBar dataRefresh={pingSideBar} />

        <div className="home__body__main">
          <div className="home__body__main__header">
            <div className="home__body__main__header__title">Transactions</div>

            <div>
              <Button
                disableRipple
                className={classes.sort}
                variant="outlined"
                onClick={sortOnClick}
                endIcon={
                  reverse ? (
                    <ArrowDropDownIcon className="home__body__main__header__sort-icon" />
                  ) : (
                    <ArrowDropUpIcon className="home__body__main__header__sort-icon" />
                  )
                }
              >
                Sort
              </Button>
            </div>
          </div>

          <ul className="home__body__main__transactions__list">
            {transactions.map((item) => (
              <div className="home__body__main__transactions__item-container-background" key={item.idx}>
                <li
                  className={
                    item.transaction_type === "income"
                      ? "home__body__main__transactions__item-container--income"
                      : "home__body__main__transactions__item-container--expense"
                  }
                //   key={item.idx}
                >
                  <div className="home__body__main__transactions__item__id-container">
                    <div className="home__body__main__transactions__item__id">
                      {item.idx}
                    </div>

                    <div className="home__body__main__transactions__item__date">
                      {new Date(item.transaction_date)
                        .toDateString()
                        .split(" ")
                        .slice(1, -1)
                        .join(" ")}
                    </div>
                  </div>

                  <div className="home__body__main__transactions__merchant">
                    {item.merchant}
                  </div>

                  <div className="home__body__main__transactions__item__type-container">
                    <div>
                      {item.transaction_type === "income" ? (
                        <ArrowDropUpIcon className="home__body__main__transactions__item__type" />
                      ) : (
                        <ArrowDropDownIcon className="home__body__main__transactions__item__type" />
                      )}
                    </div>

                    <div className="home__body__main__transactions__amount">
                      ${item.amount}
                    </div>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomeView;
