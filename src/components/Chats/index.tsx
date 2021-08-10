import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import ChatContext, { ChatListItem } from "../../store";
import { getTimeAgo } from "../../utils";
import "./style.scss";
const Chat = ({ index, chats }: { index: number; chats: ChatListItem }) => {
  const unread = chats ? chats.chats.filter((c) => !c.read).length : 0;

  return (
    <li>
      <Link to={`/chat/${index + 1}`}>
        <span className="profile">
          <img
            src={`https://i.pravatar.cc/100?img=${chats.image_id}`}
            alt={chats.name}
          />
          {chats && chats?.status && (
            <span className={`status ${chats.status}`}></span>
          )}
        </span>
        <span className="content">
          <span className="name">{chats.name}</span>
          {!!chats.chats.length && (
            <span className="message">{chats.chats[0].content}</span>
          )}
        </span>
        {!!chats.chats.length && (
          <span className="meta">
            <span className="time">{getTimeAgo(chats.chats[0].date)}</span>
            {unread > 0 && <span className="unread-count">{unread}</span>}
          </span>
        )}
      </Link>
    </li>
  );
};

const ChatList = () => {
  const { state } = useContext(ChatContext)!;

  const chats = useMemo(
    () =>
      state.sort((a, b) =>
        a.chats.length && b.chats.length
          ? new Date(b.chats[0].date).getTime() -
            new Date(a.chats[0].date).getTime()
          : a.chats.length
          ? -1
          : 1
      ),
    [state]
  );

  return (
    <div className="main-content">
      <div className="container">
        <ul className="chat-list">
          {chats &&
            chats.map((chat: ChatListItem, index: number) => (
              <Chat key={index} index={index} chats={chat} />
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
