import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/game.png";
import imgNotFound from "../assets/noImageFound.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Home = () => {
  const [data, setData] = useState();
  const [userSearch, setUserSearch] = useState("");
  const [count, setCount] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [platform, setPlatform] = useState("");
  const [tag, setTag] = useState("");
  const [tagsData, setTagsData] = useState();
  const [platformsData, setPlatformsData] = useState();
  const [ordering, setOrdering] = useState("-rating");

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPlatforms();
    fetchTags();
  }, []);
  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:3310/tags");
      setTagsData(response.data.results);
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchPlatforms = async () => {
    try {
      const response = await axios.get("http://localhost:3310/platforms");
      setPlatformsData(response.data.results);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3310/?search=${userSearch}&page=${page}&ordering=${ordering}&tags=${tag}&platforms=${platform}`
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
  }, [userSearch, platform, tag, ordering, page]);
  const limit = Math.ceil(count / 20);

  const tab = [];
  for (let i = 1; i < limit; i++) {
    tab.push(i);
  }

  let currentItem;
  if (page === 1 || page === 2 || page === 3) {
    currentItem = tab.slice(2, 5);
  } else if (page === limit - 1 || page === limit - 2) {
    currentItem = tab.slice(limit - 5, limit - 3);
  } else {
    currentItem = tab.slice(page - 2, page + 1);
  }
  const lastItem = tab.slice(limit - 3, limit - 1);
  const firstItem = tab.slice(0, 2);
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <select
            name="platform"
            id="platformSelect"
            onChange={(e) => {
              setPlatform(e.target.value);
            }}
          >
            <option value="">Platform: All</option>
            {platformsData.map((elem) => {
              return (
                <option value={elem.id} key={elem.id}>
                  {elem.name}
                </option>
              );
            })}
          </select>
          <select
            name="type"
            id="typeSelect"
            onChange={(e) => {
              setTag(e.target.value);
            }}
          >
            <option value="">Type: All</option>
            {tagsData.map((elem) => {
              return (
                <option value={elem.id} key={elem.id}>
                  {elem.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <select
            name="sort"
            id="sortSelect"
            onChange={(e) => {
              setOrdering(e.target.value);
            }}
          >
            <option value="-rating">Sort by: Default</option>
            <option value="-metacritic">Metacritic</option>
            <option value="name">Name</option>
          </select>
        </div>
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
      <div className="pagination">
        <span
          style={{ marginRight: 10 }}
          onClick={() => {
            if (page > 10) {
              setPage(page - 10);
            }
          }}
        >
          {"<"}
        </span>
        <span
          style={{ marginRight: 10 }}
          onClick={() => {
            if (page > 100) {
              setPage(page - 100);
            }
          }}
        >
          {"<<"}
        </span>
        <span
          onClick={() => {
            if (page > 1000) {
              setPage(page - 1000);
            }
          }}
        >
          {"<<<"}
        </span>
        <ul style={{ display: "flex" }}>
          {firstItem.map((elem, index) => {
            return (
              <li
                key={index}
                style={{ margin: 10 }}
                onClick={() => {
                  setPage(elem);
                }}
              >
                {elem}
              </li>
            );
          })}
        </ul>
        ...
        <ul style={{ display: "flex" }}>
          {currentItem.map((elem, index) => {
            return (
              <li
                key={index}
                style={{ margin: 10 }}
                onClick={() => {
                  setPage(elem);
                }}
              >
                {elem}
              </li>
            );
          })}
        </ul>
        ...
        <ul style={{ display: "flex" }}>
          {lastItem.map((elem, index) => {
            return (
              <li
                key={index}
                style={{ margin: 10 }}
                onClick={() => {
                  setPage(elem);
                }}
              >
                {elem}
              </li>
            );
          })}
        </ul>
        <span
          onClick={() => {
            if (page < limit - 1000) {
              setPage(page + 1000);
            }
          }}
        >
          {">>>"}
        </span>{" "}
        <span
          style={{ marginLeft: 10 }}
          onClick={() => {
            if (page < limit - 100) {
              setPage(page + 100);
            }
          }}
        >
          {">>"}
        </span>{" "}
        <span
          style={{ marginLeft: 10 }}
          onClick={() => {
            if (page < limit - 10) {
              setPage(page + 10);
            }
          }}
        >
          {">"}
        </span>
      </div>
    </main>
  );
};

export default Home;
