import React from "react";
import { Button, Typography } from "@material-ui/core";
import TopBar from "../components/topBar";
import "../styles/homeStyles.scss";

function HomeView() {
  return (
    <div className="home__background">
      <TopBar selectedTab="Home" />
    </div>
  );
}

export default HomeView;
