import React, { useState, useEffect, useRef } from "react";
import "./styles/RoomUser.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import ConnectionStatus from "../components/ConnectionStatus";
const socket = io("https://dj-socket-app.herokuapp.com", {
  transports: ["websocket", "polling"],
});

function RoomUser() {
  const { roomCode } = useParams();
  const [request, setRequest] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [doesRoomExist, setDoesRoomExist] = useState<boolean>();
  const navigate = useNavigate();
  const requestInput = useRef<HTMLInputElement>(null);
  const sentFeedback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      navigate("/");
    });

    socket.on("pong", () => {});

    // Double check room existence incase someone tries joining through url (key: *******)
    socket.emit("double-check-room-exists", roomCode);
    socket.on("double-check-complete", (exists) => {
      exists ? setDoesRoomExist(true) : setDoesRoomExist(false);
    });

    // Delete room (key: ****)
    socket.on("room-closed", () => {
      navigate("/");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
      socket.off("room-closed");
      socket.off("check-completee");
    };
  }, [navigate, roomCode]);

  const sendRequest = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    socket.emit("song-request", request, roomCode); // (key: **)
    requestInput.current!.value = "";
    sentFeedback.current!.style.display = "block";
    setTimeout(() => {
      sentFeedback.current!.style.display = "none";
    }, 1500);
  };

  //Leave room (key: ********)
  const leaveRoom = () => {
    socket.emit("leave-room", roomCode);
    navigate("/");
  };

  return doesRoomExist ? (
    <div className="request-modal">
      {isConnected ? (
        <ConnectionStatus status={true} positionClass={true} />
      ) : (
        <ConnectionStatus status={false} positionClass={true} />
      )}

      <form className="request-modal-content" onSubmit={sendRequest}>
        <label htmlFor="request">
          <h2>Make a song request:</h2>
        </label>
        <div className="request-modal-content__inp-div">
          <input
            ref={requestInput}
            name="request"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Enter song name"
            type="text"
            className="request-modal-content__input"
            required
          />
          <div ref={sentFeedback} className="request-modal-content__feedback">
            Sent
          </div>
        </div>

        <div className="request-modal-content__btns">
          <button
            onClick={leaveRoom}
            className="request-modal-content__btn request-modal-content__btn_leave"
          >
            Leave room
          </button>
          <button
            type="submit"
            className="request-modal-content__btn request-modal-content__btn_request"
          >
            Send Request
          </button>
        </div>
      </form>
      <div className="request-modal__code">Room: {roomCode}</div>
    </div>
  ) : (
    <div className="not-exist">
      <h2>
        Sorry, the room '{roomCode}' does not exist! Please check for typos.
      </h2>
      <Link to="/">Return to home</Link>
    </div>
  );
}

export default RoomUser;
