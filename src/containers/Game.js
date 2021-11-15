import { withRouter } from "react-router";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
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

import Helmet from "../components/Helmet";

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
  description: {
    height: 100,
    overflow: "scroll",
    scrollBehavior: "smooth",
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
  const [action, setAction] = useState("");

  const descriptionRef = useRef(null);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const scroll = descriptionRef.current?.scrollTop;
  const height = descriptionRef.current?.scrollHeight - 100;

  const isOverflown =
    descriptionRef.current?.scrollHeight >
      descriptionRef.current?.clientHeight ||
    descriptionRef.current?.scrollWidth > descriptionRef.current?.clientWidth;

  const componentMount = useRef(false);

  useEffect(() => {
    componentMount.current = true;
    if (match.params.id && componentMount.current) {
      fetchDataGame(match.params.id);
    }
    return () => {
      if (componentMount.current) {
        componentMount.current = false;
      }
    };
  }, [currentUser, match.params.id]);

  const fetchReviews = async (gameId) => {
    console.log("fetchReviews");
    try {
      const response = await axios.post("http://localhost:3310/game/reviews", {
        gameId,
      });

      setListReviews(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchDataGame = async (id, token) => {
    setIsLoading(true);
    console.log("fetchDataGame");
    try {
      const response = await axios.get(`http://localhost:3310/games/${id}`);

      setDataGame({ ...response.data, id });

      fetchReviews(response.data.id);

      if (token) {
        const response2 = await axios.post(
          "http://localhost:3310/user/findGameFav",
          { token: currentUser.token, gameId: response.data.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response2.data);
        setAlreadyInFav(response2.data.isAlreadyInFav);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleClickActionFav = async (action) => {
    try {
      await axios.post(
        "http://localhost:3310/user/updateFavorites",
        { action, game: dataGame },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
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

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Helmet title={dataGame.name} />

      {openReviewDialog && (
        <ReviewDialog
          open={openReviewDialog}
          userToken={currentUser.token}
          selectedReview={selectedReview}
          setListReviews={setListReviews}
          listReviews={listReviews}
          handleClose={handleCloseReviewDialog}
        />
      )}
      {/* {showModal && (
        <DialogAddReview
          setShowModal={setShowModal}
          showModal={showModal}
          dataGame={dataGame}
          userToken={currentUser.token}
          setListReviews={setListReviews}
        />
      )} */}

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
                      handleClickActionFav("remove");
                    }}
                  >
                    <BookmarkRoundedIcon color="success" />
                  </Button>
                ) : (
                  <Button
                    className={classes.notInFav}
                    onClick={() => {
                      handleClickActionFav("save");
                    }}
                  >
                    <BookmarkBorderRoundedIcon />
                  </Button>
                )}
                <Button
                  className={classes.addReviewBtn}
                  onClick={() => {
                    if (currentUser) {
                      setOpenReviewDialog(true);
                    }
                  }}
                >
                  <AddCommentRoundedIcon />
                </Button>
              </Box>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Platforms</Typography>

                  {dataGame.platforms?.map((elem, index) => {
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
                  {dataGame.genres?.length > 0 ? (
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
                  {dataGame.developers?.length > 0 ? (
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

                  {dataGame.publishers?.length > 0 ? (
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

              <p
                ref={descriptionRef}
                id="description"
                className={classes.description}
                variant="body2"
                color="GrayText"
              >
                {dataGame.description_raw
                  ? dataGame.description_raw
                  : "No description"}
              </p>
            </Grid>
            {isOverflown && (
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
                  disabled={scroll === 0}
                  style={{ color: "#ff4655" }}
                  onClick={() => {
                    setAction((descriptionRef.current.scrollTop -= 25));
                  }}
                >
                  <KeyboardArrowUpRoundedIcon />
                </IconButton>
                <IconButton
                  disabled={scroll === height}
                  style={{ color: "#ff4655" }}
                  onClick={() => {
                    setAction((descriptionRef.current.scrollTop += 25));
                  }}
                >
                  <KeyboardArrowDownRoundedIcon />
                </IconButton>
              </Grid>
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
                    key={index}
                    currentUser={currentUser}
                    handleClickReview={handleClickReview}
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
