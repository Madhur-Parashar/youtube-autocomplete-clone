import React from "react";
import { useEffect, useRef, useState } from "react";
import useFetch from "../hooks/useFetch";
import SearchListBox from "./SearchListBox";

const API_ENDPOINT = "https://www.omdbapi.com/?apikey=263d22d8";

export default function SeachBox() {
  const [inputValue, setInputValue] = useState("");
  const [prevInputValue, setPrevInputValue] = useState(inputValue);
  const url = prevInputValue ? `${API_ENDPOINT}&s=${prevInputValue}` : "";
  const [moviesList, error, loading] = useFetch(url);
  const [currentSelection, setCurrentSelection] = useState(-1);
  const [showList, setShowList] = useState(false);
  const ytdContentRef = useRef(null);
  console.log("moviesList", moviesList, currentSelection);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setPrevInputValue(e.target.value);
    setCurrentSelection(-1);
    setShowList(true);
    console.log("e.target.value", e.target.value);
  };
  const keyDownHandler = (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      return setShowList((show) => !show);
    }
    if (!moviesList || moviesList.length < 0 || !showList) return;
    if (e.key === "ArrowDown") {
      if (currentSelection >= moviesList.length) {
        setCurrentSelection(0);
        setInputValue(moviesList[0].Title);
      } else {
        setCurrentSelection((cur) => cur + 1);
        moviesList[currentSelection + 1]
          ? setInputValue(moviesList[currentSelection + 1].Title)
          : setInputValue(prevInputValue);
      }
    }
    if (e.key === "ArrowUp") {
      if (currentSelection < 0) {
        setCurrentSelection(moviesList.length - 1);
        setInputValue(moviesList[0].Title);
      } else {
        setCurrentSelection((cur) => cur - 1);
        moviesList[currentSelection - 1]
          ? setInputValue(moviesList[currentSelection - 1].Title)
          : setInputValue(prevInputValue);
      }
    }
  };

  useEffect(() => {
    function mouseDownHandler(e) {
      console.log("e", e, ytdContentRef);
      if (ytdContentRef.current && !ytdContentRef.current.contains(e.target)) {
        setShowList(false);
      }
    }
    document.addEventListener("mousedown", mouseDownHandler);
  }, []);

  const handleMovieSelect = (movie) => {
    console.log("movie", movie);
    setInputValue(movie.Title);
    setShowList(false);
  };
  return (
    <div ref={ytdContentRef}>
      <div className="ytd-searchbox">
        <input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={keyDownHandler}
          onClick={() => setShowList((show) => !show)}
          placeholder="Search movies..."
        ></input>
      </div>
      {showList && moviesList ? (
        <SearchListBox
          searchList={moviesList}
          loading={loading}
          error={error}
          currentSelection={currentSelection}
          onSelectSearchItem={handleMovieSelect}
          setCurrentSelection={setCurrentSelection}
        />
      ) : null}
    </div>
  );
}
