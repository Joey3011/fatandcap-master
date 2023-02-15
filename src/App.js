import React from 'react'
import Layout from "./components/Layout/Layout";
import { store } from './app/store';
import { Provider } from 'react-redux';
import "./App.css";

function App() {
  return (
   <Provider store={store}>
      <Layout />
  </Provider>
  )
}

export default App;
