import { io } from "socket.io-client";

const socket = io("https://sno-relax-server.onrender.com");

useEffect(() => {
  if (group) {
    socket.emit("joinGroup", group.id);

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leaveGroup", group.id);
      socket.off("newMessage");
    };
  }
}, [group]);

async function handleSend(e) {
  e.preventDefault();
  if (!text.trim()) return;

  const message = {
    id: crypto.randomUUID(),
    groupId: group.id,
    userId,
    text,
    date: new Date().toISOString(),
  };

  setMessages((prev) => [...prev, message]);
  socket.emit("sendMessage", { groupId: group.id, message });
  setText("");
}
