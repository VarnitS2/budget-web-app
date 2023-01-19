import React, { useState, useEffect } from "react";
import { Button, makeStyles } from "@material-ui/core";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { Group, Paper, Text, ThemeIcon, MantineProvider } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconArrowUpRight, IconArrowDownRight, IconMinus } from "@tabler/icons";

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

function HomeSideBar(props: {
  dataRefresh: boolean;
  startDate: Date | null;
  endDate: Date | null;
}) {
  const classes = styledButtons();
  const [balance, setBalance] = useState(0.0);
  const [income, setIncome] = useState(0.0);
  const [expense, setExpense] = useState(0.0);
  const [avgPerDay, setAvgPerDay] = useState(0.0);
  const [maxPerDay, setMaxPerDay] = useState(0.0);
  const [saved, setSaved] = useState(0.0);
  const [topExpenses, setTopExpenses] = useState<any[]>([]);
  const [previousStats, setPreviousStats] = useState<any[]>([]);

  useEffect(() => {
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dataRefresh]);

  const getBalance = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_date: props.startDate === null ? "" : props.startDate,
        end_date: props.endDate === null ? "" : props.endDate,
      }),
    };

    fetch("/transactions/getsidebar", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setBalance(data.message.balance);
          setIncome(data.message.income);
          setExpense(data.message.expense);
          setAvgPerDay(data.message.avg_per_day);
          setMaxPerDay(data.message.max_per_day);
          setSaved(data.message.saved);
          setTopExpenses(data.message.top_expenses);
          setPreviousStats(data.message.previous_stats);
          //   console.log(data.message.previous_stats);
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
        <div className="home-side-bar__body__container__balance">
          <div className="home-side-bar__body__container__balance-title">
            Balance
          </div>

          <div className="home-side-bar__body__container__balance-amount">
            ${balance.toLocaleString("en", { useGrouping: true })}
          </div>
        </div>

        <div className="home-side-bar__body__row-container">
          <div className="home-side-bar__body__row-container-item">
            <div className="home-side-bar__body__income-container-cell">
              <div className="home-side-bar__body__income-container-cell__amount">
                ${income.toLocaleString("en", { useGrouping: true })}
              </div>

              <div className="home-side-bar__body__income-container-cell__title">
                Income
              </div>
            </div>

            <div className="home-side-bar__body__expense-container-cell">
              <div className="home-side-bar__body__expense-container-cell__amount">
                ${expense.toLocaleString("en", { useGrouping: true })}
              </div>

              <div className="home-side-bar__body__expense-container-cell__title">
                Expenses
              </div>
            </div>
          </div>
        </div>

        <div className="home-side-bar__body__row-container">
          <div className="home-side-bar__body__row-container-item">
            <div className="home-side-bar__body__max-per-day-container-cell">
              <div className="home-side-bar__body__max-per-day-container-cell__amount-container">
                <div className="home-side-bar__body__max-per-day-container-cell__amount">
                  ${maxPerDay.toLocaleString("en", { useGrouping: true })}
                </div>

                <div className="home-side-bar__body__max-per-day-container-cell__amount-days">
                  / day
                </div>
              </div>

              <div className="home-side-bar__body__max-per-day-container-cell__title">
                Max
              </div>
            </div>

            <div className="home-side-bar__body__avg-per-day-container-cell">
              <div className="home-side-bar__body__avg-per-day-container-cell__amount-container">
                <div className="home-side-bar__body__avg-per-day-container-cell__amount">
                  ${avgPerDay.toLocaleString("en", { useGrouping: true })}
                </div>

                <div className="home-side-bar__body__avg-per-day-container-cell__amount-days">
                  / day
                </div>
              </div>

              <div className="home-side-bar__body__avg-per-day-container-cell__title">
                Average
              </div>
            </div>
          </div>
        </div>

        <div className="home-side-bar__body__row-container">
          <div className="home-side-bar__body__row-container-item">
            <div className="home-side-bar__body__saved-container">
              <CircularProgressbarWithChildren
                value={saved}
                styles={buildStyles({
                  rotation: 0.75,
                  strokeLinecap: "round",
                  pathTransitionDuration: 1.5,
                  pathColor: `rgb(242, 93, 112)`,
                  textColor: "#f88",
                  trailColor: "#846df2",
                })}
              >
                <div className="home-side-bar__body__saved-amount">{`${saved}%`}</div>
                <div className="home-side-bar__body__saved-title">Saved</div>
              </CircularProgressbarWithChildren>
            </div>

            <div className="home-side-bar__body__top-expenses-container">
              <div className="home-side-bar__body__top-expenses-inner-container">
                {topExpenses.map((expense) => (
                  <div className="home-side-bar__body__top-expenses-item">
                    <div className="home-side-bar__body__top-expenses-item-title">
                      {expense.category}
                    </div>
                    <div className="home-side-bar__body__top-expenses-item-amount">
                      ${expense.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <MantineProvider theme={{ colorScheme: "dark" }}>
          <div className="home-side-bar__body__previous-expenses-container">
            <Carousel
              slideGap="lg"
              slideSize="85%"
              height={175}
              align="center"
              draggable={false}
              styles={{
                control: {
                  "&[data-inactive]": {
                    opacity: 0,
                    cursor: "default",
                  },
                },
              }}
            >
              {previousStats.map((previous) => (
                <Carousel.Slide>
                  <Paper
                    withBorder
                    p="md"
                    radius="md"
                    className="home-side-bar__body__previous-expenses"
                  >
                    <Group position="apart">
                      <div>
                        <Text
                          color="dimmed"
                          transform="uppercase"
                          weight={700}
                          size={16}
                        >
                          {new Date(
                            new Date(previous.start_date).setDate(
                              new Date(previous.start_date).getDate() + 1
                            )
                          )
                            .toDateString()
                            .split(" ")
                            .slice(1, -1)
                            .join(" ")}{" "}
                          -{" "}
                          {new Date(
                            new Date(previous.end_date).setDate(
                              new Date(previous.end_date).getDate() + 1
                            )
                          )
                            .toDateString()
                            .split(" ")
                            .slice(1, -1)
                            .join(" ")}
                        </Text>

                        <Text weight={700} size={36}>
                          ${previous.expense}
                        </Text>
                      </div>

                      <ThemeIcon
                        color="gray"
                        variant="light"
                        sx={(theme) => ({
                          color:
                            previous.diff === 0
                              ? theme.colors.gray[6]
                              : previous.diff > 0
                              ? theme.colors.teal[6]
                              : theme.colors.red[6],
                        })}
                        size={64}
                        radius="md"
                      >
                        {previous.diff === 0 ? (
                          <IconMinus size={48} stroke={1.5} />
                        ) : previous.diff > 0 ? (
                          <IconArrowUpRight size={48} stroke={1.5} />
                        ) : (
                          <IconArrowDownRight size={48} stroke={1.5} />
                        )}
                      </ThemeIcon>
                    </Group>

                    <Text color="dimmed" size={18} mt="md">
                      Spending{" "}
                      <Text
                        component="span"
                        color={previous.diff === 0 ? "dimmed" : previous.diff > 0 ? "teal" : "red"}
                        weight={700}
                      >
                        {Math.abs(previous.diff)}%
                      </Text>{" "}
                      {previous.diff <= 0 ? "more" : "less"} compared to this
                      period
                    </Text>
                  </Paper>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </MantineProvider>
      </div>
    </div>
  );
}

export default HomeSideBar;
