import React, { useState, useEffect } from "react";

const LoginPanel = ({
  setBookmarks,
  setrecentBookmark,
  setHistories,
  setrecentHistory,
  setHistoryGraphs,
  setSelectedSearch,
  setBookmarkOptions,
  setBookmarkGraphs,
  setcurrentResponse,
  setHistoryOptions,
  newhistqueries1,
  newhistgraphs1,
  newbookmarkqueries1,
  newbookmarkgraphs1,

  sethisttempgraphs_main,
  setbookmarktempgraphs_main,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tracker, settracker] = useState(0);
  const [tracker1, settracker1] = useState(0);
  const [tracker2, settracker2] = useState(0);
  const [tracker3, settracker3] = useState(0);
  const [showLoginFields, setShowLoginFields] = useState(false);
  const [message, setMessage] = useState("");
  const [newbookmarkgraphs, setnewbookmarkgraphs] = useState([]);
  const [newbookmarkqueries, setnewbookmarkqueries] = useState([]);
  const [newbookmarkbookmarkinfo, setnewbookmarkbookmarkinfo] = useState([]);
  const [newhistgraphs, setnewhistgraphs] = useState([]);
  const [newhistqueries, setnewhistqueries] = useState([]);
  const [newhistbookmarkinfo, setnewhistbookmarkinfo] = useState([]);
  //should update username
  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  const handleLoginButtonClick = () => {
    setShowLoginFields(!showLoginFields);

    //check if there is a logout attempt and if the user is loggedin, reset the form if need be
    if (showLoginFields && localStorage.getItem("username")) {
      //logout the user
      console.log("USER " + username + " is tryna log out ");

     

      setUsername("");
      setPassword("");
      alert(username + " has successfully logged out")
      localStorage.setItem("username", null);
      localStorage.setItem("loggedin", false);

     

      sethisttempgraphs_main([]);
      setbookmarktempgraphs_main([]);
      //reset the bookmarks and histories and graphs to default when loggedout
      setBookmarks([]);
      setHistories([]);
      setrecentHistory(null);
      setrecentBookmark(null);
      setHistoryGraphs([]);
      setSelectedSearch("");
      setBookmarkOptions([]);
      setBookmarkGraphs([]);
      setcurrentResponse(
        '{"responseData":{"listOfModifiers": [{"Node 0":"test property 0" }, {"Node 1":  "test property 1"}] ,"finalGraph":{"nodes":[{"id":1,"label":"Node 1"},{"id":2,"label":"Node 2"},{"id":3,"label":"Node 3"},{"id":4,"label":"Node 4"}],"edges":[{"from":1,"to":3},{"from":1,"to":2},{"from":2,"to":4},{"from":3,"to":4},{"from":1,"to":4}]}}}'
      );

      console.log("USER just logged out ");
    }
  };

  //code handles the register response
  const registerUser = async () => {
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage("Error registering user");
    }
  };

  const getOldBookmarks = async () => {

    const usernameValue = username; // Replace with the actual username

    try {
      const response = await fetch(`/bookmark/getList?username=${username}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch bookmarks. Status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("User bookmarks:", data);
      // Handle the retrieved data here
      console.log("dataaaaaa    ", data);
      return data;
    } catch (error) {
      console.error("Error fetching user bookmarks:", error.message);
    }
  };

  const getOldHistories = async () => {
    try {
      const response = await fetch(`/history/getList?username=${ localStorage.getItem("username")}`);

      const data = await response.json();
      console.log("HISTORY DATA STUFF IS HERE");
      console.log(data);
      setMessage(data.text);
      return data;
    } catch (error) {
      setMessage("Error getting old HISTORIES");
    }
  };

  //this handles the login response
  const loginUser = async () => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      console.log("response ", response);
      console.log("We should be logged in 0.1");
      const data = await response.text();
      console.log("We should be logged in 1");

      console.log("data   ", data);
      // //indicates logged in successfully based on javascript message
      if (data.includes("logged in successfully")) {
        // //reset the bookmarks and histories for the new loggedin user
        localStorage.setItem("loggedin", true);
        localStorage.setItem("username", username);
        alert(username + " has successfully logged in")
        setrecentHistory(null);
        setrecentBookmark(null);

        setSelectedSearch("");
        setcurrentResponse(
          '{"responseData":{"listOfModifiers": [{"Node 0":"test property 0" }, {"Node 1":  "test property 1"}] ,"finalGraph":{"nodes":[{"id":1,"label":"Node 1"},{"id":2,"label":"Node 2"},{"id":3,"label":"Node 3"},{"id":4,"label":"Node 4"}],"edges":[{"from":1,"to":3},{"from":1,"to":2},{"from":2,"to":4},{"from":3,"to":4},{"from":1,"to":4}]}}}'
        );

        //clear fields on login
        sethisttempgraphs_main([]);
        setbookmarktempgraphs_main([]);
        //reset the bookmarks and histories and graphs to default when loggedout
        setBookmarks([]);
        setHistories([]);
        setrecentHistory(null);
        setrecentBookmark(null);
        setHistoryGraphs([]);
        setSelectedSearch("");
        setBookmarkOptions([]);
        setBookmarkGraphs([]);
        setcurrentResponse(
          '{"responseData":{"listOfModifiers": [{"Node 0":"test property 0" }, {"Node 1":  "test property 1"}] ,"finalGraph":{"nodes":[{"id":1,"label":"Node 1"},{"id":2,"label":"Node 2"},{"id":3,"label":"Node 3"},{"id":4,"label":"Node 4"}],"edges":[{"from":1,"to":3},{"from":1,"to":2},{"from":2,"to":4},{"from":3,"to":4},{"from":1,"to":4}]}}}'
        );

        setnewbookmarkgraphs([]);
        setnewbookmarkqueries([]);
        setnewhistgraphs([]);
        setnewhistqueries([]);

        console.log("We should be logged in 1");

        //get the old bookmark and history data
        const oldBookmarks = await getOldBookmarks();
        const oldHistories = await getOldHistories();

        console.log("We should be logged in 2");
        if (oldHistories.length > 0) {
          const newhistbookmarkinfo1 = [];

          for (const historyInfo of oldHistories) {

            //check for username
            if(historyInfo.username === localStorage.getItem("username")){
                newhistgraphs.push(historyInfo.historyInfo.graph);
                newhistqueries.push(historyInfo.historyInfo.query);
                newhistbookmarkinfo1.push(historyInfo); //test
            }
          }

          setHistoryGraphs(newhistbookmarkinfo1); //test
          setHistories(newhistqueries);
          sethisttempgraphs_main(newhistgraphs);
        } else {
          setHistories([]);
          sethisttempgraphs_main([]);
        }

        console.log("We should be logged in00");
        if (oldBookmarks.length > 0) {
          console.log("We should be logged in0044");
          const newbookmarkbookmarkinfo2 = [];
          
          for (const bookmarkInfo of oldBookmarks) {
            console.log("We should be logged in00498");
          
                newbookmarkgraphs.push(bookmarkInfo.graph);
                newbookmarkqueries.push(bookmarkInfo.query);
                newbookmarkbookmarkinfo2.push(bookmarkInfo); //another test
            
          }
          console.log("We should be logged in008847");
          setBookmarkOptions(newbookmarkqueries);
          console.log("We should be logged in00899");
          setbookmarktempgraphs_main(newbookmarkgraphs);
          console.log("We should be logged in008865447");
          setBookmarkGraphs(newbookmarkbookmarkinfo2); //test
          console.log("We should be logged in0088887");
        } else {
          console.log("We should be logged in0045");
          setBookmarkOptions([]);
          setbookmarktempgraphs_main([]);
        }

        //make a query to get the recomended searches based on the top 3 user searches OR default to "you are not logged in "
        //if the user is notlogged in
        //TODO
      } else {
        console.log("NOT LOGGED IN HERE BRO, HERE IS MESSAGE " + data);
      }

      setMessage(data);
    } catch (error) {
      setMessage("Error logging in");
    }
  };

  return (
    <div className="loginPanel">
      {showLoginFields && (
        <>
          <label>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button onClick={registerUser}>
            Submit Registration Information
          </button>
          <button onClick={loginUser}>Submit Login Information</button>
          <div>{ }</div>
        </>
      )}
      <br />
      <button onClick={handleLoginButtonClick}>
        {showLoginFields ? "Cancel or Logout" : "Press to Login/Register"}
      </button>
    </div>
  );
};

export default LoginPanel;
