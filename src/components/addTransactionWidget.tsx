import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "../styles/addTransactionWidgetStyles.scss";

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

  merchant: {
    color: "white",
    borderColor: "white",
  },
});

function AddTransaction(props: { merchants: any[] }) {
  const classes = styledButtons();
  const [transactionType, setTransactionType] = useState("expense");

  return (
    <div className="add-transaction">
      <div className="add-transaction__tab-container">
        <Button
          disableRipple
          className={
            transactionType === "expense" ? classes.selected : classes.root
          }
          variant="outlined"
          onClick={() => {
            setTransactionType("expense");
          }}
        >
          Expense
        </Button>

        <Button
          disableRipple
          className={
            transactionType === "income" ? classes.selected : classes.root
          }
          variant="outlined"
          onClick={() => {
            setTransactionType("income");
          }}
        >
          Income
        </Button>
      </div>

      <div className="add-transaction__merchant-container">
        <Autocomplete
          freeSolo
          options={props.merchants.map((option) => option.merchant)}
          renderInput={(params) => <TextField {...params} label="Merchant" />}
          sx={{
            display: "flex",
            
            '& input': {
                color: (theme) =>
              theme.palette.getContrastText(theme.palette.background.paper),
                borderColor: "white",
            },
          }}
        />
      </div>
    </div>
  );
}

export default AddTransaction;
