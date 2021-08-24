import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import {
  faBookmark as bookmarkReg,
  faCommentAlt,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
import GameReviews from "./GameReviews";
import ModalReviews from "./ModalReviews";
import noImg from "../assets/noImageFound.jpeg";

const Game = ({ userToken }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataGame, setDataGame] = useState();
  const [userFavs, setUserFavs] = useState();
  const { id } = useParams();
  const [flag, setFlag] = useState(false);

  const [listReviews, setListReviews] = useState();
  const [reviewsAdd, setReviewsAdd] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [hideLike, setHideLike] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDataGame = async () => {
      try {
        const response = await axios.get(
          `https://gamepad-back.herokuapp.com/games/${id}`
        );
        setDataGame(response.data);
        if (userToken) {
          const response2 = await axios.post(
            "https://gamepad-back.herokuapp.com/user/gamesFav",
            { token: userToken },
            { headers: { Authorization: `Bearer ${userToken}` } }
          );
          setUserFavs(response2.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataGame();
  }, [id, userToken]);

  useEffect(() => {
    if (userToken && userFavs) {
      for (let i = 0; i < userFavs.length; i++) {
        if (userFavs[i].id === dataGame.id) {
          setFlag(true);
        }
      }
    }
  }, [userToken, userFavs, dataGame]);

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

  return isLoading ? (
    <Loader />
  ) : (
    <main>
      <ModalReviews
        setShowModal={setShowModal}
        showModal={showModal}
        dataGame={dataGame}
        userToken={userToken}
        setReviewsAdd={setReviewsAdd}
        setListReviews={setListReviews}
      />
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
                      { token: userToken, game: { id: dataGame.id } },
                      { headers: { Authorization: `Bearer ${userToken}` } }
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
                        token: userToken,
                        game: {
                          name: dataGame.name,
                          image: dataGame.background_image,
                          id: dataGame.id,
                        },
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${userToken}`,
                        },
                      }
                    );
                    console.log(response);

                    setFlag(true);
                  } catch (error) {
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
                if (userToken) {
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
                  return index < dataGame.platforms.length - 1 ? (
                    <p key={elem.platform.id}>{elem.platform.name}, </p>
                  ) : (
                    <p key={elem.platform.id}>{elem.platform.name}</p>
                  );
                })}
              </div>
              <div>
                <span>Genre</span>
                {dataGame.genres.length >= 1 ? (
                  dataGame.genres.map((elem) => {
                    return <p key={elem.id}>{elem.name}</p>;
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
              userToken={userToken}
              setHideLike={setHideLike}
              hideLike={hideLike}
              setReviewsAdd={setReviewsAdd}
            />
          );
        })}
      </ul>
    </main>
  );
};

export default Game;
