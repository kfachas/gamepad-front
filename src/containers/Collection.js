import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { withRouter } from "react-router-dom";
import Helmet from "../components/Helmet";

import { connect } from "react-redux";
import { compose } from "redux";
import { Grid, List, ListItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  listItem: {
    minWidth: 250,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    border: "2px solid white",
    borderRadius: 20,
    "&:hover": {
      opacity: 0.8,
    },
  },
}));

const Collection = ({ currentUser, history }) => {
  const classes = useStyles();
  const [userFavs, setUserFavs] = useState();
  const [topData, setTopData] = useState({
    1: {
      name: "",
      image: "",
      id: "",
    },
    2: {
      name: "",
      image: "",
      id: "",
    },
    3: {
      name: "",
      image: "",
      id: "",
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3310/user/gamesFav",
          { token: currentUser.token },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setUserFavs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchFavs();
  }, [currentUser]);
  const updateFavs = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3310/user/gamesFav",
        { token: currentUser.token },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setUserFavs(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(topData[1].id);
  return isLoading ? (
    <Loader />
  ) : (
    <Grid container spacing={5}>
      <Helmet title="My collection" />
      <Grid item xs={12}>
        <Box
          width="100%"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          marginBottom={3}
        >
          <Typography>Top 1</Typography>
          {topData[1].id ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography>{topData[1].name}</Typography>
              <img
                src={topData[1].background_image}
                height="150px"
                width="150px"
                alt={topData[1].name}
              />
            </Box>
          ) : (
            <div
              onDragOver={(ev) => ev.preventDefault()}
              onDrop={(ev) => {
                ev.preventDefault();
                var data = ev.dataTransfer.getData("gameData");
                setTopData({ ...topData, 1: JSON.parse(data) });

                // request to add top3 in mongoose

                ev.dataTransfer.clearData();
              }}
            >
              Rajouter votre Top1 ici
            </div>
          )}
        </Box>
        <Box
          width="100%"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography align="center">Top 2</Typography>
            {topData[2].id ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography>{topData[2].name}</Typography>
                <img
                  src={topData[2].background_image}
                  height="150px"
                  width="150px"
                  alt={topData[2].name}
                />
              </Box>
            ) : (
              <div
                onDragOver={(ev) => ev.preventDefault()}
                onDrop={(ev) => {
                  ev.preventDefault();
                  var data = ev.dataTransfer.getData("gameData");
                  setTopData({ ...topData, 2: JSON.parse(data) });

                  // request to add top3 in mongoose

                  ev.dataTransfer.clearData();
                }}
              >
                Rajouter votre Top2 ici
              </div>
            )}
          </Box>
          <Box>
            <Typography align="center">Top 3</Typography>
            {topData[3].id ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography>{topData[3].name}</Typography>
                <img
                  src={topData[3].background_image}
                  height="150px"
                  width="150px"
                  alt={topData[3].name}
                />
              </Box>
            ) : (
              <div
                onDragOver={(ev) => ev.preventDefault()}
                onDrop={(ev) => {
                  ev.preventDefault();
                  var data = ev.dataTransfer.getData("gameData");
                  setTopData({ ...topData, 3: JSON.parse(data) });

                  // request to add top3 in mongoose

                  ev.dataTransfer.clearData();
                }}
              >
                Rajouter votre Top3 ici
              </div>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <List style={{ display: "flex", overflowX: "scroll" }}>
          {userFavs.map((game, index) => {
            return (
              <ListItem
                key={index}
                draggable={true}
                onDragEnter={(ev) => ev.preventDefault()}
                onDragStart={(ev) => {
                  ev.dataTransfer.setData("gameData", JSON.stringify(game));
                }}
                onClick={() => history.push(`/games/${game.id}`)}
                className={classes.listItem}
              >
                <Typography>{game.name}</Typography>

                <img
                  src={game.background_image}
                  alt={game.name}
                  height="100%"
                  width="100%"
                />
                <button
                  onClick={async () => {
                    try {
                      await axios.post(
                        "http://localhost:3310/user/removeFavorites",
                        { game: { id: game.id } },
                        {
                          headers: {
                            Authorization: `Bearer ${currentUser.token}`,
                          },
                        }
                      );
                      updateFavs();
                    } catch (error) {
                      console.log(error.message);
                    }
                  }}
                >
                  Remove Favorites ?
                </button>
              </ListItem>
            );
          })}
        </List>
        <ul className="userFavs"></ul>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.userState.currentUser,
  };
};

export default compose(connect(mapStateToProps), withRouter)(Collection);
