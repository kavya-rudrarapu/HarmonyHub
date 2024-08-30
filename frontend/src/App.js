import "./App.css";
import FavComponenet from "./components/FavComponent";
import HomeComponent from "./components/HomeComponent";
import SongComponent from "./components/SongComponent";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/song" element={<SongComponent />} />
          <Route path="/fav" element={<FavComponenet />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
