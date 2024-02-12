import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Login";
import Register from "./Register";
import ChatRooms from "./ChatRooms";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/chatrooms" element={<ChatRooms />} />
      </Routes>
    </Router>
  );
}

export default App;
