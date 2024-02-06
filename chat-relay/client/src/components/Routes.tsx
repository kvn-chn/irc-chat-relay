import { useContext, useState } from "react";
import Register from "./LoginAndRegister";
import Home from "./Home";
import { UserContext } from "./UserContext";
import { isConnected } from "../socket";

export default function Routes() {
    const { username, id } = useContext(UserContext);
    const [connected, setConnected] = useState(isConnected());

    if (connected !== isConnected()) {
        setConnected(isConnected());
    }

    if (username) {
        return <Home />;
    }

    return (
        <Register />
    );
}