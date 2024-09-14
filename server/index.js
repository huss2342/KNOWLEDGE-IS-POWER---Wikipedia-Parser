const express = require("express");
require("dotenv").config();
const path = require("path");
const app = express();
const port = 1488;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
app.use(bodyParser.json());
const cheerio = require("cheerio");
const { create } = require("domain");
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));

// ---- data bases ----
const User = require("./mongoDB/users");
const Bookmark = require("./mongoDB/bookmark");
const History = require("./mongoDB/history");
const AllSearches = require("./mongoDB/AllSearches");

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB Connected…");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));


//----------------------------------------------- START OF FUNCTIONS -------------------------------------------------------

// Deal with handling other nodes that we found
const keysOfInterest = [
  "Founders",
  "Parent",
  "Key people",
  "Founder(s)",
  "Relatives",
  "Siblings",
  "Spouse",
  "Children",
];

// -------------------------------------------------------

// register the user
app.post("/register", async (req, res) => {
  console.log("gdsfg");
  try {
    console.log(req.body);
    const { username, password } = req.body;

    email = username;
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Create a new user
    const user = new User({ email, password });
    await user.save();

    console.log(`User ${username} created successfully`);
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering new user");
  }
});

// login the user
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    email = username;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Compare the provided password with the hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send("Incorrect password");
    }

    res.status(200).send("User " + username + " logged in successfully");
    console.log(`User ${username} logged in successfully`);
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

// search the wikipedia
app.post("/search", async (req, res) => {
  const { inputSearch } = req.body;
  // inputSearch = inputSearch.replace(/[\[\]()*]/g, '');
  try {
    const fullNodeMap = new Map();

    // Fetch and parse the Wikipedia page for the search term
    const parsedData = await getPage(inputSearch);
    // add parsedData to a map that keeps track of node number and its data
    fullNodeMap.set(fullNodeMap.size, parsedData);

    // Handle additional nodes that we found
    await handleNodes(keysOfInterest, parsedData, fullNodeMap);

    // Process the parsed data
    const listOfModifiers = createModifiers(fullNodeMap);

    // create the graph
    const finalGraph = createGraph(fullNodeMap);

    // Prepare the response data
    const responseData = {
      listOfModifiers,
      finalGraph,
    };

    // Send the response
    res.send({ responseData });
  } catch (error) {
    console.error("Error in /search route:", error);
    res.status(500).send("Error fetching data");
  }
});

// ---------------- BOOKMARK ----------------

// Add user bookmark
app.post("/bookmark/add", async (req, res) => {
  const { UserName, BookMarkInfo } = req.body;

  try {
    const username = UserName;
    const bookmarkInfo = BookMarkInfo;
    console.log(username, bookmarkInfo);
    const newBookmark = new Bookmark({ username, bookmarkInfo });
    await newBookmark.save();
    res.status(200).send("Bookmark added successfully");
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).send("Error adding bookmark");
  }
});

app.get("/bookmark/getList", async (req, res) => {
  const { username } = req.query;

  try {
    const bookmarks = await Bookmark.find({ username });
    
    // Simplify the bookmark data to include only necessary fields
    const simplifiedBookmarks = bookmarks.map(bookmark => ({
      _id: bookmark._id,
      query: bookmark.bookmarkInfo.query,
      graph: bookmark.bookmarkInfo.graph
    }));

    res.status(200).json(simplifiedBookmarks);
  } catch (error) {
    res.status(500).send("Error fetching user bookmarks: " + error.message);
  }
});

// delete a user bookmark
app.delete("/bookmark/delete", async (req, res) => {
  const { bookmarkId } = req.body;

  try {
    await Bookmark.findByIdAndDelete(bookmarkId);
    res.status(200).send("Bookmark deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting bookmark");
  }
});

//clear a user's bookmark stuff
app.delete("/bookmark/deleteALL", async (req, res) => {
  const { username } = req.body;

  try {
    await Bookmark.deleteMany({ username });
    res.status(200).send("Bookmarks deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting bookmarks");
  }
});

// ---------------- HISTORY ----------------

// add user history
app.post("/history/add", async (req, res) => {
  const { UserName, BookMarkInfo } = req.body;

  try {
    const username = UserName;
    const historyInfo = BookMarkInfo;
    console.log(username, historyInfo);
    const newHistory = new History({ username, historyInfo });
    await newHistory.save();
    res.status(200).send("History added successfully");
  } catch (error) {
    console.error("Error adding History:", error);
    res.status(500).send("Error adding History");
  }


});

app.get("/history/getList", async (req, res) => {
  const { userName } = req.query;

  try {
    const history = await History.find({ userName });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).send("Error fetching user history");
  }
});

