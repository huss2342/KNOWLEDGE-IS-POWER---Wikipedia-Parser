import React, { useState, useEffect } from "react";

const BookmarkSelector = ({
  bookmark,
  setBookmark,
  bookmarkOptions,
  onBookmarkSelect,
  setbookmarktempgraphs_main,
  setbookmarkoptions,
  setbookgraphs,
  bookmarkgraphs,
  bookmarktempgraphs,
  updateDatabaseHistories,
  updateDatabaseBookmarks,
}) => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedin"));

  // Listen for changes in localStorage
  useEffect(() => {
    setLoggedIn(localStorage.getItem("loggedin"));
  }, [loggedIn]);

  const handleBookmarkChange = (e) => {
    const selectedBookmark = e.target.value;
    setBookmark(selectedBookmark);

    // Call the callback function with the selected bookmark
    onBookmarkSelect(selectedBookmark);

    // if(localStorage.getItem('loggedin')){
    //   if(localStorage.getItem('loggedin') == 'true'){
    //  //update the count so that when it is odd we update the bookmarks in the database(with the fact you did a search)
    //  localStorage.setItem('updateBookmarks',localStorage.getItem('updateBookmarks') + 1 )
    //   }
    // }
  };

  function deleteAll() {
    if (localStorage.getItem("loggedin") === "true") {
      //run query to delete all queries

      //modify the bookmarks lists,
      setbookmarktempgraphs_main([]);
      setbookmarkoptions([]);
      setbookgraphs([]);

      // Optionally, you may want to clear the selected option
      setBookmark("");

      //database query stuff, delete all bookmarks
      fetch("/bookmark/deleteALL", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: localStorage.getItem("username") }),
      });
    } else {
      alert("You must be logged in to delete your bookmarks");
    }
  }

  function deleteOne() {
    if (localStorage.getItem("loggedin") === "true") {
      // Check if there's a selected option
      if (bookmark) {
        // Find the index of the selected option
        const indexToDelete = bookmarkOptions.indexOf(bookmark);

        // Check if the option is found in the array
        if (indexToDelete !== -1) {
          // Create a new array without the selected option
          const updatedBookmarkOptions = [
            ...bookmarkOptions.slice(0, indexToDelete),
            ...bookmarkOptions.slice(indexToDelete + 1),
          ];

          // Modify the bookmarks and bookmarkoptions

          const updatedbookmarktempgraphs = [
            ...bookmarktempgraphs.slice(0, indexToDelete),
            ...bookmarktempgraphs.slice(indexToDelete + 1),
          ];

          const updatedbookgraphs = [
            ...bookmarkgraphs.slice(0, indexToDelete),
            ...bookmarkgraphs.slice(indexToDelete + 1),
          ];

          setbookmarktempgraphs_main(updatedbookmarktempgraphs);
          setbookgraphs(updatedbookgraphs);
          setbookmarkoptions(updatedBookmarkOptions);

          // Optionally, you may want to clear the selected option
          setBookmark("");

          //run database query to delete all and trust that it will re add in main

          //database query stuff, delete all bookmarks
          fetch("/bookmark/deleteALL", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: localStorage.getItem("username"),
            }),
          });

          //update the count so that when it is odd we update the bookmarks in the database
          localStorage.setItem(
            "updateBookmarks",
            localStorage.getItem("updateBookmarks") + 1
          );
        }
      }
    } else {
      alert("You must be logged in to delete your bookmarks");
    }
  }

  return (
    <label>
      Select one of your bookmarks:
      <select value={bookmark} onChange={handleBookmarkChange}>
        <option value="">Bookmarks</option>
        {bookmarkOptions != [] ? (
          bookmarkOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))
        ) : (
          <p>add bookmarks to stuff</p>
        )}
      </select>
      <br />
      <br />
      {<button onClick={deleteOne}>Delete current bookmark selection</button>}
      <br />
      <br />
      {<button onClick={deleteAll}>Delete entire bookmark history</button>}
      <br />
      <br />
    </label>
  );
};

export default BookmarkSelector;
