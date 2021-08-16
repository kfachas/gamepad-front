import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import {
  faBookmark as bookmarkReg,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
const Game = ({ userToken }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataGame, setDataGame] = useState();
  const [userFavs, setUserFavs] = useState();
  const { id } = useParams();
  const [flag, setFlag] = useState(false);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [listReviews, setListReviews] = useState();
  const [rating, setRating] = useState({});
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/game/addReview",
        {
          title,
          text: review,
          game: dataGame.id,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/game/reviews",
          { gameId: dataGame.id }
        );

        setListReviews(response.data);
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
    <main style={{ backgroundColor: "black" }}>
      <h3>{dataGame.name}</h3>
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
          Saved to collection{" "}
          <FontAwesomeIcon icon={faBookmark} color="green" />
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
          Save to ur collection <FontAwesomeIcon icon={bookmarkReg} />
        </button>
      )}
      <div>
        <button>Add a review</button>
        <form onSubmit={handleSubmit}>
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
        </form>
      </div>
      <img
        src={dataGame.background_image}
        alt=""
        style={{
          width: 200,
          height: 200,
          objectPosition: "center",
          objectFit: "cover",
        }}
      />
      <p>{dataGame.description}</p>
      <ul>
        <h3>Reviews</h3>
        {listReviews.map((elem, index) => {
          return (
            <li
              key={index}
              style={{ backgroundColor: "white", padding: 10, color: "black" }}
            >
              {elem.owner.account.username}
              <h5 style={{ fontWeight: "bold" }}>{elem.title}</h5>
              <p style={{ color: "gray" }}>{elem.text}</p>
              <FontAwesomeIcon
                icon={faThumbsUp}
                onClick={async () => {
                  try {
                    const obj = { ...rating };
                    obj.id = elem._id;
                    obj.rate = 1;
                    setRating(obj);

                    const response = await axios.post(
                      "http://localhost:3001/game/reviewRating",
                      {
                        id: elem._id,
                        rate: obj.rate,
                      },
                      { headers: { Authorization: `Bearer ${userToken}` } }
                    );
                    console.log(response);
                  } catch (error) {
                    console.log(error.message);
                  }
                }}
              />
              <FontAwesomeIcon
                icon={faThumbsDown}
                onClick={async () => {
                  try {
                    const obj = { ...rating };
                    obj.id = elem._id;
                    obj.rate = -1;
                    setRating(obj);

                    const response = await axios.post(
                      "http://localhost:3001/game/reviewRating",
                      {
                        id: elem._id,
                        rate: obj.rate,
                      },
                      { headers: { Authorization: `Bearer ${userToken}` } }
                    );
                    console.log(response);
                  } catch (error) {
                    console.log(error.response);
                  }
                }}
              />
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default Game;
