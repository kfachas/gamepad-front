import { Button, Dialog, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

export default function ReviewDialog({
  open,
  handleClose,
  selectedReview,
  userToken,
}) {
  const [updateReview, setUpdateReview] = useState(false);
  const [dataToUpdateReview, setDataToUpdateReview] = useState({
    newTitle: "",
    newText: "",
  });

  const handleClickActionReview = async (action) => {
    switch (action) {
      case "delete":
        try {
          await axios.post(
            "http://localhost:3310/game/deleteReview",
            { id: selectedReview._id },
            { headers: { Authorization: `Bearer ${userToken}` } }
          );
        } catch (error) {
          console.log(error);
        }
        return;
      case "update":
        try {
          await axios.post(
            "http://localhost:3310/game/updateReview",
            {
              id: selectedReview._id,
              ...dataToUpdateReview,
            },
            { headers: { Authorization: `Bearer ${userToken}` } }
          );
        } catch (error) {
          console.log(error);
        }
        return;
      default:
        return;
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <Button onClick={() => handleClickActionReview("delete")}>
        Supprimer la review
      </Button>
      <TextField
        disabled={!updateReview}
        onChange={(e) => {
          const obj = { ...dataToUpdateReview };
          obj.newTitle = e.target.value;
          setDataToUpdateReview(obj);
        }}
        defaultValue={
          dataToUpdateReview.newTitle
            ? dataToUpdateReview.newTitle
            : selectedReview.title
        }
      />
      <TextField
        disabled={!updateReview}
        onChange={(e) => {
          const obj = { ...dataToUpdateReview };
          obj.newText = e.target.value;
          setDataToUpdateReview(obj);
        }}
        defaultValue={
          dataToUpdateReview.newText
            ? dataToUpdateReview.newText
            : selectedReview.text
        }
      />
      <Button onClick={() => setUpdateReview(!updateReview)}>
        Update Review
      </Button>
      <Button
        onClick={() => handleClickActionReview("update")}
        disabled={!updateReview}
      >
        Sauvegarder
      </Button>
    </Dialog>
  );
}
