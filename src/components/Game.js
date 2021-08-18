import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import {
  faBookmark as bookmarkReg,
  faCommentAlt,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
import GamesItem from "./GamesItem";
const Game = ({ userToken }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataGame, setDataGame] = useState();
  const [userFavs, setUserFavs] = useState();
  const { id } = useParams();
  const [flag, setFlag] = useState(false);
  // const [title, setTitle] = useState("");
  // const [review, setReview] = useState("");
  const [listReviews, setListReviews] = useState();
  console.log(dataGame);
  const [hideLike, setHideLike] = useState(true);
  useEffect(() => {
    const fetchDataGame = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/games/${id}`);
        setDataGame(response.data);
        if (userToken) {
          const response2 = await axios.post(
            "http://localhost:3001/user/gamesFav",
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post(
  //       "http://localhost:3001/game/addReview",
  //       {
  //         title,
  //         text: review,
  //         game: dataGame.id,
  //       },
  //       { headers: { Authorization: `Bearer ${userToken}` } }
  //     );
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/game/reviews",
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
      <h3>{dataGame.name}</h3>
      <div style={{ display: "flex" }}>
        <div className="imgGame">
          <img src={dataGame.background_image} alt={dataGame.name} />
        </div>
        <div className="descGame">
          <div style={{ display: "flex" }}>
            {flag ? (
              <button
                onClick={async () => {
                  try {
                    const response = await axios.post(
                      "http://localhost:3001/user/removeFavorites",
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
                      "http://localhost:3001/user/addFavorites",
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

            <button>
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
                {dataGame.genres.map((elem) => {
                  return <p key={elem.id}>{elem.name}</p>;
                })}
              </div>
            </div>
            <div>
              <div>
                <span>Released date</span>
                <p>{dataGame.released}</p>
              </div>
              <div>
                <span>Developer</span>
                {dataGame.developers.map((elem) => {
                  return <p key={elem.id}>{elem.name}</p>;
                })}
              </div>
            </div>
            <div>
              <div>
                <span>Publisher</span>
                {dataGame.publishers.map((elem) => {
                  return <p key={elem.id}>{elem.name}</p>;
                })}
              </div>
              <div>
                <span>Age rating</span>
                <p>{dataGame.esrb_rating.id}</p>
              </div>
            </div>
            {/* <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="title"
              minLength="3"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="review"
              minLength="5"
              onChange={(e) => {
                setReview(e.target.value);
              }}
            />
            <input type="submit" />
          </form> */}
          </div>{" "}
          <p style={{ textOverflow: "ellipsis" }}>{dataGame.description_raw}</p>
        </div>
      </div>
      <ul>
        <h3>Reviews</h3>
        {listReviews.length === 0 && <span>No reviews yet</span>}
        {listReviews.map((elem, index) => {
          return (
            <GamesItem
              key={index}
              elem={elem}
              userToken={userToken}
              setHideLike={setHideLike}
              hideLike={hideLike}
            />
          );
        })}
      </ul>
    </main>
  );
};

export default Game;
