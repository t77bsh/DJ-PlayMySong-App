import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./styles/CreateRoom.css";

function CreateRoom() {
  const navigate = useNavigate();

  const generateRoomCode = () => {
    let result = "";
    let characters =
      "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 7; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const createRoom = () => {
    let room = generateRoomCode();
    sessionStorage.setItem("auth", uuidv4());
    const uuidv = sessionStorage.getItem("auth");
    navigate(`/${uuidv}/${room}`, { replace: true });
  };
  return (
    <button className="create-roomm" onClick={createRoom}>
      <h3>CREATE ROOM AS DJ</h3>
    </button>
  );
}

export default CreateRoom;
