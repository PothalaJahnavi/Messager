import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
