import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBox from "./SearchBox";
import BookmarkSelector from "./BookmarkSelector";
import HistorySelector from "./HistorySelector";
import LoginPanel from "./LoginPanel";
import Modifiers from "./Modifiers";
import ReturnedInfo from "./ReturnedInfo";
import PopularSearchesSelector from "./PopularSearchesSelector";
import NetworkGraph from "./NetworkGraph";
import myGif from "./firepic.gif";
import RecomendedSearchesSelector from "./RecomendedSearchesSelector";
// Set 'loggedin' to false in local storage when the page loads
localStorage.setItem("loggedin", false);

export default function App() {
  const [count, setCount] = useState(0);
  const [tracker, settracker] = useState(0);
  const [tracker1, settracker1] = useState(0);
  const [tracker2, settracker2] = useState(0);
  const [tracker3, settracker3] = useState(0);
  const [input, setInput] = useState("google");
  const [selectedSearch, setSelectedSearch] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [bookmark, setBookmark] = useState("");
  const [bookmarkOptions, setBookmarkOptions] = useState([]);
  const [hussein_bookmark_query, sethussein_bookmark_query] = useState([]);
  const [bookmarkGraphs, setBookmarkGraphs] = useState([]);
  const [bookmarktempgraphs, setbookmarktempgraphs] = useState([]);
  //const [currentresponse, setcurrentResponse] = useState('{"responseData":{"listOfModifiers": [{"infoboxKeys": ["nevin", "hussein", "layth", "razi"]}, "not nevin", " not hussein", "not layth", "not razi"],"finalGraph":{"nodes":[{"id":1,"label":"Node 1"},{"id":2,"label":"Node 2"},{"id":3,"label":"Node 3"},{"id":4,"label":"Node 4"}],"edges":[{"from":1,"to":3},{"from":1,"to":2},{"from":2,"to":4},{"from":3,"to":4},{"from":1,"to":4}]}}}'); // Add this state
  //const [currentresponse, setcurrentResponse] = useState('{"responseData":{"listOfModifiers": [{"Node 0":["test": "test property 0" ], "Node 1": ["test": "test property 1"]]} ,"finalGraph":{"nodes":[{"id":1,"label":"Node 1"},{"id":2,"label":"Node 2"},{"id":3,"label":"Node 3"},{"id":4,"label":"Node 4"}],"edges":[{"from":1,"to":3},{"from":1,"to":2},{"from":2,"to":4},{"from":3,"to":4},{"from":1,"to":4}]}}}'); // Add this state
  const [currentresponse, setcurrentResponse] = useState(
    '{"responseData":{"listOfModifiers": [{"Node 0":"test property 0" }, {"Node 1":  "test property 1"}] ,"finalGraph":{"nodes":[{"id":1,"label":"Node 1"},{"id":2,"label":"Node 2"},{"id":3,"label":"Node 3"},{"id":4,"label":"Node 4"}],"edges":[{"from":1,"to":3},{"from":1,"to":2},{"from":2,"to":4},{"from":3,"to":4},{"from":1,"to":4}]}}}'
  );

  const [display, displaystuff] = useState("");
  const [recentCreatedBookmark, setRecentCreatedBookmark] = useState(null);

  const [recentCreatedHistory, setRecentCreatedHistory] = useState(null);
  const [History, setHistory] = useState("");
  const [HistoryOptions, setHistoryOptions] = useState([]);
  const [hussein_History_query, sethussein_History_query] = useState([]);
  const [HistoryGraphs, setHistoryGraphs] = useState([]);
  const [histtempgraphs, sethisttempgraphs] = useState([]);

  //const [HistoryCount, setHistoryCount]= useState([]);
  //const [temp_count, settemp_count]= useState(0);
  //const [temp_duplicated, settemp_duplicated]= useState(false);
  // ...

  const [modifierStuff, setmodifierStuff] = useState(
    JSON.parse(currentresponse).responseData.listOfModifiers
  );
  const [current_clicked_node, setcurrent_clicked_node] = useState("");
  const [current_nodes, setcurrent_nodes] = useState([]);

  //JSON.parse(currentresponse).responseData.listOfModifiers

  const [recomendedsearches, setrecomendedsearches] = useState([]);
  const [recomendedsearchesgraphs, setrecomendedsearchesgraphs] = useState([
    '{"responseData":{"listOfModifiers": [{"Node 0":"test property 0" }, {"Node 1":  "test property 1"}] ,"finalGraph":{"nodes":[{"id":22,"label":"Node 22"},{"id":3,"label":"Node 3"},{"id":4,"label":"Node 4"}],"edges":[{"from":3,"to":3},{"from":3,"to":22},{"from":22,"to":4},{"from":3,"to":4},{"from":22,"to":4}]}}}',
    '{"responseData":{"listOfModifiers": [{"Node 0":"test property 0" }, {"Node 1":  "test property 1"}] ,"finalGraph":{"nodes":[{"id":1,"label":"Node 1"},{"id":2,"label":"Node 2"},{"id":4,"label":"Node 4"}, {"id":10,"label":"Node 10"}],"edges":[{"from":1,"to":2},{"from":1,"to":1},{"from":2,"to":10},{"from":1,"to":4},{"from":4,"to":4}]}}}',
    '{"responseData":{"listOfModifiers": [{"Node 0":"test property 0" }, {"Node 1":  "test property 1"}] ,"finalGraph":{"nodes":[{"id":1,"label":"Node 1"},{"id":30,"label":"Node 30"},{"id":4,"label":"Node 4"}],"edges":[{"from":1,"to":30},{"from":30,"to":30},{"from":30,"to":4},{"from":4,"to":4},{"from":1,"to":1}]}}}',
  ]);
  const [recomendedsearchesqueries, setrecomendedsearchesqueries] = useState([
    "testrecomended1",
    "testrecomended2",
    "testrecomended3",
  ]);
  const [chosenrecomendedsearch, setchosenrecomendedsearch] = useState([]);

  const onrecomendedsearchSelect = (inputtedsearch) => {
    console.log("SELECTING A RECOMENDED SEARCH");

    const querygraphdata = [];

    recomendedsearchesgraphs.forEach((theoption, index) => {
      querygraphdata.push({
        query: recomendedsearchesqueries[index],
        graph: theoption,
      });
    });

    setrecomendedsearches(querygraphdata); // test remove

    //change the graph associated with a query if it is now changed with a new graph
    for (const queryAndgraph of recomendedsearches) {
      if (queryAndgraph.query === inputtedsearch) {
        console.log("GRAPH  ", queryAndgraph.graph);
        setcurrentResponse(queryAndgraph.graph);
        break;
      }
    }
  };

  //popular search stuff
  //should get the object where it will be in a query and graph object unit array

  const [popularsearches, setpopularsearches] = useState([]);
  const [popularsearchesgraphs, setpopularsearchesgraphs] = useState([
    '{"responseData":{"listOfModifiers": [{"Node 0":"test property 0" }, {"Node 1":  "test property 1"}] ,"finalGraph":{"nodes":[{"id":2,"label":"Node 2"},{"id":3,"label":"Node 3"},{"id":4,"label":"Node 4"}],"edges":[{"from":3,"to":3},{"from":3,"to":2},{"from":2,"to":4},{"from":3,"to":4},{"from":2,"to":4}]}}}',
    '{"responseData":{"listOfModifiers": [{"Node 0":"test property 0" }, {"Node 1":  "test property 1"}] ,"finalGraph":{"nodes":[{"id":1,"label":"Node 1"},{"id":2,"label":"Node 2"},{"id":4,"label":"Node 4"}],"edges":[{"from":1,"to":2},{"from":1,"to":1},{"from":2,"to":4},{"from":1,"to":4},{"from":4,"to":4}]}}}',
    '{"responseData":{"listOfModifiers": [{"Node 0":"test property 0" }, {"Node 1":  "test property 1"}] ,"finalGraph":{"nodes":[{"id":1,"label":"Node 1"},{"id":3,"label":"Node 3"},{"id":4,"label":"Node 4"}],"edges":[{"from":1,"to":3},{"from":3,"to":3},{"from":3,"to":4},{"from":4,"to":4},{"from":1,"to":1}]}}}',
  ]);
  const [popularsearchesqueries, setpopularsearchesqueries] = useState([
    "testpopular1",
    "testpopular2",
    "testpopular3",
  ]);
  const [chosenpopularsearch, setchosenpopularsearch] = useState("");

  //test change
  const [networkGraphKey, setNetworkGraphKey] = useState(0);

  useEffect(() => {
    // Update the key whenever currentresponse changes
    setNetworkGraphKey((prevKey) => prevKey + 1);
  }, [currentresponse]);

  //fetch popular searches
  const fetchPopularSearches = async () => {
    try {
      const response = await fetch("/popularSearches/getTopThree");
      if (!response.ok) {
        throw new Error("Error fetching popular searches");
      }

      const data = await response.json();
      console.log("THE POPULAR SEARCH DATA IS HERE ", data);

      const inputgraphs = [];
      const inputqueries = [];
      const inputobjects = [];
      for (const input of data) {
        inputgraphs.push(input.allSearchesInfo.graph);
        inputqueries.push(input.allSearchesInfo.query);
        inputobjects.push(input.allSearchesInfo);
      }
      setpopularsearches(inputobjects);
      setpopularsearchesgraphs(inputgraphs);
      setpopularsearchesqueries(inputqueries);

      return data;
    } catch (error) {
      setError(error.message || "Error fetching popular searches");
    } finally {
      setLoading(false);
    }
  };

  const reloadpopularsearches = () => {
    fetchPopularSearches(); // run query to get the values of the arrays

    //const current_top_queries =[];

    //setpopularsearches(current_top_queries);
    //console.log("OLD POPULARSEARCHES ", popularsearches);

    // console.log("NEW POPULAR SEARches   ", popularsearches);
  };

  //fetch recomended searches
  const fetchRecomendedSearches = async () => {
    try {
      const response = await fetch("/popularSearches/recommended");
      if (!response.ok) {
        throw new Error("Error fetching Recomended searches");
      }

      const data = await response.json();
      console.log("RECOMENDED SEARCHES ", data);

      const inputgraphs = [];
      const inputqueries = [];
      const inputobjects = [];
      for (const input of data) {
        inputgraphs.push(input.graph);
        inputqueries.push(input.query);
        inputobjects.push(input);
      }
      setrecomendedsearches(inputobjects);
      setrecomendedsearchesgraphs(inputgraphs);
      setrecomendedsearchesqueries(inputqueries);

      return data;
    } catch (error) {
      setError(error.message || "Error fetching Recomended searches");
    } finally {
      setLoading(false);
    }
  };

  const updaterecomendedsearches = () => {
//hey chat i want to get 3 random entries from histtempgraphs where each one is different from the other 
    if(localStorage.getItem('loggedin') === 'true' && histtempgraphs.length > 3){

      //should get a selection based on searchhistory
        
        // Remove duplicates from the array
        let uniqueEntriesobjects = HistoryGraphs.filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
        let uniqueEntriesgraphs = histtempgraphs.filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
        let uniqueEntriesqueries = HistoryOptions.filter((value, index, self) => {
          return self.indexOf(value) === index;
        });

       // Check if there are more than 3 unique entries
        if (uniqueEntriesobjects.length > 3) {
          // Your array has more than three different entries
          console.log("The array has more than three different entries:", uniqueEntriesobjects);


          // Shuffle the array (Fisher-Yates algorithm)
            for (let i = uniqueEntriesobjects.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [uniqueEntriesobjects[i], uniqueEntriesobjects[j]] = [uniqueEntriesobjects[j], uniqueEntriesobjects[i]];
            }

            // Get the first three elements (randomly selected)
            const threeRandomEntries = uniqueEntriesobjects.slice(0, 3);



          const inputgraphs = [];
          const inputqueries = [];
          const inputobjects = [];
          for (const input of threeRandomEntries) {
            inputgraphs.push(input.historyInfo.graph);
            inputqueries.push(input.historyInfo.query);
            inputobjects.push(input.historyInfo);
          }
          setrecomendedsearches(inputobjects);
          setrecomendedsearchesgraphs(inputgraphs);
          setrecomendedsearchesqueries(inputqueries);




        } else {
          // If not, handle the case accordingly
          console.log("The array does not have more than three different entries.");
          fetchRecomendedSearches(); // run query to get the values of the arrays
        }



    }
    else {
       fetchRecomendedSearches(); // run query to get the values of the arrays
    }

   
  };




  const onPopularsearchSelect = (selectedsearch) => {
    console.log("SELECTING A POPULAR SEARCH");

    const querygraphdata = [];

    popularsearchesgraphs.forEach((theoption, index) => {
      querygraphdata.push({
        query: popularsearchesqueries[index],
        graph: theoption,
      });
    });

    setpopularsearches(querygraphdata); // test remove

    //change the graph associated with a query if it is now changed with a new graph
    for (const queryAndgraph of popularsearches) {
      if (queryAndgraph.query === selectedsearch) {
        console.log("GRAPH  ", queryAndgraph.graph);
        setcurrentResponse(queryAndgraph.graph);
        break;
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("loggedin", false);
    localStorage.setItem("updateBookmarks", 0);
    localStorage.setItem("updateHistory", 0);
    //make a query to get the popular searches based on the top 3 searches of all time (use the query text)

    //searches = fetchPopularSearches() //finetune query
    //setpopularsearches(searches)
  }, []); // The empty dependency array ensures that the effect runs only once (on mount)

  // const replaceoldhistories = async () => {
  //   try {
  //     // Delete all history
  //     await fetch('/history/deleteALL', {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ username: localStorage.getItem('username') }),
  //     });

  //     // Add historical graphs to bookmarks
  //     for (const [index, graph] of histtempgraphs) {

  //       const recentCreatedHistory1 = { query: HistoryOptions[index], graph };
  //       console.log("ADDING TO BASE", recentCreatedHistory1);
  //        await fetch('/History/add', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ username: localStorage.getItem('username'), bookmarkInfo: recentCreatedHistory1 }),
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //   }
  // };

  //updates database history whenever a field is changed
  useEffect(() => {
    // Log the value whenever 'updateHistory' changes

    const updateHistoryValue = localStorage.getItem("updateHistory");
    const isEven =
      updateHistoryValue && parseInt(updateHistoryValue, 10) % 2 === 0;

    if (!isEven) {
      //update database
      for (let index = 0; index < histtempgraphs.length; index++) {
        console.log(
          "HISTORY ENTRY ADDED TO BASE ",
          localStorage.getItem("username"),
          " query: ",
          HistoryOptions[index],
          " graph: ",
          histtempgraphs[index]
        );

        fetch("/history/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserName: localStorage.getItem("username"),
            BookMarkInfo: {
              query: HistoryOptions[index],
              graph: histtempgraphs[index],
            },
          }),
        });
      }

      //update the count so that when it is odd we update the bookmarks in the database
      localStorage.setItem(
        "updateHistory",
        localStorage.getItem("updateHistory") + 1
      );
    }
  }, [localStorage.getItem("updateHistory")]);

  //updates database for bookmarks whenever the fields change in localstorage
  useEffect(() => {
    // Log the value whenever 'updateBookmarks' changes

    const updateBookmarksValue = localStorage.getItem("updateBookmarks");
    const isEven =
      updateBookmarksValue && parseInt(updateBookmarksValue, 10) % 2 === 0;

    if (!isEven) {
      //update database
      for (let index = 0; index < bookmarktempgraphs.length; index++) {
        console.log(
          "BOOKMARK ENTRY ADDED TO BASE ",
          localStorage.getItem("username"),
          " query: ",
          bookmarkOptions[index],
          " graph: ",
          bookmarktempgraphs[index]
        );

        fetch("/bookmark/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserName: localStorage.getItem("username"),
            BookMarkInfo: {
              query: bookmarkOptions[index],
              graph: bookmarktempgraphs[index],
            },
          }),
        });
      }

      //update the count so that when it is odd we update the bookmarks in the database
      localStorage.setItem(
        "updateBookmarks",
        localStorage.getItem("updateBookmarks") + 1
      );
    }
  }, [localStorage.getItem("updateBookmarks")]);

  const handleBookmarkSelection = (selectedBookmark) => {
    // Do something with the selected bookmark
    console.log("SELECTING A BOOKMARK SEARCH");

    const querygraphdata = [];

    bookmarktempgraphs.forEach((theoption, index) => {
      querygraphdata.push({ query: bookmarkOptions[index], graph: theoption });
    });

    setBookmarkGraphs(querygraphdata); // test remove

    //change the graph associated with a query if it is now changed with a new graph
    for (const queryAndgraph of bookmarkGraphs) {
      if (queryAndgraph.query === selectedBookmark) {
        console.log("GRAPH  ", queryAndgraph.graph);
        setcurrentResponse(queryAndgraph.graph);
        break;
      }
    }
  };

  const handleHistorySelection = (selectedHistory) => {
    console.log("SELECTED HISTORY  ", selectedHistory);
    // Do something with the selected History

    //check to match the query id number for history to get the graph at the time and iteration

    //change the graph associated with a query if it is now changed with a new graph

    // update history selection graph when needed

    console.log("SELECTING A HISTORY SEARCH");

    const querygraphdata = [];

    histtempgraphs.forEach((theoption, index) => {
      querygraphdata.push({ query: HistoryOptions[index], graph: theoption });
    });
   
    console.log(histtempgraphs);

    setHistoryGraphs(querygraphdata);

    console.log("GRAPH DATA FR FR", HistoryGraphs);

    for (const queryAndgraph of HistoryGraphs) {
      if (queryAndgraph.query === selectedHistory) {
        console.log("GRAPH  ", queryAndgraph.graph);

        setcurrentResponse(queryAndgraph.graph);
        break;
      }
    }

    //for (let index = 0; index < bookmarktempgraphs.length; index++) { }
  };

  //implementing user histories
  // Log the values of recentCreatedHistory inside useEffect
  useEffect(() => {
    //check if the username has a value in local storage before sending it to serverside
    if (localStorage.getItem("username") && recentCreatedHistory) {
      //figure out how many instances of the query are in the history

      //get rid of this or modify to delete from database and rewrite
      //   fetch('/history/add', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ UserName: localStorage.getItem('username') ,HistoryInfo: recentCreatedHistory}),
      //   });
      // }

      console.log("1Recent Created History:", recentCreatedHistory);
    }
  }, [recentCreatedHistory]);

  // Log the values of recentCreatedBookmark inside useEffect
  useEffect(() => {
    //check if the username has a value in local storage before sending it to serverside
    if (localStorage.getItem("username") && recentCreatedBookmark) {
      //make the query to send the query stuff to hussein
      console.log("1Recent Created Bookmark:", recentCreatedBookmark);

      // The rest of your code that needs to run after recentCreatedBookmark is updated
    }
  }, [recentCreatedBookmark]);

  const handleAddSearch = async () => {
    try {
      //recording the graphs as well
      setBookmarkGraphs((options) => [
        ...options,
        { query: input, graph: currentresponse },
      ]); //add the query to the bookmark dropdown and update the graph it is associated with in the bookmarkgraphs array

      fetch("/bookmark/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: localStorage.getItem("username"),
          BookMarkInfo: { query: input, graph: currentresponse },
        }),
      });
      console.log(
        "ENTRY ADDED TO BASE ",
        localStorage.getItem("username"),
        " ",
        input,
        " ",
        currentresponse
      );

      if (input.trim() !== "" && !bookmarkOptions.includes(input)) {
        setBookmarkOptions((options) => [...options, input]);
        setbookmarktempgraphs((options) => [...options, currentresponse]);
        //this is where i should store the query as a key and the response variable as a value in order to bookmark the site
        setBookmarkGraphs((options) => [
          ...options,
          { query: input, graph: currentresponse },
        ]);

        // Update recentCreatedBookmark after bookmarkGraphs is updated

        setRecentCreatedBookmark({ query: input, graph: currentresponse });
      } //change the graph of an already bookmarked item, fix this part
      else if (bookmarkOptions.includes(input)) {
        setBookmarkGraphs((options) => {
          const index = options.findIndex((item) => item.query === input);

          if (index !== -1) {
            // If the key is found, update the value
            options[index] = { query: input, graph: currentresponse };
            const oof = bookmarktempgraphs;
            oof[index] = currentresponse;
            setbookmarktempgraphs(oof);
          } else {
            // If the key is not found, add a new entry
            options.push({ query: input, graph: currentresponse });
            const oof = bookmarktempgraphs;
            oof.push(currentresponse);
            setbookmarktempgraphs(oof);
          }

          setBookmarkGraphs([...options]);
        });

        setRecentCreatedBookmark({ query: input, graph: currentresponse });

        return;
      }

      setCount((count) => count + 1);

      //this is where i should store the query as a key and the response variable as a value in order to bookmark the site
    } catch (error) {
      console.error("Error during searching stuff:", error);
    }
  };

  // //should get all the keys of a list of nodes
  // function getAllKeys(){

  //   //should store every node and its key values wih node # and key info
  //   JSON.parse(currentresponse).responseData.listOfModifiers

  //   for

  // }

  const handleSearchComplete = (response) => {
    // Handle the response data received from SearchBox
    setcurrentResponse(response);

    //adds the query to the history once the graph is loaded, adds the graph, updates recently created history, updates options in dropdown

    setHistoryGraphs((options) => [
      ...options,
      { query: input, graph: response },
    ]); //add the query to the bookmark dropdown and update the graph it is associated with in the bookmarkgraphs array

    // setHistoryGraphs((options) => [...options, {query: input, graph: currentresponse}]);

    setRecentCreatedHistory({ query: input, graph: response });

    setHistoryOptions((options) => [...options, input]);

    sethisttempgraphs((options) => [...options, response]);

    //add to popular searches
    fetch("/popularSearches/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: input,
        graph: response,
      }),
    });

    //add to history
    fetch("/history/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserName: localStorage.getItem("username"),
        BookMarkInfo: { query: input, graph: response },
      }),
    });

    setmodifierStuff(JSON.parse(currentresponse).responseData.listOfModifiers);
  };
  const Divider = () => {
    return (
      <hr
        style={{ borderTop: "1px solid red", width: "100%", margin: "0" }}
      ></hr>
    );
  };

  //  //database query stuff, delete all bookmarks
  //  fetch('/bookmark/deleteALL', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({  UserName: localStorage.getItem('username')}),
  // });

  //   for (const bookmark of bookmarkgraphs){
  //     fetch('/bookmark/add', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({  UserName: localStorage.getItem('username'), BookMarkInfo: {query:bookmark.query , graph:bookmark.graph} }),
  //     });
  //   }

  const handleNodeClick = (current_clicked_node) => {
    // Do something with the clicked node in the App component
    console.log("Node clicked in App component:", current_clicked_node[0]);

    setcurrent_clicked_node(current_clicked_node);
    // You can set it to state or perform any other actions here
  };

  const updateNodes = (inputnodes) => {
    console.log(inputnodes);
    setcurrent_nodes(inputnodes);
    // You can set it to state or perform any other actions here
  };

  return (
    <div className="centerTop">
      <div className="card">
        <div className="topLeft">
          <PopularSearchesSelector
            selectedSearch={chosenpopularsearch}
            setSelectedSearch={setchosenpopularsearch}
            searchOptions={searchOptions}
            popularsearches={popularsearches}
            setpopularsearches={setpopularsearches}
            reloadsearches={reloadpopularsearches}
            popularsearchesqueries={popularsearchesqueries}
            setpopularsearchesqueries={setpopularsearchesqueries}
            popularsearchesgraphs={popularsearchesgraphs}
            setpopularsearchesgraphs={setpopularsearchesgraphs}
            setPopularsearch={setchosenpopularsearch}
            onPopularsearchSelect={onPopularsearchSelect}
          />

          <br />
          <br />
          <BookmarkSelector
            bookmark={bookmark}
            setBookmark={setBookmark}
            bookmarkOptions={bookmarkOptions}
            onBookmarkSelect={handleBookmarkSelection} // Pass the callback function
            setbookmarktempgraphs_main={setbookmarktempgraphs}
            setbookmarkoptions={setBookmarkOptions}
            setbookgraphs={setBookmarkGraphs}
            bookmarkgraphs={bookmarkGraphs}
            bookmarktempgraphs={bookmarktempgraphs}
            // updateDatabaseHistories = {replaceoldhistories}
            // updateDatabaseBookmarks = {replacebookmarks}
          />

          <br />
          <br />
          <HistorySelector
            History={History}
            setHistory={setHistory}
            HistoryOptions={HistoryOptions}
            onHistorySelect={handleHistorySelection} // Pass the callback function
            sethisttempgraphs={sethisttempgraphs}
            setHistoryOptions={setHistoryOptions}
            setHistoryGraphs={setHistoryGraphs}
            HistoryGraphs={HistoryGraphs}
            histtempgraphs={histtempgraphs}
            // updateDatabaseHistories = {replaceoldhistories}
            // updateDatabaseBookmarks = {replacebookmarks}
          />

          <br />
          <br />

          <RecomendedSearchesSelector
            selectedSearch={chosenrecomendedsearch}
            setSelectedSearch={setchosenrecomendedsearch}
            searchOptions={searchOptions}
            // loggedin = {localStorage.getItem('loggedin')}

            recomendedsearches={recomendedsearches}
            setrecomendedsearches={setrecomendedsearches}
            reloadrecomendedsearches={updaterecomendedsearches}
            recomendedsearchesqueries={recomendedsearchesqueries}
            setrecomendedsearchesqueries={setrecomendedsearchesqueries}
            recomendedsearchesgraphs={recomendedsearchesgraphs}
            setrecomendedsearchesgraphs={setrecomendedsearchesgraphs}
            setrecomendedsearch={setchosenrecomendedsearch}
            onrecomendedsearchSelect={onrecomendedsearchSelect}
          />
        </div>

        <div className="topCenter">
          <SearchBox
            input={input}
            setInput={setInput}
            onSearchComplete={handleSearchComplete} // Pass the callback function
          />

          <button onClick={handleAddSearch}>Bookmark search query</button>
          <br />
          {/* <button onClick={() => setCount((count) => count + 1)}>
            Amount of searches currently: {count}
          </button> */}
          {/* {input !== '' && <p>Your current search query is {input}.</p>} */}
        </div>

        <div className="right">
          <div className="titlebannerstyle">
            <img
              src={myGif}
              alt="a picture of fire"
              style={{ width: "170px", height: "auto", left: "0%" }}
            />
            KNOWLEDGE IS POWER!!!
          </div>

          <div className="topRight">
            <LoginPanel
              //try to reset the values of the form when the user logs in or logs out.
              setBookmarks={setBookmarkOptions}
              setrecentBookmark={setRecentCreatedBookmark}
              setHistories={setHistoryOptions}
              setrecentHistory={setRecentCreatedHistory}
              setHistoryGraphs={setHistoryGraphs}
              setSelectedSearch={setSelectedSearch}
              setBookmarkOptions={setBookmarkOptions}
              setBookmarkGraphs={setBookmarkGraphs}
              setcurrentResponse={setcurrentResponse}
              setHistoryOptions={setHistoryOptions}
              newhistqueries={HistoryOptions}
              newhistgraphs={HistoryGraphs}
              newbookmarkqueries={bookmarkOptions}
              newbookmarkgraphs={bookmarkGraphs}
              sethisttempgraphs_main={sethisttempgraphs}
              setbookmarktempgraphs_main={setbookmarktempgraphs}
            />
          </div>

          <div className="checkboxSet right">
            <div class="box">
              <ReturnedInfo //should hopefully get the key info stuff   .infoboxKeys
                returnedInfoOptions={
                  JSON.parse(currentresponse).responseData.listOfModifiers[
                    current_clicked_node[0]
                  ]
                    ? JSON.parse(currentresponse).responseData.listOfModifiers[
                        current_clicked_node[0]
                      ]
                    : JSON.parse(currentresponse).responseData.listOfModifiers
                }
                daClickedNode={current_clicked_node}
                allNodes={current_nodes}
                subcategory={
                  JSON.parse(currentresponse).responseData.listOfModifiers[
                    current_clicked_node[0]
                  ]
                    ? true
                    : false
                }
              />
              {/* <button onClick = {() => displaystuff(alert("node number "+    JSON.parse(currentresponse).responseData.finalGraph.nodes[1].label ))}>
            test response
            </button> */}
              {/* {
                 <p>Here is Response:  {currentresponse}</p>
              } */}
            </div>
          </div>
        </div>

        {/* {selectedSearch !== '' && (
          <p>You selected: {selectedSearch}. among the popular searches</p>
        )}
        {bookmark !== '' && (
          <p>You selected: {bookmark}. among your bookmark stuff</p>
        )} */}
      </div>

      <div className="graph-title">
        <p>Network Graph Example</p>
        <div className="network-graph-container">
          {/* <NetworkGraph
          inputnodes={JSON.parse(currentresponse).responseData.finalGraph.nodes}
          inputedges={JSON.parse(currentresponse).responseData.finalGraph.edges}
          modifierchanger={setmodifierStuff}
          currentresponsestuff={currentresponse}
          onNodeClick={handleNodeClick} // Pass the callback function
          updateNodes = {updateNodes}
        /> */}

          {/* NetworkGraph component with the key prop */}
          <NetworkGraph
            inputnodes={
              JSON.parse(currentresponse).responseData.finalGraph.nodes
            }
            inputedges={
              JSON.parse(currentresponse).responseData.finalGraph.edges
            }
            modifierchanger={setmodifierStuff}
            currentresponsestuff={currentresponse}
            onNodeClick={handleNodeClick} // Pass the callback function
            updateNodes={updateNodes}
            key={networkGraphKey}
          />
        </div>
      </div>
    </div>
  );
}
