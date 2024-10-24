import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from "react-redux";
import store from "./src/redux/store";

import Rotas from "./src/navigation/Rotas";

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar backgroundColor="#7EA5D9" barStyle="light-content" />
        <Rotas />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
