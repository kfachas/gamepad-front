import React, { useEffect, useRef, useState } from "react";
import {
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import "./Chat.css";

import ForumIcon from "@mui/icons-material/Forum";
import moment from "moment-timezone";
import { makeStyles, styled } from "@mui/styles";
import classNames from "classnames";

import { io } from "socket.io-client";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "white",
  },

  "& .MuiOutlinedInput-root": {
    color: "white",

    "& fieldset": {
      borderColor: "#ff4655",
      color: "white",
    },
    "&:hover fieldset": {
      borderColor: "#ff4655",
      color: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff4655",
      color: "white",
    },
  },
});

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

const Chat = ({ currentUser }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [listMessages, setListMessages] = useState([]);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const chatRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("localhost:8900");
    } else if (socket.current) {
      if (listMessages.length === 0) {
        socket.current.on("listMessages", (listMessagesData) => {
          console.log("listMessages", listMessagesData);
          setListMessages(listMessagesData);
          scrollToBottom();
        });
      }
      socket.current.on("getNewMessage", (newMessage) => {
        console.log("getNewMessage", newMessage);
        setListMessages([...listMessages, newMessage]);
      });
      // socket.current.on(
      //   "userTyping",
      //   (user) => user.id !== currentUser.uid && setTypingIndicator(true)
      // );

      socket.current.on("display", (data) => {
        if (data.typing === true && data.user.id !== currentUser.uid)
          setTypingIndicator(true);
        else setTypingIndicator(false);
      });
    }
  }, [socket.current?.io, listMessages]);

  //   useEffect(() => {
  //     socket.current.on("welcome", (message) => console.log(message));
  //     socket.current.emit("addUser", currentUser?.uid);

  //   }, [currentUser?.uid]);

  const scrollToBottom = () => {
    chatRef.current?.scrollIntoView(true);
  };

  let user = { name: currentUser?.account?.username, id: currentUser?.uid };
  let typing = false;
  let timeout = undefined;

  function typingTimeout() {
    typing = false;
    socket.current.emit("typing", { user: user, typing: false });
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && messageValue.trim().length !== 0) {
      e.preventDefault();
      socket.current.emit("newMessage", {
        text: messageValue,
        senderId: currentUser.uid,
        createdDate: new Date(),
        name: currentUser.account?.username,
      });
      setMessageValue("");
      scrollToBottom();
    }

    if (e.key !== "Enter") {
      typing = true;
      socket.current.emit("typing", {
        user,
        typing,
      });
      clearTimeout(timeout);
      timeout = setTimeout(typingTimeout, 5000);
    } else {
      clearTimeout(timeout);
      typingTimeout();
      //sendMessage() function will be called once the user hits enter
    }
    // if (e.key !== "Enter") {
    //   socket.current.emit("typing", {
    //     username: currentUser.account.username,
    //     id: currentUser.uid,
    //   });
    //   console.log("ici");
    // }socket.on('display', (data)=>{
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      position="fixed"
      bottom={0}
      right={0}
      padding={3}
    >
      {showChat && (
        <Box
          height="500px"
          borderRadius={3}
          width="500px"
          bgcolor="#2a2b2e"
          position="relative"
          border="1px solid white"
          marginBottom={2}
          padding={3}
        >
          <Box
            height="calc(450px - 15px * 5)"
            width="100%"
            marginBottom={2}
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
                      <Typography variant="body2" align="left">
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
                  </Box>
                );
              })
            )}
            <Box ref={chatRef} />
          </Box>
          {typingIndicator && (
            <Box display="flex" alignItems="center" marginBottom={2}>
              <Box className="ticontainer" marginRight={1}>
                <Box className="tiblock">
                  <Box className="tidot"></Box>
                  <Box className="tidot"></Box>
                  <Box className="tidot"></Box>
                </Box>
              </Box>
              <Typography variant="body2">
                quelqu'un est entrain d'écrire...
              </Typography>
            </Box>
          )}
          <CssTextField
            fullWidth
            multiline
            InputLabelProps={{
              style: { color: "#fff", fontSize: "0.95rem" },
            }}
            size="small"
            label="Écrivez-ici"
            maxRows={3}
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e)}
          />
        </Box>
      )}

      <IconButton
        onClick={() => setShowChat(!showChat)}
        style={{ backgroundColor: "white", color: "#ff4655" }}
      >
        <ForumIcon />
      </IconButton>
    </Box>
  );
};
export default Chat;
