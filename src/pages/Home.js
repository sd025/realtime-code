import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { v4 as uuid } from "uuid";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Created a New Room");
    console.log(id);
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room IS & username is required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img className="homePageLogo" src="/dinos.jpeg" alt="dinos" />
        <h4 className="mainLabel">Paste invitaion Room ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            className="inputBox"
            placeholder="ROOM ID"
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="inputBox"
            placeholder="USER NAME"
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you dont have an invite then create,&nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              New Room
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
