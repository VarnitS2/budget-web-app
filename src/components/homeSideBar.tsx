import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import "../styles/homeSideBarStyles.scss"

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

function HomeSideBar() {
    const classes = styledButtons();

    return (
        <div className="home-side-bar">
            <div className="home-side-bar__tab-container">
                <Button disableRipple className={classes.selected} variant="outlined">
                    All
                </Button>

                <Button disableRipple className={classes.root} variant="outlined">
                    This month
                </Button>

                <Button disableRipple className={classes.root} variant="outlined">
                    This year
                </Button>
            </div>
        </div>
    );
}

export default HomeSideBar;