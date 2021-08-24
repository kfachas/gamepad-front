import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as thumbsUpSolid,
  faThumbsDown as thumbsDownSolid,
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp,
  faThumbsDown,
  faUserCircle,
} from "@fortawesome/free-regular-svg-icons";
const GameReviews = ({ elem, userToken, setReviewsAdd }) => {
  const dateSplit = elem.review_date.split("T");
  const date = dateSplit[0];

  return (
    <li className="reviewBloc">
      <div className="reviewText">
        <h5>{elem.title}</h5>
        <p>{elem.text}</p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          {elem.owner.account.picture ? (
            <img
              src={elem.owner.account.picture}
              alt={elem.owner.account.username}
            />
          ) : (
            <FontAwesomeIcon icon={faUserCircle} />
          )}
          <span>{elem.owner.account.username}</span>
          <span style={{ fontSize: 13, marginLeft: 10 }}>{date}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: 13 }}>
            <FontAwesomeIcon
              style={{ margin: 5 }}
              icon={faThumbsUp}
              onClick={async () => {
                try {
                  const rate = 1;

                  const response = await axios.post(
                    "https://gamepad-back.herokuapp.com/game/reviewRating",
                    {
                      id: elem._id,
                      rate: rate,
                    },
                    { headers: { Authorization: `Bearer ${userToken}` } }
                  );
                  setReviewsAdd(true);
                  console.log(response);
                } catch (error) {
                  if (error.response.status === 401) {
                    alert("You must be login");
                  } else {
                    alert("You already rate this review");
                  }

                  console.log(error.message);
                }
              }}
            />
            <FontAwesomeIcon
              style={{ margin: 5 }}
              icon={faThumbsDown}
              onClick={async () => {
                try {
                  const rate = -1;

                  const response = await axios.post(
                    "https://gamepad-back.herokuapp.com/game/reviewRating",
                    {
                      id: elem._id,
                      rate: rate,
                    },
                    { headers: { Authorization: `Bearer ${userToken}` } }
                  );
                  setReviewsAdd(true);
                  console.log(response);
                } catch (error) {
                  if (error.response.status === 401) {
                    alert("You must be login");
                  } else {
                    alert("You already rate this review");
                  }
                  console.log(error.response);
                }
              }}
            />
          </div>
          {elem.rate.result > 0 ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={thumbsUpSolid}
                color="green"
                style={{ margin: 5 }}
              />{" "}
              <span style={{ color: "green", fontSize: 12 }}>
                {" "}
                {elem.rate.result}
              </span>
            </div>
          ) : elem.rate.result === 0 ? (
            <>
              <FontAwesomeIcon
                icon={thumbsUpSolid}
                color="gray"
                style={{ margin: 5 }}
              />
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={thumbsDownSolid}
                color="red"
                style={{ margin: 5 }}
              />{" "}
              <span style={{ color: "red", fontSize: 12 }}>
                {" "}
                {elem.rate.result}
              </span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default GameReviews;
