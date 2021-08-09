import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChatsProvider } from "./store";

ReactDOM.render(
  <ChatsProvider>
    <App />
  </ChatsProvider>,
  document.getElementById("root")
);

reportWebVitals();
