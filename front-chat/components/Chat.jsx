"use client";
import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("http://localhost:4000");

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      body: message,
      from: "Yo",
    };
    setChatMessages([...chatMessages, newMessage]);
    socket.emit("message", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on("message", receiveMessages);

    return () => {
      socket.off("message", receiveMessages);
    };
  }, []);

  const receiveMessages = (message) => setChatMessages((state) => [...state, message]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-center text-blue-500 mb-4">Chat en Tiempo Real</h2>
        
        <div className="overflow-y-auto max-h-80 mb-4 px-4 py-2 space-y-3">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col space-y-1 ${
                msg.from === "Yo" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center">
                <span className={`font-bold text-sm ${msg.from === "Yo" ? "text-blue-500" : "text-gray-700"}`}>
                  {msg.from}
                </span>
                <span className="ml-2 text-sm text-gray-500">{msg.body}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-row items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe tu mensaje..."
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};
