import { withRouter } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import GameReviews from "../components/GameReviews";
import DialogAddReview from "../components/DialogAddReview";
import noImg from "../assets/noImageFound.jpeg";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  Button,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import { makeStyles } from "@mui/styles";
import { Box, useTheme } from "@mui/system";
import ReviewDialog from "../components/ReviewDialog";

import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const useStyles = makeStyles(() => ({
  gamePicture: {
    height: "100%",
    width: "100%",
  },
  inFav: {
    border: "1px solid green",
    color: "white",
  },
  notInFav: {
    border: "1px solid lightgray",
    color: "white",
  },
  addReviewBtn: {
    border: "1px solid lightgray",
    color: "white",
  },
  container: {
    padding: 50,
  },
}));

const Game = ({ currentUser, match }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [dataGame, setDataGame] = useState({});
  const [alreadyInFav, setAlreadyInFav] = useState(false);
  const [listReviews, setListReviews] = useState([]);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [hideBtnDescription, setHideBtnDescription] = useState(false);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (match.params.id && currentUser) {
      fetchDataGame(match.params.id, currentUser.token);
    }
  }, [currentUser, match.params.id]);

  const fetchDataGame = async (id, token) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3310/games/${id}`);

      setDataGame({ ...response.data, id });

      if (token) {
        const response2 = await axios.post(
          "http://localhost:3310/user/findGameFav",
          { token: currentUser.token, gameId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAlreadyInFav(response2.data.isAlreadyInFav);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3310/game/reviews",
          { gameId: dataGame.id }
        );

        setListReviews(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (dataGame) {
      fetchReviews();
    }
  }, [dataGame]);

  const handleClickAction = async (action) => {
    try {
      const response = await axios.post(
        "http://localhost:3310/user/updateFavorites",
        { action, game: dataGame },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickReview = (review) => {
    setSelectedReview(review);
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setSelectedReview(null);
    setOpenReviewDialog(false);
  };

  useEffect(() => {
    const element = document.getElementById("description");
    if (dataGame.description_raw && element) {
      const isOverflown =
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth;
      if (!isOverflown) {
        setHideBtnDescription(true);
      }
    }
  }, [dataGame.description_raw]);

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {openReviewDialog && selectedReview && (
        <ReviewDialog
          open={openReviewDialog}
          userToken={currentUser.token}
          selectedReview={selectedReview}
          handleClose={handleCloseReviewDialog}
        />
      )}
      {showModal && (
        <DialogAddReview
          setShowModal={setShowModal}
          showModal={showModal}
          dataGame={dataGame}
          userToken={currentUser.token}
          setListReviews={setListReviews}
        />
      )}
      <Grid
        container
        className={!isMobile ? classes.container : ""}
        spacing={2}
      >
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            {dataGame.name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} md={4}>
              <img
                className={classes.gamePicture}
                src={
                  dataGame.background_image ? dataGame.background_image : noImg
                }
                alt={dataGame.name}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box display="flex">
                {alreadyInFav ? (
                  <Button
                    className={classes.inFav}
                    onClick={() => {
                      handleClickAction("remove");
                    }}
                  >
                    <BookmarkRoundedIcon color="success" />
                  </Button>
                ) : (
                  <Button
                    className={classes.notInFav}
                    onClick={() => {
                      handleClickAction("save");
                    }}
                  >
                    <BookmarkBorderRoundedIcon />
                  </Button>
                )}
                <Button
                  className={classes.addReviewBtn}
                  onClick={() => {
                    if (currentUser) {
                      setShowModal(true);
                    } else {
                      alert("You must be logged for add a review");
                    }
                  }}
                >
                  <AddCommentRoundedIcon />
                </Button>
              </Box>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Platforms</Typography>

                  {dataGame.platforms.map((elem, index) => {
                    return (
                      index < 3 && (
                        <Typography
                          key={index}
                          variant="body2"
                          color="GrayText"
                        >
                          {elem.platform.name}
                        </Typography>
                      )
                    );
                  })}
                </Grid>
                <Grid item xs={6}>
                  <Typography>Genre</Typography>
                  {dataGame.genres.length > 0 ? (
                    dataGame.genres.map((elem, index) => {
                      return (
                        index < 3 && (
                          <Typography
                            key={index}
                            variant="body2"
                            color="GrayText"
                          >
                            {elem.name}
                          </Typography>
                        )
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="GrayText">
                      N/A
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography>Released date</Typography>
                  <Typography variant="body2" color="GrayText">
                    {dataGame.released}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Developers</Typography>
                  {dataGame.developers.length >= 1 ? (
                    dataGame.developers.map((elem, index) => {
                      return (
                        index < 3 && (
                          <Typography
                            key={index}
                            variant="body2"
                            color="GrayText"
                          >
                            {elem.name}
                          </Typography>
                        )
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="GrayText">
                      N/A
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography>Publisher</Typography>

                  {dataGame.publishers.length >= 1 ? (
                    dataGame.publishers.map((elem, index) => {
                      return (
                        index < 3 && (
                          <Typography
                            key={index}
                            variant="body2"
                            color="GrayText"
                          >
                            {elem.name}
                          </Typography>
                        )
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="GrayText">
                      N/A
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography>Age rating</Typography>
                  <Typography variant="body2" color="GrayText">
                    {dataGame.esrb_rating ? dataGame.esrb_rating.id : "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            style={{ border: "1px solid white", borderRadius: 8, padding: 10 }}
          >
            <Grid item xs={11}>
              <Typography>Description</Typography>
              <Typography
                id="description"
                style={{
                  height: 100,
                  overflow: "scroll",
                  scrollBehavior: "smooth",
                }}
                variant="body2"
                color="GrayText"
              >
                {dataGame.description_raw
                  ? dataGame.description_raw
                  : "No description"}
              </Typography>
            </Grid>
            {dataGame.description_raw || hideBtnDescription ? (
              <Grid
                item
                xs={1}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  style={{ color: "#ff4655" }}
                  onClick={() =>
                    (document.getElementById("description").scrollTop -= 25)
                  }
                >
                  <KeyboardArrowUpRoundedIcon />
                </IconButton>
                <IconButton
                  style={{ color: "#ff4655" }}
                  onClick={() =>
                    (document.getElementById("description").scrollTop += 25)
                  }
                >
                  <KeyboardArrowDownRoundedIcon />
                </IconButton>
              </Grid>
            ) : (
              <div />
            )}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            Reviews
          </Typography>
          {listReviews.length === 0 ? (
            <Typography variant="body2" align="center" color="GrayText">
              No reviews yet
            </Typography>
          ) : (
            listReviews
              .sort((a, b) => b.rate.result - a.rate.result)
              .map((review, index) => {
                const reviewRating = review.rate.users.find(
                  (user) => user.id === currentUser.uid
                );
                return (
                  <GameReviews
                    handleClickReview={handleClickReview}
                    key={index}
                    setListReviews={setListReviews}
                    listReviews={listReviews}
                    review={review}
                    reviewRating={reviewRating}
                    userToken={currentUser.token}
                  />
                );
              })
          )}
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.userState.currentUser,
  };
};

export default compose(withRouter, connect(mapStateToProps))(Game);
