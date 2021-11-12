import logo from "../assets/game.png";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
const Header = ({ setHideModal, isConnected }) => {
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
      {isConnected && (
        <div>
          <Link to="/collection">

      
              <FontAwesomeIcon icon={faUserCircle} />
          
          </Link>
        </div>
      )}
      {!isConnected ? (
        <button
          onClick={() => {
            setHideModal(false);
          }}
          style={{ color: "white" }}
        >
          Login
        </button>
      ) : (
        <button style={{ color: "white" }} 
        // onClick={() => onSetUser(null)}
        >
          Disconnect
        </button>
      )}
    </header>
  );
};

export default Header;
