import { useEffect, useState } from "react";
import axios from "axios";
const Home = () => {
  const [listGames, setListGames] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001");
        console.log(response.data.results);
        setListGames(response.data.results);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);
  return (
    <main>
      <span>Home</span>
      <ul className="listGames">
        {listGames.map((elem) => {
          return (
            <li
              key={elem.id}
              style={{ backgroundImage: `url(${elem.background_image})` }}
            >
              {elem.name}
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default Home;
