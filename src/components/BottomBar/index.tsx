import Icon from "../Icon";
import "./style.scss";
const BottomBar = () => {
  return (
    <div className="bottom-bar">
      <div className="container">
        <ul>
          <li>
            <a href="/">
              <Icon>phone</Icon>
            </a>
          </li>
          <li>
            <a href="/" className="active">
              <Icon>home</Icon>
            </a>
          </li>
          <li>
            <a href="/">
              <Icon>notifications</Icon>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BottomBar;
