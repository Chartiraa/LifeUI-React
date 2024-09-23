import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";

// core styles
import "./scss/volt.scss";

// vendor styles
import "react-datetime/css/react-datetime.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'primeicons/primeicons.css';
import 'sweetalert2/src/sweetalert2.scss'

import HomePage from "./pages/HomePage";

ReactDOM.render(
  <HashRouter>
    <HomePage />
  </HashRouter>,
  document.getElementById("root")
);
