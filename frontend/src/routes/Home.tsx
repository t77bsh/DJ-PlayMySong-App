import React, { useState, useEffect } from "react";
import "./styles/Home.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import meme from "../images/meme.jpeg";
import CreateRoom from "../components/CreateRoom";

const socket = io("https://dj-socket-app.herokuapp.com", {
  transports: ["websocket", "polling"],
});

function Home() {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    socket.on("connect", () => {});
    socket.on("disconnect", () => {});
    socket.on("pong", () => {});
    socket.on("check-complete", (exists) => {
      exists
        ? navigate(`/room/${inviteCode}`)
        : alert(
            `Room (${inviteCode}) does not exist. You may want to double-check your input for any typos!`
          );
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
      socket.off("check-complete")
    };
  }, [inviteCode]);

  // Join a room (key:******)
  const joinRoom = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    socket.emit("check-room-exists", inviteCode);
  };

  return (
    <>
      <div className="landing">
        <div className="landing__meme">
          <h3>*Loud Music Blasting*</h3>
          <img src={meme} alt="meme" />
          <h4>AVOID THIS!</h4>
        </div>
        <div className="home-modal">
          <div className="home-modal__join">
            <form onSubmit={joinRoom}>
              <label htmlFor="invite-code">
                <h2>Join A Room</h2>
              </label>
              <input
                name="invite-code"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter invite code"
                required
              />
              <br />
              <button type="submit" className="join-room">
                Join
              </button>
            </form>
          </div>

          <hr style={{ width: "50%" }} />

          <div className="home-modal__create">
            <CreateRoom />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
