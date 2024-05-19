# State Suggestion Project

## Overview

This project demonstrates a typeahead suggestion system with a map feature. When a user types in a search input, the system provides suggestions based on the input and displays the selected state on a map.

## Prerequisites

- Node.js (v12.x or later)
- npm (v6.x or later)
- Go (v1.16 or later)
- MongoDB (v4.x or later)
- A Google Maps API key

## Project Structure

```
state-suggestion-project/
│
├── backend/
│   ├── main.go
│   └── go.mod
│
├── fronted/
│   ├── src/
│   │   ├── components/
│   │   │   └── StateTypeahead.vue
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── vue.config.js
└── README.md
```

---

# Backend

## Overview

This backend service provides a GraphQL API to fetch state suggestions based on a search prefix. The backend uses a trie data structure for efficient prefix-based search and MongoDB to store state data with search frequencies.

## Prerequisites

- Go (v1.16 or later)
- MongoDB (v4.x or later)

## Setup

### 1. Install Go dependencies

Run:

```sh
go mod tidy
```

### 2. Start MongoDB

Ensure MongoDB is running. You can use Docker to start a MongoDB container:

```sh
docker run --name mongo -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example mongo:latest
```

### 3. Insert initial data into MongoDB

Insert initial data into MongoDB:




```sh
node populateStates.js
```

### 4. Start the backend server

```sh
go run main.go
```

The backend server will run on port 8082.

## API Usage

The backend exposes a GraphQL API at `/graphql`. You can use the following query to fetch state suggestions:

```graphql
query States($search: String!) {
  states(search: $search) {
    name
    code
    frequency
  }
}
```
## Typeahead Suggestion Algorithm

Searching for all states in the Trie that match a given prefix and returning them sorted by their frequency:

Process:
1. Traverse the Trie to Match the Prefix
2. Collect All States Starting from the End of the Prefix
3. Sort the Collected States by Frequency
4. Update the Frequency of Each Matched State
5. Return the Sorted List of States
---

# Frontend

## Overview

The frontend is a Vue.js application that provides a typeahead search bar for state suggestions. When a state is selected, its location is displayed on a Google Map.

## Prerequisites

- Node.js (v12.x or later)
- npm (v6.x or later)

## Setup

### 1. Install Node.js dependencies

Run:

```sh
npm install
```

### 2. Configure Google Maps API key

Replace `YOUR_GOOGLE_MAPS_API_KEY` in `public/index.html` with your actual Google Maps API key:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Typeahead with Map</title>
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places"></script>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

### 3. Start the frontend server

```sh
npm run serve
```

The frontend server will run on port 8083.

## Usage

1. Open your browser and navigate to `http://localhost:8083`.
2. Type in the search input to see typeahead suggestions.
3. Select a state from the suggestions to display its location on the map.
