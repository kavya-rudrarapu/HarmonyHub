import React from "react";
import "../css/home.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import songs from "../data/songs.js";

const FavComponent = () => {
  const navigate = useNavigate();
  const likedSongsURLs = JSON.parse(localStorage.getItem("likedSongs")) || {};

  const likedSongs = songs.filter((song) => likedSongsURLs[song.audio]);
  const songLoc = useLocation();
  const [song, setSong] = useState(songLoc.state ? songLoc.state.play : null);
  const audioRef = useRef(null);
  const handleClick = (song) => {
    setSong(song);
    navigate("/song", {
      state: {
        song: song,
        songs: songs,
        isPlaying: true,
        currentTime: 0,
      },
    });
  };

  const [filterSong, setFilterSong] = useState("");
  const handleChange = (e) => {
    setFilterSong(e.target.value);
  };

  const handleHome = () => {
    navigate("/");
  };
  const handleFavClick = () => {
    navigate("/fav");
  };

  return (
    <>
      <div className="container top">
        <button
          onClick={handleFavClick}
          style={{ background: "none", border: "none" }}
        >
          <img
            className="favourite"
            src="https://cdn-icons-png.flaticon.com/128/5509/5509144.png"
            alt="Favourites"
          />
        </button>
        <form className="form-inline">
          <div className="input-container">
            <input
              className="form-control"
              type="search"
              placeholder="Search for something"
              aria-label="Search"
              onChange={handleChange}
            />
            <img
              className="search-icon"
              src="https://cdn-icons-png.flaticon.com/128/11741/11741045.png"
              alt="Search"
            />
          </div>
        </form>
        <button
          onClick={handleHome}
          style={{ background: "none", border: "none" }}
        >
          <img
            className="home"
            src="https://cdn-icons-png.flaticon.com/128/7606/7606139.png"
          />
        </button>
      </div>
      {likedSongs.length === 0 ? (
        <h1 style={{ color: "white", margin: "auto", padding: "auto" }}>
          No liked songs..!!
        </h1>
      ) : (
        <div
          className="container row justify-content-md-center align-items-md-center"
          style={{
            gap: "50px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "6%",
          }}
        >
          {likedSongs
            .filter((song) =>
              song.song.toLowerCase().includes(filterSong.toLowerCase())
            )
            .map((song, index) => (
              <button
                className="btn button"
                onClick={() => handleClick(song)}
                style={{ border: "none", background: "none" }}
                key={index}
              >
                <div className="album col-md-auto">
                  <img
                    src={song.img}
                    className="card-img-top img img-fluid m-2"
                    alt={song.song}
                    style={{
                      width: "300px",
                      height: "300px",
                      borderRadius: "10px",
                    }}
                  />
                  <center>
                    <p
                      className="p-3"
                      style={{
                        fontFamily: "Gill Sans Extrabold",
                        fontSize: "25px",
                        color: "whitesmoke",
                      }}
                    >
                      {song.song
                        .toLowerCase()
                        .split(" ")
                        .reduce(
                          (s, c) =>
                            s +
                            "" +
                            (c.charAt(0).toUpperCase() + c.slice(1) + " "),
                          ""
                        )}
                    </p>
                  </center>
                </div>
              </button>
            ))}
        </div>
      )}
      ;
    </>
  );
};

export default FavComponent;
