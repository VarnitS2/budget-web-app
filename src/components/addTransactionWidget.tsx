import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
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

  save: {
    textTransform: "none",
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
    borderColor: "#f25d70",
    borderRadius: "25px",
    background: "linear-gradient(0.25turn, #f25d70, 90%, #c05e92)",
    boxShadow: "0px 0px 20px 5px rgba(99, 48, 84, 0.75)",
    minWidth: "1px",
  },
});

const themes = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          color: "white",
          paddingLeft: "20px",
          paddingRight: "20px",
        },
        clearIndicator: {
          color: "white",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "white",
          borderRadius: "15px",
        },
      },
    },
  },
});

function AddTransaction(props: { merchants: any[], saveCallback: Function }) {
  const classes = styledButtons();
  const [transactionType, setTransactionType] = useState("expense");
  const [merchant, setMerchant] = useState("");
  const [transactionDate, setTransactionDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState("");

  const handleMerchantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMerchant(e.target.value);
  };

  const handleTransactionDateChange = (e: Date | null) => {
    setTransactionDate(e);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSaveClick = () => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: merchant,
          transaction_type: transactionType,
          amount: parseFloat(amount),
          transaction_date: transactionDate,
        }),
      };
  
      fetch("/transactions/add", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            props.saveCallback();
          } else {
            console.log(data.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
  };

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
        <ThemeProvider theme={themes}>
          <Autocomplete
            freeSolo
            options={props.merchants.map((option) => option.merchant)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  <div style={{ color: "gray", fontWeight: 400 }}>
                    Merchant
                  </div>
                }
                variant="outlined"
                fullWidth
                onChange={handleMerchantChange}
              />
            )}
          />
        </ThemeProvider>
      </div>

      <div className="add-transaction__transaction-date">
        <ThemeProvider theme={themes}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label=""
              inputFormat="yyyy-MM-dd"
              value={transactionDate}
              onChange={handleTransactionDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disableFuture
            />
          </LocalizationProvider>
        </ThemeProvider>
      </div>

      <div className="add-transaction__amount">
        <ThemeProvider theme={themes}>
          <InputLabel
            htmlFor="transaction-amount"
            style={{
              fontSize: "12px",
              marginLeft: "13px",
              marginBottom: "-10px",
            }}
          >
            Amount
          </InputLabel>
          <OutlinedInput
            id="transaction-amount"
            value={amount}
            onChange={handleAmountChange}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Amount"
            fullWidth
          />
        </ThemeProvider>
      </div>

      <div className="add-transaction__save">
        <Button
          disableRipple
          className={classes.save}
          variant="outlined"
          onClick={handleSaveClick}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default AddTransaction;
