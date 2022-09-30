import React, {FC} from "react";
import { HashRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import Home from "./routes/Home";
import Room from "./routes/Room";
import RoomUser from "./routes/RoomUser";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:uuidv/:roomCode" element={
        <ProtectedRoute redirectTo="/">
          <Room />
        </ProtectedRoute>}
        />
        <Route path="/room/:roomCode" element={<RoomUser />} />
      </Routes>
    </HashRouter>
  );
}

const ProtectedRoute: FC<{ children: JSX.Element, redirectTo: string }>  = ({children, redirectTo}) => {
  const dynamicRoute = useParams();
  return sessionStorage.getItem("auth")===dynamicRoute.uuidv ? children : <Navigate to={redirectTo} />
}

export default App;
