import logo from "../assets/game.png";
import { Link, useHistory } from "react-router-dom";
const Header = ({ setHideModal, userToken, setToken, user }) => {
  const history = useHistory();
  return (
    <header>
      <div className="logoHeader">
        <img
          src={logo}
          alt="logo gamepad"
          onClick={() => {
            history.push("/");
          }}
        />
        <span>Gamepad</span>
      </div>
      {userToken && (
        <div>
          <Link to="/collection">
            {/* <img
              src={user.picture}
              alt="profilePicture"
              style={{ borderRadius: "50%" }}
            /> */}
            <span>{user.username}</span>
          </Link>
        </div>
      )}
      {!userToken ? (
        <button
          onClick={() => {
            setHideModal(false);
          }}
          style={{ color: "white" }}
        >
          Login
        </button>
      ) : (
        <button style={{ color: "white" }} onClick={() => setToken(null)}>
          Disconnect
        </button>
      )}
    </header>
  );
};

export default Header;
