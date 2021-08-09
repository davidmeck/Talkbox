import { useMemo } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Icon } from "..";
import logo from "../../assets/images/talkbox-logo.png";
import { useChats } from "../../store";
import "./style.scss";
const Header = () => {
  const location = useLocation();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { state } = useChats();

  const { hasHeader, user } = useMemo(
    () =>
      location.pathname === "/"
        ? {
            hasHeader: true,
            user: null,
          }
        : {
            hasHeader: false,
            user: state.find((_, index) => index === Number(id) - 1),
          },
    [location, id, state]
  );

  return (
    <header>
      <div className="container">
        {hasHeader ? (
          <>
            <img className="logo" src={logo} alt="Talkbox Logo" />
            <div className="profile-meta">
              <Icon>search</Icon>
              <span className="profile">
                <img src="https://i.pravatar.cc/100?img=69" alt="" />
                <span className="status active"></span>
              </span>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => history.goBack()}>
              <Icon>arrow_back</Icon>
            </button>
            <span className="chat-user">{user && user.name}</span>
            <span className="profile">
              <img
                src={`https://i.pravatar.cc/100?img=${user?.image_id}`}
                alt=""
              />
              {user && user?.status && (
                <span className={`status ${user.status}`}></span>
              )}
            </span>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