// add user history
app.post("/history/delete", async (req, res) => {
  const { historyId } = req.body;

  try {
    // Check if the provided historyId is valid (e.g., it exists in the database)
    const historyToDelete = await History.findById(historyId);

    if (!historyToDelete) {
      return res.status(404).json({ error: "History not found" });
    }

    // Perform the deletion
    await historyToDelete.remove();

    res.status(200).json({ message: "History deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting history" });
  }
});

//clear a user's history
app.delete("/history/deleteALL", async (req, res) => {
  const { username } = req.body;

  try {
    await History.deleteMany({ username });
    res.status(200).send("History deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting History");
  }
});


// ---------------- POPULAR ----------------


app.post("/popularSearches/add", async (req, res) => {
  try {
    const { query, graph } = req.body; 
    const search = await AllSearches.findOneAndUpdate(
      { "allSearchesInfo.query": query },
      { 
        $set: { "allSearchesInfo.graph": graph },
        $inc: { "allSearchesInfo.popularityCount": 1 } 
      },
      { new: true, upsert: true }
    );
    res.status(200).send("Search added/updated successfully");
  } catch (error) {
    res.status(500).send("Error handling popular search: " + error.message);
  }
});


app.get("/popularSearches/recommended", async (req, res) => {
  try {
    // Get 3 random queries and graph from AllSearches
    const recommended = await AllSearches.aggregate([
      { $sample: { size: 3 } },
      { $project: { _id: 0, query: "$allSearchesInfo.query", graph: "$allSearchesInfo.graph" } }
    ]);
    res.status(200).json(recommended);
  } catch (error) {
    res.status(500).send("Error fetching recommended searches: " + error.message);
  }
});

// get a list of top 3 searches
app.get("/popularSearches/getTopThree", async (req, res) => {
  try {
    const topThreeSearches = await AllSearches.find()
                                .sort({ "allSearchesInfo.popularityCount": -1 })
                                .limit(3);
    res.status(200).json(topThreeSearches);
  } catch (error) {
    res.status(500).send("Error fetching popular searches");
  }
});


// get a single popular search
app.get("/popularSearches/getSingle", async (req, res) => {
  app.get("/popularSearches/getSingle", async (req, res) => {
    const { searchId } = req.query;
    try {
      const search = await AllSearches.findById(searchId);
      res.status(200).json(search);
    } catch (error) {
      res.status(500).send("Error fetching popular search");
    }
  });
});
  
//----------------------------------------------- END OF FUNCTIONS -------------------------------------------------------

//----------------------------------------------- START OF HELPERS -------------------------------------------------------

// function that waits for a certain amount of time
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// function that gets the search results
async function getPage(search) {
  console.log("searching for: ", search);
  try {
    await delay(1000);
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      search
    )}&format=json`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "wikiParser/1.0 (hussein.aljorani02@gmail.com)",
      },
    });

    if (!response.ok) {
      console.error(
        "API response error:",
        response.status,
        response.statusText
      );
      const errorResponse = await response.text();
      console.error("Error response body:", errorResponse.substring(0, 200)); // Log first 200 characters of the error response
      throw new Error("API response error");
    }

    const data = await response.json();

    if (data.query.search.length > 0) {
      const pageTitle = data.query.search[0].title;
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
        pageTitle
      )}`;

      // Fetch the content of the page
      const pageDetails = await fetch(pageUrl);
      const pageContent = await pageDetails.text();

      // Log the URL and the first 100 characters of the response
      console.log("Fetched URL:", pageUrl);
      console.log("Response snippet:", pageContent.substring(0, 100));

      // Parse the webpage content
      const parsedData = parseWebpageInfo(pageContent);
      return parsedData;
    } else {
      return new Error("No search results found");
    }
  } catch (error) {
    console.error("Error fetching page for:", search);
    console.error(error);
    return { success: false, message: error.message };
  }
}

