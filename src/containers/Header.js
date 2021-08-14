import logo from "../assets/game.png";
import { Link, useHistory } from "react-router-dom";
const Header = ({ setHideModal }) => {
  const history = useHistory();
  return (
    <header>
      <img
        src={logo}
        alt="logo gamepad"
        onClick={() => {
          history.push("/");
        }}
      />
      <Link to="/collection">My Collection</Link>
      <button
        onClick={() => {
          setHideModal(false);
        }}
      >
        Login
      </button>
    </header>
  );
};

export default Header;
