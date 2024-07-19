import React, { Profiler } from "react";
import ReactDOM from "react-dom/client";
import App from "./app/app.jsx";
import "./index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
	/*   <React.StrictMode>
  //   <App />
  // </React.StrictMode>, */
	<Profiler>
		<App />
	</Profiler>,
);
