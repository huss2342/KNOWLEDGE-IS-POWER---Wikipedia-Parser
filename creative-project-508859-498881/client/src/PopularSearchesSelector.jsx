import React, { useState, useEffect } from "react";
const PopularSearchesSelector = ({
  selectedSearch,
  setSelectedSearch,
  searchOptions,
  popularsearches,
  setpopularsearches,
  reloadsearches,
  popularsearchesqueries,
  setpopularsearchesqueries,
  popularsearchesgraphs,
  setpopularsearchesgraphs,

  setPopularsearch,
  onPopularsearchSelect,
}) => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedin"));

  // Listen for changes in localStorage
  useEffect(() => {
    setLoggedIn(localStorage.getItem("loggedin"));
  }, [loggedIn]);

  const handle_popularsearcheschange = (e) => {
    const selectedchange = e.target.value;

    setpopularsearches(fetchPopularSearches())
    
    setPopularsearch(selectedchange);

    // Call the callback function with the selected bookmark
    onPopularsearchSelect(selectedchange);


  
  };

  const fetchPopularSearches = async () => {
    try {
      const response = await fetch("/popularSearches/getTopThree");
      if (!response.ok) {
        throw new Error("Error fetching popular searches");
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      setError(error.message || "Error fetching popular searches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label>
        Select a popular search:
        <select value={selectedSearch} onChange={handle_popularsearcheschange}>
          <option value="">Popular Searches</option>
          {popularsearchesqueries.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />
      {<button onClick={reloadsearches}>Update Top 3 Popular Searches</button>}
    </div>
  );
};

export default PopularSearchesSelector;
