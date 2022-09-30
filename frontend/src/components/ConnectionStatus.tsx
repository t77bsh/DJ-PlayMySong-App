import React from "react";
import "./styles/ConnectionStatus.css";

interface Status {
  status: boolean;
  positionClass: boolean;
}

function ConnectionStatus(props: Status) {
  return (
    <>
      {props.positionClass ? (
        <ul className="connection-status-ul connection-status-ul_position">
          {props.status ? (
            <li className="connection-status-ul__li connection-status-ul__li_connected">
              Connected
            </li>
          ) : (
            <li className="connection-status-ul__li connection-status-ul__li_notConnected">
              Not connected
            </li>
          )}
        </ul>
      ) : (
        <ul className="connection-status-ul">
          {props.status ? (
            <li className="connection-status-ul__li connection-status-ul__li_connected">
              Connected
            </li>
          ) : (
            <li className="connection-status-ul__li connection-status-ul__li_notConnected">
              Not connected
            </li>
          )}
        </ul>
      )}
    </>
  );
}

export default ConnectionStatus;
