import React, { useState, useEffect } from "react";

const RecomendedSearchesSelector = ({
  selectedSearch,
  setSelectedSearch,
  searchOptions,

  recomendedsearches,
  setrecomendedsearches,

  reloadrecomendedsearches,
  recomendedsearchesqueries,
  setrecomendedsearchesqueries,
  recomendedsearchesgraphs,
  setrecomendedsearchesgraphs,

  setrecomendedsearch,
  onrecomendedsearchSelect,
}) => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedin"));

  // Listen for changes in localStorage
  useEffect(() => {
    setLoggedIn(localStorage.getItem("loggedin"));
  }, [loggedIn]);

  const handle_recomendedsearcheschange = (e) => {
    const selectedchange = e.target.value;

    setrecomendedsearch(selectedchange);

    // Call the callback function with the selected bookmark
    onrecomendedsearchSelect(selectedchange);
  };

    //fetch recomended searches
    const fetchRecomendedSearches = async () => {
      try {
        const response = await fetch("/popularSearches/getTopThree");
        if (!response.ok) {
          throw new Error("Error fetching Recomended searches");
        }
  
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        setError(error.message || "Error fetching Recomended searches");
      } finally {
        setLoading(false);
      }
    };

  
  function reloadrecomended() {
    //if (localStorage.getItem("loggedin") === "true") {
     
     
      //get graphs and data needed to for loading recomended searches

      //console.log("Reloading recomended searches");
      //alert("Reloading recomended searches");
      setrecomendedsearches(fetchRecomendedSearches())
      reloadrecomendedsearches();


   // } else {



      //load the popular searches

     // alert("You must be logged in to get some recomendations");
    }
  

  return (
    <div>
      <label>
        Select a recomended search:
        <select
          value={selectedSearch}
          onChange={handle_recomendedsearcheschange}
        >
          <option value="">Recomended for you</option>
          {recomendedsearchesqueries.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />
      {
        <button onClick={reloadrecomended}>
          Display 3 Recomended Searches
          <br></br> () {" "}
        </button>
      }
    </div>
  );
};

export default RecomendedSearchesSelector;
