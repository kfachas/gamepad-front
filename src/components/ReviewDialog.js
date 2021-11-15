import { Button, Dialog, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    backgroundColor: "#2a2b2e",
    color: "white",
  },
}));

export default function ReviewDialog({
  open,
  handleClose,
  selectedReview,
  userToken,
  setListReviews,
  listReviews,
}) {
  const classes = useStyles();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3310/game/addReview",
        {
          title: dataToUpdateReview.newTitle,
          text: dataToUpdateReview.newText,
          game: selectedReview.game,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      const response = await axios.post("http://localhost:3310/game/reviews", {
        gameId: selectedReview.game,
      });
      setListReviews(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      classes={{ paper: classes.dialogContainer }}
    >
      {selectedReview && (
        <Button
          variant="contained"
          fullWidth={false}
          onClick={() => setUpdateReview(!updateReview)}
        >
          Modifier
        </Button>
      )}
      <TextField
        size="small"
        disabled={selectedReview && !updateReview}
        placeholder={selectedReview ? "" : "Le titre ici.."}
        onChange={(e) => {
          const obj = { ...dataToUpdateReview };
          obj.newTitle = e.target.value;
          setDataToUpdateReview(obj);
        }}
        defaultValue={
          dataToUpdateReview.newTitle
            ? dataToUpdateReview.newTitle
            : selectedReview?.title
        }
      />

      <TextField
        size="small"
        maxRows={3}
        placeholder={selectedReview ? "" : "Le commentaire ici.."}
        multiline
        disabled={selectedReview && !updateReview}
        onChange={(e) => {
          const obj = { ...dataToUpdateReview };
          obj.newText = e.target.value;
          setDataToUpdateReview(obj);
        }}
        defaultValue={
          dataToUpdateReview.newText
            ? dataToUpdateReview.newText
            : selectedReview?.text
        }
      />
      <Box
        display="flex"
        justifyContent={selectedReview ? "space-between" : "flex-end"}
      >
        {selectedReview && (
          <Button onClick={() => handleClickActionReview("delete")}>
            Supprimer la review
          </Button>
        )}
        <Button
          onClick={(e) =>
            selectedReview ? handleClickActionReview("update") : handleSubmit(e)
          }
          disabled={
            selectedReview
              ? !updateReview
              : dataToUpdateReview.newTitle.trim().length === 0 ||
                dataToUpdateReview.newText.trim().length === 0
          }
        >
          Sauvegarder
        </Button>
      </Box>
    </Dialog>
  );
}
