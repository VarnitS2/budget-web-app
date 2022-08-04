import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "../styles/homeStyles.scss";
import Button from "@material-ui/core/Button";
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

  saveButton: {
    "&.MuiButton-root": {
      color: "white",
      fontWeight: "bold",
      border: "none",
      transition: "0.3s",
      "&:hover": {
        color: "white",
        borderColor: "#f25d70",
        background: "linear-gradient(0.25turn, #f25d70, 90%, #c05e92)",
        boxShadow: "0px 0px 20px 5px rgba(99, 48, 84, 0.75)",
      },
    },
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

function EditTransactionItem(props: {
  transactionItem: any;
  saveCallback: () => void;
}) {
  const classes = styledButtons();
  const [transactionType, setTransactionType] = useState("expense");
  const [merchant, setMerchant] = useState("");
  const [transactionDate, setTransactionDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState("");
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

  const handleMerchantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMerchant(e.target.value);
  };

  const handleMerchantAutocomplete = (e: Object, values: any) => {
    setMerchant(values);
  };

  const handleTransactionDateChange = (e: Date | null) => {
    setTransactionDate(e);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  useEffect(() => {
    getAllMerchants();
    setMerchant(props.transactionItem.merchant);
    setTransactionDate(props.transactionItem.transaction_date);
    setAmount(props.transactionItem.amount);
    setTransactionType(props.transactionItem.transaction_type);
  }, []);

  return (
    <li key={props.transactionItem.idx}>
      <div className="home__body__main__transactions__item-container-background">
        <div
          style={{ height: "auto" }}
          className="home__body__main__transactions__item-container"
        >
          <div className="home__body__main__transactions__item__id-container">
            <div
              style={{ alignSelf: "center", marginRight: "40px" }}
              // className="home__body__main__transactions__item__id"
            >
              {props.transactionItem.idx}
            </div>

            <div className="home__body__main__transactions__item__date">
              <ThemeProvider theme={themes}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Date"
                    inputFormat="yyyy-MM-dd"
                    value={transactionDate}
                    onChange={handleTransactionDateChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    disableFuture
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </div>
          </div>

          <div className="home__body__main__transactions__merchant">
            <div style={{ textAlignLast: "center" }}>
              <ThemeProvider theme={themes}>
                <Autocomplete
                  freeSolo
                  value={[merchant]}
                  options={merchants.map((option) => option.merchant)}
                  onChange={handleMerchantAutocomplete}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<div style={{ fontWeight: 400 }}>Merchant</div>}
                      fullWidth
                      onChange={handleMerchantChange}
                    />
                  )}
                />
              </ThemeProvider>
            </div>
          </div>

          <div className="home__body__main__transactions__item__type-container">
            <div style={{ marginBottom: "5px" }}>
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
                  id="filled-adornment-amount"
                  value={amount}
                  onChange={handleAmountChange}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  label="Amount"
                />
              </ThemeProvider>
            </div>
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              setTransactionType(
                transactionType === "income" ? "expense" : "income"
              )
            }
          >
            {transactionType === "income" ? (
              <ArrowDropUpIcon className="home__body__main__transactions__item__type--income" />
            ) : (
              <ArrowDropDownIcon className="home__body__main__transactions__item__type--expense" />
            )}
          </div>

          <div style={{ marginLeft: "10px" }}>
            <Button
              disableRipple
              className={classes.saveButton}
              onClick={props.saveCallback}
              variant="outlined"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default EditTransactionItem;
