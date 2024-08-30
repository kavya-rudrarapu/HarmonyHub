import React, { useState, useEffect, useRef } from "react";
import "../css/song.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SongComponent = () => {
  const navigate = useNavigate();
  const likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || {};
  const [pause, setPause] = useState(
    "https://cdn-icons-png.flaticon.com/128/6878/6878705.png"
  );
  const [isLike, setIsLike] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const songLoc = useLocation();
  const [song, setSong] = useState(songLoc.state ? songLoc.state.song : null);
  const [like, setLike] = useState(
    likedSongs[song.audio]
      ? "https://cdn-icons-png.flaticon.com/128/15352/15352604.png"
      : "https://cdn-icons-png.flaticon.com/128/10335/10335557.png"
  );
  const [isPlaying, setIsPlaying] = useState(
    songLoc.state ? songLoc.state.isPlaying : null
  );
  const songs = songLoc.state ? songLoc.state.songs : null;
  const [currentTime, setCurrentTime] = useState(
    songLoc.state ? songLoc.state.currentTime : 0
  );

  useEffect(() => {
    const audio = audioRef.current;

    if (song) {
      audio.src = song.audio;

      if (currentTime) {
        audio.currentTime = currentTime;
      }

      if (isPlaying) {
        audio.play().catch((error) => {
          console.log("Error playing audio:", error);
        });
        setPause("https://cdn-icons-png.flaticon.com/128/6878/6878704.png");
      } else {
        audio.pause();
        setCurrentTime(audio.currentTime); // Track current time when paused
        setPause("https://cdn-icons-png.flaticon.com/128/6878/6878705.png");
      }
    }
  }, [isPlaying, song]);

  useEffect(() => {
    // Fetch liked songs from local storage when the component mounts
    const likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || {};
    if (song) {
      setIsLike(!!likedSongs[song.audio]);
    }
  }, [song]);

  const handlePausePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLike = () => {
    const newIsLike = !isLike;
    setIsLike(newIsLike);
    setLike(
      newIsLike
        ? "https://cdn-icons-png.flaticon.com/128/15352/15352604.png"
        : "https://cdn-icons-png.flaticon.com/128/10335/10335557.png"
    );

    if (newIsLike) {
      likedSongs[song.audio] = true;
    } else {
      delete likedSongs[song.audio];
    }
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  };

  const handleTimeUpdate = () => {
    const ct = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((ct / duration) * 100);
    setCurrentTime(ct); // Update currentTime while the song is playing
  };

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    const duration = audioRef.current.duration;
    audioRef.current.currentTime = (newProgress / 100) * duration;
    setProgress(newProgress);
  };

  const handleRewind = (song) => {
    setProgress(0);
    setCurrentTime(0);
    let idx = songs.indexOf(song);
    let len = songs.length;
    setSong(songs[(idx - 1 + len) % len]);
  };

  const handleForward = (song) => {
    setProgress(0);
    setCurrentTime(0);
    let idx = songs.indexOf(song);
    let len = songs.length;
    const nextSong = songs[(idx + 1) % len];
    setSong(nextSong);
    setIsPlaying(true);
    setPause("https://cdn-icons-png.flaticon.com/128/6878/6878704.png");
  };

  const handleReplay = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
    setPause("https://cdn-icons-png.flaticon.com/128/6878/6878704.png");
  };

  const handleBack = () => {
    const currentTime = audioRef.current.currentTime;
    navigate("/", { state: { play: song, isPlaying: isPlaying, currentTime } });
  };

  function mmSS(duration, isValueInMinsFormat = false) {
    if (isValueInMinsFormat) {
      // Convert minutes to seconds
      duration *= 60;
    }

    // Calculate minutes and seconds
    const minutes = Math.floor(duration / 60);
    const seconds = parseInt(duration % 60);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }

  return (
    <div className="now-playing">
      <div className="d-flex">
        <button
          style={{ border: "none", background: "none" }}
          onClick={handleBack}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/10238/10238209.png"
            style={{ width: "30%", marginLeft: "-15px" }}
            alt=""
          />
        </button>
        <h2 style={{ padding: "30px" }}>Now Playing</h2>
      </div>
      <img
        src={song.img}
        alt="Evolve"
        className="now-playing-cover"
        style={{ width: "70%", height: "350px" }}
      />
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleForward(song)} // Listen for the song ending
      ></audio>
      <div className="song-info">
        <h3>
          {song.song
            .toLowerCase()
            .split(" ")
            .reduce(
              (s, c) => s + "" + (c.charAt(0).toUpperCase() + c.slice(1) + " "),
              ""
            )}
        </h3>
        <p>{song.singers}</p>
        <div className="d-flex">
          <span style={{ marginLeft: "2%" }}>{mmSS(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            className="progress-bar"
            style={{ width: "72%", marginLeft: "3%" }}
            onChange={handleProgressChange}
          />
          <span style={{ marginLeft: "3%" }}>{song.duration}</span>
        </div>
        <div className="controls">
          <button className="replay" onClick={handleReplay}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/10181/10181301.png"
              alt=""
              style={{ width: "30%" }}
            />
          </button>
          <button className="rewind" onClick={() => handleRewind(song)}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/16878/16878816.png"
              alt=""
              style={{ width: "40%" }}
            />
          </button>
          <button className="pause-play" onClick={handlePausePlay}>
            <img src={pause} alt="" style={{ width: "100%" }} />
          </button>
          <button className="forward" onClick={() => handleForward(song)}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/16878/16878821.png"
              alt=""
              style={{ width: "40%" }}
            />
          </button>
          <button className="like" onClick={handleLike}>
            <img src={like} alt="" style={{ width: "30%" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongComponent;
