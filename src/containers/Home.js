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
  const [platform, setPlatform] = useState("");
  const [tag, setTag] = useState("");
  const [tagsData, setTagsData] = useState();
  const [platformsData, setPlatformsData] = useState();
  const [ordering, setOrdering] = useState("-rating");
  const [queries, setQueries] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:3001/tags");
        setTagsData(response.data.results);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPlatforms = async () => {
      try {
        const response = await axios.get("http://localhost:3001/platforms");
        setPlatformsData(response.data.results);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPlatforms();
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (queries) {
          const response = await axios.get(
            `http://localhost:3001/?search=${userSearch}&page=${page}&ordering=${ordering}&tags=${tag}&platforms=${platform}`
          );
          setData(response.data.results);
          setCount(response.data.count);
        } else {
          const response = await axios.get(
            `http://localhost:3001/?search=${userSearch}&page=${page}&ordering=-rating`
          );
          setData(response.data.results);
          setCount(response.data.count);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [userSearch, platform, tag, ordering, queries, page]);
  const limit = count / 20;
  const tab = [];
  for (let i = 1; i < limit; i++) {
    tab.push(i);
  }
  const indexLastItem = page + 2;
  const indexFirstItem = indexLastItem - 3;
  const currentItem = tab.slice(indexFirstItem, indexLastItem);
  const nextItem = tab.splice(indexFirstItem + 95, indexLastItem);
  console.log(currentItem);
  console.log(nextItem);
  console.log(page);
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
      {userSearch.length > 0 && (
        <div>
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
            <button onClick={() => setQueries(true)}>GO FILTERS</button>
          </div>
        </div>
      )}
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
      <div style={{ display: "flex" }}>
        <ul style={{ display: "flex" }}>
          {currentItem.map((elem, index) => {
            return (
              <li
                key={index}
                style={{ marginRight: 10 }}
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
          {nextItem.map((elem, index) => {
            return (
              <li
                key={index}
                style={{ marginLeft: 10 }}
                onClick={() => {
                  setPage(elem);
                }}
              >
                {elem}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
};

export default Home;
