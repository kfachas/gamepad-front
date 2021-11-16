import React, { useEffect, useState } from "react";
import { IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

import ForumIcon from "@mui/icons-material/Forum";
import moment from "moment-timezone";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  senderBox: {
    alignSelf: "flex-end",
  },
  receiverBox: {
    alignSelf: "flex-start",
  },
}));

const Chat = ({ socket, currentUser }) => {
  const classes = useStyles();
  const [showChat, setShowChat] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [listMessages, setListMessages] = useState([]);

  useEffect(() => {
    socket.current?.on("listMessage", (listMessagesData) => {
      setListMessages(listMessagesData);
    });
  }, [socket]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && messageValue.trim().length !== 0) {
      e.preventDefault();

      socket.current.emit("newMessage", {
        text: messageValue,
        senderId: currentUser.uid,
        createdDate: new Date(),
        name: currentUser.account.username,
      });
    }
  };

  socket.current?.on("listMessages", (listMessagesData) =>
    setListMessages(listMessagesData)
  );

  return (
    <Box position="absolute" bottom={0} right={0} padding={3}>
      {!showChat ? (
        <IconButton
          onClick={() => setShowChat(true)}
          color="primary"
          style={{ backgroundColor: "white" }}
        >
          <ForumIcon />
        </IconButton>
      ) : (
        <Box
          height="500px"
          width="400px"
          bgcolor="GrayText"
          position="relative"
        >
          {listMessages.map((message, index) => {
            const isSender = message.senderId === currentUser.uid;
            return (
              <Box
                key={index}
                className={classNames({
                  [classes.senderBox]: isSender,
                  [classes.receiverBox]: !isSender,
                })}
              >
                <Typography>{message.text}</Typography>
                {/* <Typography>{moment(message.createdDate).unix()}</Typography> */}
              </Box>
            );
          })}
          <TextField
            style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            fullWidth
            multiline
            size="small"
            maxRows={3}
            onChange={(e) => setMessageValue(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e)}
          />
        </Box>
      )}
      {/* <Grid container style={{ height: 300, width: 150 }}>
        Chat
      </Grid> */}
    </Box>
  );
};
export default Chat;
