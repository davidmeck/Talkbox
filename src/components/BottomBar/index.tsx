import { Link } from "react-router-dom";
import Icon from "../Icon";
import "./style.scss";
const BottomBar = () => {
  return (
    <div className="bottom-bar">
      <div className="container">
        <ul>
          <li>
            <Link to="/">
              <Icon>phone</Icon>
            </Link>
          </li>
          <li>
            <Link to="/" className="active">
              <Icon>home</Icon>
            </Link>
          </li>
          <li>
            <Link to="/">
              <Icon>notifications</Icon>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BottomBar;
