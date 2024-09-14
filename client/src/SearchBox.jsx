import React from "react";

const doSearch = async (inputSearch) => {
  try {
    const response = await fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputSearch }),
    });

    if (!response.ok) {
      // If the response status is not OK, handle it as an error
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.text();
    console.log(JSON.parse(data).responseData.listOfModifiers);

    return data; // Return the data from the function
  } catch (error) {
    alert("Your search could not be found in wikipedia");
    throw error; // Re-throw the error to be caught by the caller
  }
};

const SearchBox = ({
  input,
  setInput,
  selectedSearch,
  setSelectedSearch,
  searchOptions,
  onSearchComplete, // Add this callback prop
}) => {
  const handleSearch = async () => {
    try {
      const searchResult = await doSearch(input);
      // if (searchResult.success) {
      //   console.log("Search data:", searchResult.data);
      // } else {
      //   alert("Search failed:", searchResult.message);
      // }

      onSearchComplete(searchResult); // Call the callback prop
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div>
      <label>
        Input a search prompt into the Wikipedia scraper:<br></br>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      <button onClick={handleSearch}>Press to Search</button>
    </div>
  );
};

export default SearchBox;
