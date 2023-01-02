/* eslint no-undef: "off"*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/components/checkbox.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "prismjs/prism.js";
import "prismjs/themes/prism.css";
import "./css/bootstrap-extend.min.css";
import "./vendor/animsition/animsition.css"
import "./vendor/asscrollable/asScrollable.css"
import "./vendor/switchery/switchery.css"
import "./vendor/intro-js/introjs.css"
import "./vendor/slidepanel/slidePanel.css"
import "./vendor/jquery-mmenu/jquery-mmenu.css"
import "./vendor/flag-icon-css/flag-icon.css"
import "./vendor/waves/waves.css"
import "./css/site.min.css";
import "./css/v1.css";

require("jquery.mmenu/dist/js/jquery.mmenu.all.min");

import "./vendor/babel-external-helpers/babel-external-helpers.js"
import "./vendor/popper-js/umd/popper.min.js"
import "./vendor/animsition/animsition.js"
import "./vendor/mousewheel/jquery.mousewheel.js"
import "./vendor/asscrollbar/jquery-asScrollbar.js"
import "./vendor/asscrollable/jquery-asScrollable.js"
import "./vendor/waves/waves.js"
import "./vendor/switchery/switchery.js"
import "./vendor/intro-js/intro.js"
import "./vendor/screenfull/screenfull.js"

// import "./vendor/slidepanel/jquery-slidePanel.js"


// Fonts
import "./fonts/material-design/material-design.min.css"
import "./fonts/brand-icons/brand-icons.min.css"

import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root"),
);
registerServiceWorker();

