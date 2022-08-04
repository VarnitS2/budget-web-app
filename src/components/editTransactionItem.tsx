import React from "react";
import { makeStyles } from "@material-ui/core";
import IconButton from "@mui/material/IconButton";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "../styles/homeStyles.scss";
import Button from "@material-ui/core/Button";

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
    "&.MuiButton-root": {
      color: "white",
      "&:hover": {
        color: "gray",
        background: "white",
      },
    },
  },
});

function EditTransactionItem(props: {
  transactionItem: any;
  saveCallback: () => void;
}) {
  const classes = styledButtons();

  return (
    <li key={props.transactionItem.idx}>
      <div className="home__body__main__transactions__item-container-background">
        <div className="home__body__main__transactions__item-container">
          <div className="home__body__main__transactions__item__id-container">
            <div className="home__body__main__transactions__item__id">
              {props.transactionItem.idx}
            </div>

            <div className="home__body__main__transactions__item__date">
              {new Date(props.transactionItem.transaction_date)
                .toDateString()
                .split(" ")
                .slice(1, -1)
                .join(" ")}
            </div>
          </div>

          <div className="home__body__main__transactions__merchant">
            {props.transactionItem.merchant}
          </div>

          <div className="home__body__main__transactions__item__type-container">
            <div className="home__body__main__transactions__amount">
              $
              {props.transactionItem.amount.toLocaleString("en", {
                useGrouping: true,
              })}
            </div>

            <div>
              {props.transactionItem.transaction_type === "income" ? (
                <ArrowDropUpIcon className="home__body__main__transactions__item__type--income" />
              ) : (
                <ArrowDropDownIcon className="home__body__main__transactions__item__type--expense" />
              )}
            </div>
          </div>

          <div className="home__body__main__transactions__more-icon-container">
            <Button className={classes.moreIcon} onClick={props.saveCallback}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default EditTransactionItem;
