import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Login";
import Register from "./Register";
import ChatRooms from "./ChatRooms";
import StarCanvas from "./components/Stars";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/chatrooms" element={<ChatRooms />} />
      </Routes>
      <StarCanvas />
      <ToastContainer 
        position="top-center" 
        autoClose={2500} 
        theme="colored" 
        newestOnTop={true} 
        pauseOnHover={false} 
        closeOnClick
      />
    </Router>
  );
}

export default App;
