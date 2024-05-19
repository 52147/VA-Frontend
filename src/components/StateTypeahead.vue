<template>
  <div class="typeahead-container">
    <input
      v-model="search"
      @input="fetchStates"
      placeholder="Search states..."
      class="search-input"
    />
    <ul v-if="states.length > 0" class="suggestions-list">
      <li
        v-for="state in states"
        :key="state.code"
        @click="selectState(state)"
        class="suggestion-item"
      >
        <span class="highlight">{{ state.name.substr(0, search.length) }}</span
        >{{ state.name.substr(search.length) }}
      </li>
    </ul>
    <div v-if="selectedState" id="map"></div>
  </div>
</template>

<script>
// Declare google as a global variable to avoid ESLint warnings
/* global google */

import { ref, onMounted, nextTick } from "vue";

export default {
  name: "StateTypeahead",
  setup() {
    const search = ref("");
    const states = ref([]);
    const selectedState = ref(null);
    const map = ref(null);
    const marker = ref(null);

    const stateCoordinates = {
      AL: { lat: 32.806671, lng: -86.79113 },
      AK: { lat: 61.370716, lng: -152.404419 },
      AZ: { lat: 34.048927, lng: -111.093735 },
      AR: { lat: 34.746613, lng: -92.288986 },
      CA: { lat: 36.778259, lng: -119.417931 },
      CO: { lat: 39.550051, lng: -105.782066 },
      CT: { lat: 41.603221, lng: -73.087749 },
      DE: { lat: 38.910832, lng: -75.52767 },
      FL: { lat: 27.994402, lng: -81.760254 },
      GA: { lat: 32.165623, lng: -82.900078 },
      HI: { lat: 19.896767, lng: -155.582779 },
      ID: { lat: 44.068203, lng: -114.742043 },
      IL: { lat: 40.633125, lng: -89.398529 },
      IN: { lat: 40.551217, lng: -85.602364 },
      IA: { lat: 41.878003, lng: -93.097702 },
      KS: { lat: 39.011902, lng: -98.484246 },
      KY: { lat: 37.839333, lng: -84.27002 },
      LA: { lat: 30.9843, lng: -91.96233 },
      ME: { lat: 45.253783, lng: -69.445469 },
      MD: { lat: 39.045755, lng: -76.641271 },
      MA: { lat: 42.407211, lng: -71.382437 },
      MI: { lat: 44.314844, lng: -85.602364 },
      MN: { lat: 46.729553, lng: -94.6859 },
      MS: { lat: 32.354668, lng: -89.398529 },
      MO: { lat: 37.964253, lng: -91.831833 },
      MT: { lat: 46.879682, lng: -110.362566 },
      NE: { lat: 41.492537, lng: -99.901813 },
      NV: { lat: 38.80261, lng: -116.419389 },
      NH: { lat: 43.193852, lng: -71.572395 },
      NJ: { lat: 40.058324, lng: -74.405661 },
      NM: { lat: 34.51994, lng: -105.87009 },
      NY: { lat: 40.712776, lng: -74.005974 },
      NC: { lat: 35.759573, lng: -79.0193 },
      ND: { lat: 47.551493, lng: -101.002012 },
      OH: { lat: 40.417287, lng: -82.907123 },
      OK: { lat: 35.007752, lng: -97.092877 },
      OR: { lat: 43.804133, lng: -120.554201 },
      PA: { lat: 41.203322, lng: -77.194525 },
      RI: { lat: 41.580095, lng: -71.477429 },
      SC: { lat: 33.836081, lng: -81.163725 },
      SD: { lat: 43.969515, lng: -99.901813 },
      TN: { lat: 35.517491, lng: -86.580447 },
      TX: { lat: 31.968599, lng: -99.901813 },
      UT: { lat: 39.32098, lng: -111.093731 },
      VT: { lat: 44.558803, lng: -72.577841 },
      VA: { lat: 37.431573, lng: -78.656894 },
      WA: { lat: 47.751074, lng: -120.740139 },
      WV: { lat: 38.597626, lng: -80.454903 },
      WI: { lat: 43.78444, lng: -88.787868 },
      WY: { lat: 43.075968, lng: -107.290283 },
      PR: { lat: 18.220833, lng: -66.590149 },
      GU: { lat: 13.444304, lng: 144.793731 },
      AS: { lat: -14.271, lng: -170.132 },
      VI: { lat: 18.335765, lng: -64.896335 },
      MP: { lat: 15.0979, lng: 145.6739 },
    };

    onMounted(() => {
      // Initialize the map when the component is mounted
      nextTick(() => {
        map.value = new google.maps.Map(document.getElementById("map"), {
          center: { lat: 39.8283, lng: -98.5795 }, // Default center (USA)
          zoom: 4,
        });
      });
    });

    const fetchStates = async () => {
      if (search.value.trim()) {
        console.log("Fetching states with search:", search.value);
        try {
          const response = await fetch("http://localhost:8082/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `
                query States($search: String!) {
                  states(search: $search) {
                    name
                    code
                    frequency
                  }
                }
              `,
              variables: {
                search: search.value,
              },
            }),
          });
          const data = await response.json();
          console.log("API response:", data);
          if (data?.data?.states) {
            states.value = data.data.states;
            console.log("Updated states:", states.value);
          } else {
            states.value = [];
            console.log("No states found");
          }
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      } else {
        states.value = [];
        console.log("Search input is empty, cleared states");
      }
    };

    const selectState = (state) => {
      console.log("Selected state:", state);
      search.value = state.name;
      states.value = [];
      selectedState.value = state;
      if (map.value && stateCoordinates[state.code]) {
        const coords = stateCoordinates[state.code];
        map.value.setCenter(coords);
        map.value.setZoom(6); // Adjust zoom level as needed
        if (marker.value) {
          marker.value.setPosition(coords);
        } else {
          marker.value = new google.maps.Marker({
            position: coords,
            map: map.value,
          });
        }
      }
    };

    return { search, states, fetchStates, selectState, selectedState };
  },
};
</script>

<style>
.typeahead-container {
  width: 300px;
  margin: 0 auto;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  box-sizing: border-box;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  background-color: white;
  z-index: 1000;
}

.suggestion-item {
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}

.highlight {
  font-weight: bold;
}

#map {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}
</style>