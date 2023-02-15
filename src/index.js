import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; 
import { NotificationContainer } from 'react-notifications'
import 'react-notifications/lib/notifications.css';
import "remixicon/fonts/remixicon.css";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') disableReactDevTools();


const root = ReactDOM.createRoot(document.getElementById("root"));
const nodeRef = React.createRef(null);
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
      <NotificationContainer nodeRef={nodeRef} />
    </BrowserRouter>  
  </React.StrictMode>
);
