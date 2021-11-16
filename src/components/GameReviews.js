import axios from "axios";

import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";

import { makeStyles } from "@mui/styles";
import {
  Badge,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import EditRoundedIcon from "@mui/icons-material/EditRounded";

const useStyles = makeStyles((theme) => ({
  onThumb: {
    margin: "0 8px",
    cursor: "pointer",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#2a2b2e",
    color: "white",
    height: 150,
    cursor: "pointer",
    marginTop: 16,

    padding: 16,
  },
  noPadding: {
    padding: 0,
  },
}));

const GameReviews = ({
  review,
  userToken,
  reviewRating,
  handleClickReview,
  listReviews,
  setListReviews,
  currentUser,
}) => {
  const classes = useStyles();
  const dateSplit = review.review_date.split("T");
  const date = dateSplit[0];

  const handleClickRating = async (e, userRate) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        "http://localhost:3310/game/reviewRating",
        {
          id: review._id,
          userRate,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      const filterReviews = listReviews.filter(
        (el) => el._id !== response.data._id
      );
      setListReviews([...filterReviews, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const getTooltipTitle = (userRate, total, rate) => {
    if (userRate === rate) {
      let text = "You ";
      if (rate === "like") {
        if (total > 1) {
          text += `and ${total - 1} people like this review`;
        } else {
          text += "like this review";
        }
      } else {
        if (total > 1) {
          text += `and ${total - 1} people dislike this review`;
        } else {
          text += "dislike this review";
        }
      }
      return text;
    } else {
      if (total > 0 && rate === "like") {
        return `${total} people like this review`;
      } else if (total > 0 && rate === "dislike") {
        return `${total} people dislike this review`;
      } else {
        if (rate === "like") {
          return "No like for this review";
        } else {
          return "No dislike for this review";
        }
      }
    }
  };

  const getPourcentages = (like, result) => {
    if (result === 0) {
      return "No rate";
    }

    const res = (100 * like) / result;
    return `${res.toFixed(0)}% de likes`;
  };
  const getColorOfPourcentages = (pourcentage) => {
    if (pourcentage >= 50) {
      if (pourcentage >= 75) {
        return "primary";
      } else {
        return "Highlight";
      }
    } else {
      if (pourcentage >= 25) {
        return "#ed6c02";
      } else {
        return "red";
      }
    }
  };

  return (
    <Card className={classes.card}>
      <CardContent className={classes.noPadding}>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Typography>{review.title}</Typography>
            <Box marginX={1}>-</Box>
            <Typography
              variant="body2"
              color={getColorOfPourcentages(
                (100 * review.rate.like) / review.rate.result
              )}
            >
              {getPourcentages(review.rate.like, review.rate.result)}
            </Typography>
            {currentUser.uid === review.owner._id && (
              <IconButton
                onClick={() => handleClickReview(review)}
                color="inherit"
              >
                <EditRoundedIcon />
              </IconButton>
            )}
          </Box>
          <Box display="flex" alignItems="center">
            {review.owner.account && review.owner.account.picture ? (
              <img
                src={review.owner.account.picture}
                alt={review.owner.account?.username}
              />
            ) : (
              <AccountCircleIcon />
            )}
            <Typography>{review.owner.account?.username}</Typography>
          </Box>
        </Box>
        <Divider style={{ backgroundColor: "white", marginBottom: 8 }} />
        <Typography
          variant="body2"
          style={{ height: "100%", width: "100%", overflow: "hidden" }}
        >
          {review.text}
        </Typography>
      </CardContent>
      <CardActions className={classes.noPadding}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography>{date}</Typography>
          <Box display="flex">
            <Badge
              badgeContent={review.rate.like}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Tooltip
                title={getTooltipTitle(
                  reviewRating?.rate,
                  review.rate.like,
                  "like"
                )}
              >
                <ThumbUpOffAltIcon
                  className={classes.onThumb}
                  color={reviewRating?.rate === "like" ? "primary" : "inherit"}
                  onClick={(e) => {
                    handleClickRating(e, "like");
                  }}
                />
              </Tooltip>
            </Badge>
            <Badge badgeContent={review.rate.dislike}>
              <Tooltip
                title={getTooltipTitle(
                  reviewRating?.rate,
                  review.rate.dislike,
                  "dislike"
                )}
              >
                <ThumbDownOffAltIcon
                  className={classes.onThumb}
                  color={
                    reviewRating?.rate === "dislike" ? "warning" : "inherit"
                  }
                  onClick={(e) => {
                    handleClickRating(e, "dislike");
                  }}
                />
              </Tooltip>
            </Badge>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};

export default GameReviews;
