import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { compose } from "redux";

const Collection = ({ currentUser }) => {
  const [userFavs, setUserFavs] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const response = await axios.post(
          "https://gamepad-back.herokuapp.com/user/gamesFav",
          { token: currentUser.token },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setUserFavs(response.data);
        setIsLoading(false);
        console.log(response);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchFavs();
  }, [currentUser]);
  const updateFavs = async () => {
    try {
      const response = await axios.post(
        "https://gamepad-back.herokuapp.com/user/gamesFav",
        { token: currentUser.token },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setUserFavs(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return isLoading ? (
    <Loader />
  ) : (
    <main>
      <h3>My Collection</h3>
      <ul className="userFavs">
        {userFavs.map((elem) => {
          return (
            <Link
              key={elem.id}
              to={{
                pathname: `/games/${elem.id}`,
              }}
            >
              <li key={elem.id}>
                <span>{elem.name}</span>{" "}
                <img src={elem.image} alt={elem.name} />
                <button
                  onClick={async () => {
                    try {
                      const response = await axios.post(
                        "https://gamepad-back.herokuapp.com/user/removeFavorites",
                        { game: { id: elem.id } },
                        { headers: { Authorization: `Bearer ${currentUser.token}` } }
                      );
                      updateFavs();
                      console.log(response);
                    } catch (error) {
                      console.log(error.message);
                    }
                  }}
                >
                  Remove Favorites ?
                </button>
              </li>
            </Link>
          );
        })}
      </ul>
    </main>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.userState.currentUser
  }
}

export default compose(connect(mapStateToProps))(Collection);
