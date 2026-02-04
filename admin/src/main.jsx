import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./app/store"
import "./index.css";
import AppWrapper from "./AppWrapper";
import { ToastProvider } from "./components/common/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <AppWrapper />
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
