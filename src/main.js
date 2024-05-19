import { createApp } from "vue";
import App from "./App.vue";
import VueApollo from "vue-apollo";
import ApolloClient from "apollo-boost";
import VueNativeSock from "vue-native-websocket-vue3";

const apolloClient = new ApolloClient({
  uri: "http://localhost:8082/graphql",
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

const app = createApp(App);

app.use(apolloProvider);

app.use(VueNativeSock, "ws://localhost:8083", {
  format: "json",
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

app.mount("#app");
