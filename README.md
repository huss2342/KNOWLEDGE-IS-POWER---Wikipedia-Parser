# KNOWLEDGE IS POWER - Wikipedia Parser

## Project Overview

KNOWLEDGE IS POWER is an interactive Wikipedia parsing tool that visualizes information about people or companies in a node graph format. It allows users to explore and filter information dynamically, providing an engaging way to discover and interact with Wikipedia content.

## Features

- **Wikipedia Parsing**: Parse Wikipedia articles for information about people or companies
- **Interactive Node Graph**: Visualize parsed information in an interactive node graph using vis-network library
- **User Authentication**: Register, login, and logout functionality
- **Information Filtering**: Users can filter out information based on checkbox selections
- **Search History and Bookmarks**: Users can view, edit, and delete their search history and bookmarks
- **Recommended Topics**: Generate recommended topics based on user's search history
- **Popular Searches**: Display popular searches based on all users' activity

## Tech Stack

- **Frontend**: React
- **Backend**: Express.js (Node.js framework)
- **Database**: MongoDB
- **Visualization**: vis-network library

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up your MongoDB database and update the connection string in `server/.env`
4. Start the server:
   ```
   cd server && npm start
   ```
5. Start the client:
   ```
   cd client && npm start
   ```

## Usage

1. Register for an account or login
2. Enter a search term (person or company) in the search bar
3. Explore the generated node graph
4. Use checkboxes to filter information
5. Click on nodes to view more details
6. Save searches as bookmarks or view your search history

## API Endpoints

- `/register`: User registration
- `/login`: User login
- `/search`: Wikipedia parsing and graph generation
- `/bookmark/add`: Add a bookmark
- `/bookmark/getList`: Get user's bookmarks
- `/bookmark/delete`: Delete a bookmark
- `/history/add`: Add to search history
- `/history/getList`: Get user's search history
- `/history/delete`: Delete from search history
- `/popularSearches/add`: Add to popular searches
- `/popularSearches/recommended`: Get recommended searches
- `/popularSearches/getTopThree`: Get top 3 popular searches
