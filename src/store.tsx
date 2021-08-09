import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

export enum Status {
  active,
  busy,
  offline,
}

export interface ChatListItem {
  name: string;
  image_id: Number;
  status?: Status;
  chats: Chat[];
}

export interface Chat {
  read: boolean;
  content: string;
  own?: boolean;
  date: string;
}

type ActionType =
  | { type: "add"; text: string; id: number }
  | { type: "open"; id: number }
  | { type: "init"; data: ChatListItem[] };

function setData(data: ChatListItem[]): ChatListItem[] {
  data.map((d) => {
    let chats = d.chats.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return {
      ...d,
      chats,
    };
  });
  window.localStorage.setItem("tb_chats", JSON.stringify(data));
  return data;
}

const ChatContext = createContext<
  { state: ChatListItem[]; dispatch: React.Dispatch<ActionType> } | undefined
>(undefined);

const chatReducer = (state: ChatListItem[], action: ActionType) => {
  switch (action.type) {
    case "add":
      return setData(
        state.map((c, index) =>
          index === action.id
            ? {
                ...c,
                chats: [
                  ...c.chats,
                  {
                    read: true,
                    content: action.text,
                    own: true,
                    date: new Date().toUTCString(),
                  },
                ],
              }
            : c
        )
      );
    case "open":
      return state.map((c, index) =>
        index === action.id
          ? { ...c, chats: c.chats.map((ci) => ({ ...ci, read: true })) }
          : c
      );
    case "init":
      return setData(action.data);
  }
};

export function ChatsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, []);

  useEffect(() => {
    //check if local storage has data
    let chatList = window.localStorage.getItem("tb_chats");
    if (chatList) {
      dispatch({ type: "init", data: JSON.parse(chatList) });
      return;
    }

    fetch("./starter.json")
      .then((resp) => resp.json())
      .then((data: ChatListItem[]) => {
        dispatch({ type: "init", data });
      });
  }, []);
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const ctx = useContext(ChatContext);

  if (!ctx) {
    throw new Error("ChatsProvider is required");
  }

  return ctx;
}

export default ChatContext;
