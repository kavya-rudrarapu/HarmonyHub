import React from "react";
import "../css/home.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import songs from "../data/songs.js";

const HomeComponent = () => {
  const navigate = useNavigate();
  const songLoc = useLocation();
  const [song, setSong] = useState(songLoc.state ? songLoc.state.play : null);
  const [isPlaying, setIsPlaying] = useState(
    songLoc.state ? songLoc.state.isPlaying : false
  );
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (song && songLoc.state?.currentTime) {
      audio.currentTime = songLoc.state.currentTime;
    }
    if (isPlaying) {
      audio.play().catch((error) => {
        console.log("Error playing audio:", error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, song]);

  const handleClick = (song) => {
    setSong(song);
    setIsPlaying(true);
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

  const handleFavClick = () => {
    navigate("/fav");
  };

  const handleHome = () => {
    navigate("/");
  };
  const handleSongNavigate = () => {
    const currentTime = audioRef.current.currentTime;
    navigate("/song", {
      state: {
        song: song,
        songs: songs,
        isPlaying: isPlaying,
        currentTime: currentTime,
      },
    });
  };

  return (
    <>
      <div className="container top">
        <h1
          style={{
            color: "whitesmoke",
            marginRight: "50%",
            textWrap: "nowrap",
            fontFamily: "cursive",
          }}
        >
          Harmony Hub
        </h1>
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

      <div
        className="container row justify-content-md-center align-items-md-center"
        style={{
          gap: "50px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "6%",
        }}
      >
        {songs
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
      {song != null && (
        <button
          onClick={handleSongNavigate}
          className="container playing d-flex justify-content-between align-items-center p-2 mt-4"
          style={{ borderRadius: "3px", color: "white", fontWeight: "bolder" }}
        >
          <img
            src={song.img}
            alt="Album Art"
            width={"50px"}
            height={"50px"}
            style={{ borderRadius: "10%" }}
          />
          <div className="d-flex flex-column" style={{ marginLeft: "10px" }}>
            <p style={{ margin: "0", color: "white" }}>{song.song}</p>
            <p style={{ margin: "0", color: "white", fontWeight: "lighter" }}>
              <small>{song.singers}</small>
            </p>
          </div>
          <p>{song.movie}</p>
          <p>{song.duration}</p>
        </button>
      )}
      <audio ref={audioRef} src={song ? song.audio : null}></audio>
    </>
  );
};

export default HomeComponent;
