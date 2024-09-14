//should store the userhistory of a given user (loggedin or not)
import React, { useState, useEffect } from "react";

const HistorySelector = ({
  History,
  setHistory,
  HistoryOptions,
  onHistorySelect,
  sethisttempgraphs,
  setHistoryOptions,
  setHistoryGraphs,
  HistoryGraphs,
  histtempgraphs,
  updateDatabaseHistories,
  updateDatabaseBookmarks,
}) => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedin"));

  // Listen for changes in localStorage
  useEffect(() => {
    setLoggedIn(localStorage.getItem("loggedin"));
  }, [loggedIn]);

  const handleHistoryChange = (e) => {
    console.log("LISTTEMPGRAPHS  ", histtempgraphs);
    const selectedHistory = e.target.value;
    setHistory(selectedHistory);

    // Call the callback function with the selected History
    onHistorySelect(selectedHistory);

    sethisttempgraphs(histtempgraphs);
    // if(localStorage.getItem('loggedin')){
    //   if(localStorage.getItem('loggedin') == 'true'){
    //  //update the count so that when it is odd we update the bookmarks in the database(with the fact you did a search)
    //  localStorage.setItem('updateHistory',localStorage.getItem('updateHistory') + 1 )
    //   }
    // }
  };

  function deleteAll() {
    if (localStorage.getItem("loggedin") === "true") {
      //run query to delete all queries

      //modify the histories and historyoptions,
      sethisttempgraphs([]);
      setHistoryOptions([]);
      setHistoryGraphs([]);

      // Optionally, you may want to clear the selected option
      setHistory("");

      //database query stuff, delete all histories
      fetch("/history/deleteALL", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: localStorage.getItem("username") }),
      });
    } else {
      alert("You must be logged in to delete your history");
    }
  }

  function deleteOne() {
    if (localStorage.getItem("loggedin") === "true") {
      // Check if there's a selected option
      if (History) {
        // Find the index of the selected option
        const indexToDelete = HistoryOptions.indexOf(History);

        // Check if the option is found in the array
        if (indexToDelete !== -1) {
          // Create a new array without the selected option
          const updatedHistoryOptions = [
            ...HistoryOptions.slice(0, indexToDelete),
            ...HistoryOptions.slice(indexToDelete + 1),
          ];

          const updatedhisttempgraphs = [
            ...histtempgraphs.slice(0, indexToDelete),
            ...histtempgraphs.slice(indexToDelete + 1),
          ];

          const updatedHistoryGraphs = [
            ...HistoryGraphs.slice(0, indexToDelete),
            ...HistoryGraphs.slice(indexToDelete + 1),
          ];

          // Modify the histories and historyoptions
          setHistoryGraphs(updatedHistoryGraphs);
          sethisttempgraphs(updatedhisttempgraphs);
          setHistoryOptions(updatedHistoryOptions);

          // Optionally, you may want to clear the selected option
          setHistory("");

          //run database query

          //run database query to delete all and trust that it will re add in main

          //database query stuff, delete all bookmarks
          fetch("/history/deleteALL", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: localStorage.getItem("username"),
            }),
          });

          //update the count so that when it is odd we update the History in the database
          localStorage.setItem(
            "updateHistory",
            localStorage.getItem("updateHistory") + 1
          );
        }
      }
    } else {
      alert("You must be logged in to delete your history");
    }
  }

  return (
    <label>
      Select one of your Historys:
      <select value={History} onChange={handleHistoryChange}>
        <option value="">Historys</option>
        {HistoryOptions != [] ? (
          HistoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))
        ) : (
          <p> make queries to add to user history data</p>
        )}
      </select>
      <br />
      <br />
      {<button onClick={deleteOne}>Delete current history selection</button>}
      <br />
      <br />
      {<button onClick={deleteAll}>Delete entire search history</button>}
      <br />
      <br />
    </label>
  );
};

export default HistorySelector;