// function that parses out the info from a webpage
function parseWebpageInfo(pageContent) {
  const $ = cheerio.load(pageContent);
  let parsedData = {};

  // Extracting the title
  parsedData.title = $("#firstHeading").text();

  // Extracting the first paragraph as a summary
  parsedData.summary = $(".mw-content-ltr.mw-parser-output")
    .find("p")
    .not(".mw-empty-elt") // Exclude paragraphs with class 'mw-empty-elt'
    .filter(function () {
      // Filter out paragraphs that only contain whitespace
      return $(this).text().trim() !== "";
    })
    .first()
    .text()
    .trim(); // Trim whitespace from the result

  parsedData.summary = parsedData.summary.replace(/\[\w+\]/g, ""); // Remove brackets
  parsedData.summary = parsedData.summary.replace(/\([^)]*\)/g, ""); // Remove parenthesized content

  // Extracting the main image (if available)
  parsedData.imageUrl = $("table.infobox img").first().attr("src");

  // Extracting the 2nd child of the image (could be text so bad)
  // parsedData.country = $("table.infobox tr:nth-child(2) td").text();

  parsedData.infobox = {}; // Initialize the infobox object
  // Parsing infobox for specific details
  $("table.infobox tr").each((index, element) => {
    const key = $(element).find("th").text().trim();
    let values = [];    
    // Remove <style> tags and elements with 'data-mw-deduplicate' attribute
    $(element).find("style, [data-mw-deduplicate]").remove();

    const listItems = $(element).find("td ul li");

    if (listItems.length > 0) {
      // Extract from each <li>
      listItems.each((i, el) => {
        if (keysOfInterest.includes(key)) {
          // First try to find an <a> tag and get its href attribute
          const hrefValue = $(el).find("a").attr("href");
          if (hrefValue) {
            // Format hrefValue by removing '/wiki/' and replacing '_' with ' '
            const formattedHrefValue = hrefValue
              .replace("/wiki/", "")
              .replace(/_/g, " ");
            // If hrefValue exists, use it
            console.log("hrefValue:", formattedHrefValue);
            values.push(formattedHrefValue.trim());
          }
        } else {
          // If no hrefValue, fallback to textValue
          const textValue = $(el).text().trim();
          if (textValue) {
            values.push(textValue);
          }
        }
      });
    } else {
      // if it's a key interest
      if (keysOfInterest.includes(key)) {
        // If not in list items, try to get the <a> tag from the <td>
        const hrefValue = $(element).find("td a").attr("href");
        if (hrefValue) {
          // Format hrefValue by removing '/wiki/' and replacing '_' with ' '
          const formattedHrefValue = hrefValue
            .replace("/wiki/", "")
            .replace(/_/g, " ");
          console.log("hrefValue:", formattedHrefValue);
          values.push(formattedHrefValue.trim());
        }
      } else {
        // If no hrefValue, fallback to direct text from the <td>
        const value = $(element).find("td").text().trim();
        if (value) values.push(value);
      }
    }

    // Join the values with a comma and a space
    const value = values.join("؛");

    if (key && value) {
      parsedData.infobox[key] = value.replace(/\[\w+\]/g, "");
    }
  });

  parsedData.infobox["summary"] = parsedData.summary;

  // log the parsed data
  // console.log(parsedData);

  return parsedData;
}

function createModifiers(nodeMap) {
  let modifiers = {};

  // Iterate over each node in the map
  nodeMap.forEach((parsedData, nodeNumber) => {
    // Extract keys and values from the infobox of the parsedData
    const infoboxKeys = Object.keys(parsedData.infobox);
    const infoboxValues = Object.values(parsedData.infobox);

    // Create an object with keys and values
    let nodeModifiers = {};
    infoboxKeys.forEach((key, index) => {
      nodeModifiers[key] = infoboxValues[index];
    });

    // Add the node modifiers to the main modifiers object
    modifiers[`Node${nodeNumber}`] = nodeModifiers;
  });

  return modifiers;
}

function createGraph(fullNodeMap) {
  let nodes = [];
  // default link for a picture
  url = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  // Iterate over each node in the map
  fullNodeMap.forEach((data, nodeNumber) => {
    // Create a node for each entry in the map
    nodes.push({
      id: nodeNumber,
      label: data.title,
      shape: "image",
      brokenImage: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      image: data.imageUrl || "", // Use the imageUrl from the data
      value: 1, // Assign a value (you can modify this as needed)
      shapeProperties: {
        interpolation: true,
        useBorderWithImage: true,
        useImageSize: false,
      },
      title: `Node ${nodeNumber}`, // Use the summary as the title for the node
    });
  });

  let edges = [];
  for (let i = 1; i < fullNodeMap.size; i++) {
    edges.push({ from: i, to: 0 }); // Connect each node to the first node
  }

  // Return the static graph structure
  return { nodes, edges };
}

async function handleNodes(keysOfInterest, parsedData, fullNodeMap) {
  for (const key of keysOfInterest) {
    if (parsedData.infobox[key]) {
      const values = parsedData.infobox[key].split("؛");
      for (const value of values) {
        const searchResult = await getPage(value.trim());
        fullNodeMap.set(fullNodeMap.size, searchResult);
      }
    }
  }
}

//----------------------------------------------- END OF HELPERS -------------------------------------------------------

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port `);
});
