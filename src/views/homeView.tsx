import React, { useState, useEffect } from "react";
import { Button, makeStyles } from "@material-ui/core";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Popper, { PopperPlacementType } from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import TopBar from "../components/topBar";
import HomeSideBar from "../components/homeSideBar";
import "../styles/homeStyles.scss";
import ViewTransactionItem from "../components/viewTransactionItem";
import EditTransactionItem from "../components/editTransactionItem";

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

  moreIcon: {
    "&.MuiIconButton-root": {
      color: "gray",
      "&:hover": {
        color: "white",
      },
    },
  },
});

function HomeView() {
  const classes = styledButtons();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isError, setIsError] = useState(false);
  const [reverse, setReverse] = useState(true);
  const [pingSideBar, setPingSideBar] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<PopperPlacementType>();

  const [selectedTransactionId, setSelectedTransactionId] =
    useState<Number | null>(null);
  const [editTransactionId, setEditTransactionId] = useState<Number | null>(
    null
  );

  useEffect(() => {
    getAllTransactions();
  }, [reverse, editTransactionId]);

  const setTransactionToEdit = (transactionID: Number | null) => {
    setEditTransactionId(transactionID);
    setOpen(false);
  };

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

  const deleteTransaction = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedTransactionId,
      }),
    };

    fetch("/transactions/delete", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          getAllTransactions();
          setPingSideBar(!pingSideBar);
          setOpen(false);
        } else {
          setIsError(true);
          console.log(data.message);
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
  };

  const sortOnClick = () => {
    setReverse(!reverse);
  };

  const handleMoreOnClick =
    (newPlacement: PopperPlacementType, transactionId: Number) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
      setSelectedTransactionId(transactionId);
    };

  return (
    <div className="home__background">
      <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={500}>
            <Paper>
              <div className="home__body__main__transactions__more-popper">
                <div
                  className="home__body__main__transactions__more-popper__option-container"
                  onClick={() => setTransactionToEdit(selectedTransactionId)}
                >
                  <EditIcon className="home__body__main__transactions__more-popper__option-icon" />
                  <div className="home__body__main__transactions__more-popper__option-label">
                    Edit
                  </div>
                </div>

                <div
                  className="home__body__main__transactions__more-popper__option-container"
                  onClick={deleteTransaction}
                >
                  <DeleteIcon className="home__body__main__transactions__more-popper__option-icon" />
                  <div className="home__body__main__transactions__more-popper__option-label">
                    Delete
                  </div>
                </div>
              </div>
            </Paper>
          </Fade>
        )}
      </Popper>

      <TopBar
        selectedTab="Home"
        addTransactionSaveCallback={addTransactionOnSaveCallback}
      />

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

          <div className="home__body__main__transactions__list-container">
            <ul className="home__body__main__transactions__list">
              {transactions.map((item) => (
                <div>
                  {item.id === editTransactionId ? (
                    <EditTransactionItem
                      transactionItem={item}
                      saveCallback={() => setTransactionToEdit(null)}
                    />
                  ) : (
                    <ViewTransactionItem
                      transactionItem={item}
                      menuCallback={handleMoreOnClick}
                    />
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeView;
