import React, { useEffect, useRef, useState } from "react";
import {
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import ForumIcon from "@mui/icons-material/Forum";
import moment from "moment-timezone";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  senderBox: {
    alignSelf: "flex-end",
    maxWidth: "70%",
  },
  receiverBox: {
    alignSelf: "flex-start",
    maxWidth: "70%",
  },
  senderText: {
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#b5e7a0",
    color: "white",
  },
  receiverText: {
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#dac292",
    color: "white",
  },
}));

const Chat = ({ socket, currentUser }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [listMessages, setListMessages] = useState([]);
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    chatRef.current.scrollIntoView({
      block: "end",
    });
  };

  useEffect(() => {
    setLoading(true);

    if (socket) {
      socket.emit("getMessages", true);
      socket.on("listMessages", (listMessagesData) => {
        console.log("listMessages", listMessagesData);
        setListMessages(listMessagesData);
      });
    }
    setLoading(false);
  }, [socket]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && messageValue.trim().length !== 0) {
      e.preventDefault();
      console.log(currentUser.account.username);
      socket.emit("newMessage", {
        text: messageValue,
        senderId: currentUser.uid,
        createdDate: new Date(),
        name: currentUser.account.username,
      });
      setMessageValue("");
    }
  };
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setListMessages([...listMessages, newMessage]);
    });
  });

  useEffect(() => {
    if (chatRef && chatRef.current) {
      scrollToBottom();
    }
  }, [chatRef.current]);

  return (
    <Box position="fixed" bottom={0} right={0} padding={3}>
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
          padding={1}
        >
          <Box
            height="450px"
            width="100%"
            display="flex"
            flexDirection="column"
            overflow="scroll"
          >
            {loading ? (
              <CircularProgress />
            ) : (
              listMessages.map((message, index) => {
                const isSender = message.senderId === currentUser.uid;
                return (
                  <Box
                    key={index}
                    marginY={1}
                    className={classNames({
                      [classes.senderBox]: isSender,
                      [classes.receiverBox]: !isSender,
                    })}
                  >
                    <Box
                      className={classNames({
                        [classes.senderText]: isSender,
                        [classes.receiverText]: !isSender,
                      })}
                    >
                      <Typography
                        align={isSender ? "right" : "left"}
                        variant="body2"
                        color="CaptionText"
                      >
                        {isSender ? "You" : message.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        align={isSender ? "right" : "left"}
                      >
                        {message.text}
                      </Typography>
                      <Typography
                        align={isSender ? "right" : "left"}
                        style={{ fontSize: "10px" }}
                        color="InactiveCaptionText"
                      >
                        {moment(message.createdDate).format("HH:mm")}
                      </Typography>
                    </Box>
                    <Box ref={chatRef} />
                  </Box>
                );
              })
            )}
          </Box>
          <TextField
            fullWidth
            multiline
            size="small"
            label="Écrivez-ici"
            maxRows={3}
            value={messageValue}
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
