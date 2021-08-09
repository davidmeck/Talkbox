import { useMemo } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.scss";
import ChatPage from "./ChatsPage";
import { Header, BottomBar } from "./components";
import ChatList from "./components/Chats";
import { TransitionGroup, CSSTransition } from "react-transition-group";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="*">
          <AppWrapper />
        </Route>
      </Router>
    </div>
  );
}

const AppWrapper = () => {
  const location = useLocation();

  const direction = useMemo(
    () => (location.pathname === "/" ? "left" : "right"),
    [location]
  );
  return (
    <TransitionGroup>
      <CSSTransition timeout={100} classNames="slide" key={location.key}>
        <div className={`app-wrapper ${direction}`}>
          <Switch location={location}>
            <Route path="/chat/:id" exact>
              <Header />
              <ChatPage />
            </Route>
            <Route path="/" exact>
              <Header />
              <ChatList />
            </Route>
            <Route path="/">
              <div className="container">Chat history not found...</div>
            </Route>
          </Switch>
          {location.pathname === "/" && <BottomBar />}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;
