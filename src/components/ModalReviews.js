import { useState } from "react";
import axios from "axios";
function ModalReviews({
  showModal,
  setShowModal,
  dataGame,
  userToken,
  setListReviews,
}) {
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://gamepad-back.herokuapp.com/game/addReview",
        {
          title,
          text: review,
          game: dataGame.id,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      const response = await axios.post(
        "https://gamepad-back.herokuapp.com/game/reviews",
        {
          gameId: dataGame.id,
        }
      );
      setListReviews(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      {showModal && (
        <div className="modReviews">
          <div className="modBloc">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: 20,
              }}
            >
              <h3>Write a review</h3>
              <span onClick={() => setShowModal(false)}>Close</span>
            </div>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <input
                type="text"
                style={{ margin: 10 }}
                placeholder="title"
                minLength="3"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <textarea
                type="text"
                style={{ margin: 10, outline: "none" }}
                placeholder="review"
                minLength="5"
                cols="50"
                rows="5"
                onChange={(e) => {
                  setReview(e.target.value);
                }}
              />
              <input type="submit" />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ModalReviews;
