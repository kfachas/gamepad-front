import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import {
  faBookmark as bookmarkReg,
  faCommentAlt,
} from "@fortawesome/free-regular-svg-icons";
import { withRouter } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import GameReviews from "../components/GameReviews";
import ModalReviews from "../components/ModalReviews";
import noImg from "../assets/noImageFound.jpeg";
import { connect } from "react-redux";
import { compose } from "redux";
import { Grid } from "@mui/material";

const Game = ({ currentUser, match }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataGame, setDataGame] = useState(null);
  const [userFavs, setUserFavs] = useState();  const [flag, setFlag] = useState(false);

  const [listReviews, setListReviews] = useState();
  const [reviewsAdd, setReviewsAdd] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [hideLike, setHideLike] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    if (match.params.id){
    fetchDataGame(match.params.id);}

  }, [currentUser, match.params.id]);


  const fetchDataGame = async (id) => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `https://gamepad-back.herokuapp.com/games/${id}`
      );
      setDataGame(response.data);
      if (currentUser) {
        const response2 = await axios.post(
          "https://gamepad-back.herokuapp.com/user/findGameFav",
          { token: currentUser.token, gameId: id },
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        setUserFavs(response2.data);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  };

  useEffect(() => {
    if (currentUser && userFavs) {
      for (let i = 0; i < userFavs.length; i++) {
        if (userFavs[i].id === dataGame.id) {
          setFlag(true);
        }
      }
    }
  }, [currentUser, userFavs, dataGame]);

  if (reviewsAdd) {
    const fetchReviews = async () => {
      try {
        const response = await axios.post(
          "https://gamepad-back.herokuapp.com/game/reviews",
          { gameId: dataGame.id }
        );

        setListReviews(response.data);
        setReviewsAdd(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchReviews();
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.post(
          "https://gamepad-back.herokuapp.com/game/reviews",
          { gameId: dataGame.id }
        );

        setListReviews(response.data);
        console.log(response.data);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchReviews();
  }, [dataGame]);

  let counter = 0;
  let counterGenres = 0;
  return isLoading ? (
    <Loader />
  ) : (
    <Grid container>
      {showModal && <ModalReviews
        setShowModal={setShowModal}
        showModal={showModal}
        dataGame={dataGame}
        userToken={currentUser.token}
        setReviewsAdd={setReviewsAdd}
        setListReviews={setListReviews}
      /> }
      <h3 className="gameName">{dataGame.name}</h3>
      <div style={{ display: "flex" }} className="gameItem">
        <div className="imgGame">
          <img
            src={dataGame.background_image ? dataGame.background_image : noImg}
            alt={dataGame.name}
          />
        </div>
        <div className="descGame">
          <div style={{ display: "flex" }}>
            {flag ? (
              <button
                onClick={async () => {
                  try {
                    const response = await axios.post(
                      "https://gamepad-back.herokuapp.com/user/removeFavorites",
                      { token: currentUser.token, game: { id: dataGame.id } },
                      { headers: { Authorization: `Bearer ${currentUser.token}` } }
                    );
                    console.log(response);
                    setFlag(false);
                  } catch (error) {
                    console.log(error.response);
                  }
                }}
              >
                Saved to{" "}
                <div>
                  <span style={{ color: "green" }}> Collection </span>{" "}
                  <FontAwesomeIcon icon={faBookmark} />
                </div>
              </button>
            ) : (
              <button
                onClick={async () => {
                  try {
                    const response = await axios.post(
                      "https://gamepad-back.herokuapp.com/user/addFavorites",
                      {
                        token: currentUser.token,
                        game: {
                          name: dataGame.name,
                          image: dataGame.background_image,
                          id: dataGame.id,
                        },
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${currentUser.token}`,
                        },
                      }
                    );
                    console.log(response);

                    setFlag(true);
                  } catch (error) {
                    alert("You must be login");
                    console.log(error.response);
                  }
                }}
              >
                Save to{" "}
                <div>
                  Collection <FontAwesomeIcon icon={bookmarkReg} />
                </div>
              </button>
            )}

            <button
              onClick={() => {
                if (currentUser) {
                  setShowModal(true);
                } else {
                  alert("You must be logged for add a review");
                }
              }}
            >
              Add a{" "}
              <span>
                Review <FontAwesomeIcon icon={faCommentAlt} />
              </span>
            </button>
          </div>
          <div className="categ">
            <div>
              <div>
                <span>Platforms</span>

                {dataGame.platforms.map((elem, index) => {
                  counter++;
                  if (counter <= 3) {
                    return index < dataGame.platforms.length - 1 ? (
                      <p key={elem.platform.id}>{elem.platform.name}, </p>
                    ) : (
                      <p key={elem.platform.id}>{elem.platform.name}</p>
                    );
                  }
                  return ""
                })}
              </div>
              <div>
                <span>Genre</span>
                {dataGame.genres.length >= 1 ? (
                  dataGame.genres.map((elem) => {
                    counterGenres++;
                    if (counterGenres <= 3) {
                      return <p key={elem.id}>{elem.name}</p>;
                    }
                    return ""
                  })
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </div>
            <div>
              <div>
                <span>Released date</span>
                <p>{dataGame.released}</p>
              </div>
              <div>
                <span>Developer</span>
                {dataGame.developers.length >= 1 ? (
                  dataGame.developers.map((elem) => {
                    return <p key={elem.id}>{elem.name}</p>;
                  })
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </div>
            <div>
              <div>
                <span>Publisher</span>
                {dataGame.publishers.length >= 1 ? (
                  dataGame.publishers.map((elem) => {
                    return <p key={elem.id}>{elem.name}</p>;
                  })
                ) : (
                  <p>N/A</p>
                )}
              </div>
              <div>
                <span>Age rating</span>
                <p>{dataGame.esrb_rating ? dataGame.esrb_rating.id : "N/A"}</p>
              </div>
            </div>
          </div>{" "}
          <p
            className="test3"
            style={{
              WebkitLineClamp: showMore ? 500 : 3,
            }}
          >
            {dataGame.description_raw}
          </p>
          {dataGame.description_raw && !showMore ? (
            <span onClick={() => setShowMore(true)}> Show more</span>
          ) : (
            dataGame.description_raw && (
              <span onClick={() => setShowMore(false)}>Show Less</span>
            )
          )}
        </div>
      </div>
      <ul
        style={{
          display: showMore ? "none" : "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h3 style={{ padding: 20, fontSize: 25 }}>Reviews</h3>
        {listReviews.length === 0 && <span>No reviews yet</span>}
        {listReviews.map((elem, index) => {
          return (
            <GameReviews
              key={index}
              elem={elem}
              userToken={currentUser.token}
              setHideLike={setHideLike}
              hideLike={hideLike}
              setReviewsAdd={setReviewsAdd}
            />
          );
        })}
      </ul>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.userState.currentUser,
  }
}

export default compose(withRouter, connect(mapStateToProps))(Game);
