import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
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
});

function HomeView() {
  const classes = styledButtons();

  return (
    <div className="home__background">
      <TopBar selectedTab="Home" />

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
        <HomeSideBar />

        <div className="home__body__main">
            <div className="home__body__main__header">
                <div className="home__body__main__header-title">
                    Transactions
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default HomeView;
