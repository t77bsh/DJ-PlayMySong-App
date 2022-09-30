import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOnClickOutside } from "usehooks-ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import "./styles/Room.css";
import audience from "../images/—Pngtree—audience applaud and cheer_7512412.png";
import io from "socket.io-client";
import ConnectionStatus from "../components/ConnectionStatus";
const socket = io("https://dj-socket-app.herokuapp.com", {
  transports: ["websocket", "polling"],
});

function Room() {
  const { roomCode } = useParams();
  const copyTarget = useRef<HTMLDivElement>(null);
  const modal = useRef<HTMLDivElement>(null);
  const modalContent = useRef<HTMLDivElement>(null);
  let navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [count, setCount] = useState(0);
  const [requestsArray, setRequestsArray] = useState<any[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("pong", () => {});

    socket.emit("create-room", roomCode); // (key: *)

    //Count room (key: --)
    socket.emit("get-room-count", roomCode);
    socket.on("receive-room-count", (count) => {
      setCount(count - 1);
    });

    // Handle incoming song requests (key: ***)
    socket.on("receive-request", (requests) => {
      setRequestsArray(requests);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
      socket.off("receive-request");
      socket.off("receive-room-count");
    };
  }, [requestsArray, roomCode]);

  //Clear requests UI (key: ****)
  const clearRequests = () => {
    socket.emit("clear-requests", roomCode);
  };

  //show modal
  const showModal = () => {
    modal.current!.style.display = "block";
  };
  //close modal
  const closeModal = () => {
    modal.current!.style.display = "none";
  };
  // close modal when clicked outside anywhere
  const handleClickOutside = () => {
    modal.current!.style.display = "none";
  };

  useOnClickOutside(modalContent, handleClickOutside);

  // Delete room (key: *****)
  const deleteRoom = () => {
    socket.emit("delete-room", roomCode);
    navigate("/");
  };

  const qr = `https%3A%2F%2Ft77bsh.github.io%2FDJ-PlayMySong-App%2F%23%2Froom%2F${roomCode}`

  return(
    <div className="align">
      <div ref={modal} className="modal">
        <div ref={modalContent} className="modal-content">
          <span onClick={closeModal} className="modal-content__close-icon">
            &times;
          </span>
          <h3>Confirm end event?</h3>
          <p>This will delete the room and kick-out all guests.</p>
          <div className="modal-content__btns">
            <button
              className="modal-content__btn modal-content__btn_cancel"
              onClick={closeModal}
            >
              No, cancel
            </button>
            <button
              className="modal-content__btn modal-content__btn_confirm"
              onClick={deleteRoom}
            >
              Yes, confirm
            </button>
          </div>
        </div>
      </div>

      <div className="room-code-div">
        <div>Share your invite code: </div>
        <div ref={copyTarget} className="room-code-div__code">
          {roomCode}
          <span
            className="fa-copy-icon"
            data-tooltip="Click to copy!"
            data-flow="right"
          >
            <FontAwesomeIcon
              icon={faCopy}
              onClick={() => {
                navigator.clipboard.writeText(copyTarget.current?.innerText!);
              }}
            />
          </span>
        </div>
        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qr}`} alt="" />
      </div>

      <div className="info-div">
        {isConnected ? (
          <ConnectionStatus status={true} positionClass={false} />
        ) : (
          <ConnectionStatus status={false} positionClass={false} />
        )}

        <div>Room Count: {count}</div>
        <img style={{ width: "130px" }} src={audience} alt="audience" />
      </div>

      <div className="requests-ui-div">
        <div className="requests-ui-div__h5">
          <h5>REQUESTS</h5>
        </div>

        {requestsArray.length === 0 ? (
          <div className="requests-ui-div__awaiting">
            <div className="loader"></div>
            <div className="await-txt">Awaiting requests</div>
          </div>
        ) : (
          <ul className="requests-ui-div__ul">
            {requestsArray
              .slice(0)
              .reverse()
              .map((request, index) => {
                if (index === 0) {
                  return (
                    <li id="last-item" key={index}>
                      {request}
                    </li>
                  );
                } else if (index === 1) {
                  return (
                    <li id="penult-item" key={index}>
                      {request}
                    </li>
                  );
                } else {
                  return <li key={index}>{request}</li>;
                }
              })}
          </ul>
        )}
      </div>

      <div className="action-btns">
        <button
          className="action-btns__btn action-btns__btn_clear"
          onClick={clearRequests}
        >
          Clear Requests
        </button>
        <button
          className="action-btns__btn action-btns__btn_end"
          onClick={showModal}
        >
          End Event
        </button>
      </div>
    </div>
  )
}

export default Room;
