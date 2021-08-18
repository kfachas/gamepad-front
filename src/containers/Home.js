import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/game.png";
import imgNotFound from "../assets/noImageFound.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
const Home = ({ userToken }) => {
  const [data, setData] = useState();
  const [userSearch, setUserSearch] = useState("");
  const [count, setCount] = useState();
  const [isLoading, setIsLoading] = useState(true);
  // const [page, setPage] = useState(1);
  // setPage(1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://gamepad-back.herokuapp.com/?search=${userSearch}&page=1`
        );
        setData(response.data.results);
        setCount(response.data.count);

        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [userSearch]);
  const limit = count / 20;
  const tab = [];
  for (let i = 0; i < limit; i++) {
    tab.push(i);
  }

  return isLoading ? (
    <Loader />
  ) : (
    <main>
      <div className="mainTop">
        <div>
          <img src={logo} alt="gamepad logo" />
          <h1 style={{ paddingTop: 10, fontSize: 70 }}>Gamepad</h1>
        </div>
        <div className="inputSearch">
          <input
            type="text"
            onChange={(e) => setUserSearch(e.target.value)}
            style={{ color: "black" }}
            placeholder="Search for a game..."
          />
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <span>Search {count} games</span>
      </div>

      <ul className="listGames">
        {data.map((elem) => {
          return (
            <Link
              key={elem.id}
              to={{
                pathname: `/games/${elem.id}`,
              }}
            >
              <li
                style={
                  elem.background_image
                    ? { backgroundImage: `url(${elem.background_image})` }
                    : { backgroundImage: `url(${imgNotFound})` }
                }
              >
                <div className="titleLi">
                  <span>{elem.name}</span>
                  <div className="hoverGame">
                    <p>HIDDEN</p>
                  </div>
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
      <ul style={{ display: "flex" }}>
        {/* {tab.map((elem, index) => {
          if (elem < page + 100) {
            for (let i = )
          }
          return (
            elem < page + 10 && (
              <li
                style={{ marginRight: 10, cursor: "pointer" }}
                key={index}
                onClick={() => setPage(elem)}
              >
                {elem}
              </li>
            )
          );
        })} */}
      </ul>
    </main>
  );
};

export default Home;
