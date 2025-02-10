import React, { useState } from "react";
import axios from "axios";
// import "./Chatbot.css"; // Optional for styling

const Chatbot = () => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [chat, setChat] = useState([]);

    const sendMessage = async () => {
        if (!message.trim() && !file) return;

        const formData = new FormData();
        formData.append("message", message);
        if (file) formData.append("file", file);

        const newChat = [...chat, { sender: "user", text: message, file }];
        setChat(newChat);
        setMessage(""); // Clear input field after sending
        setFile(null);

        try {
            const response = await axios.post("http://localhost:5000/chat", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setChat([...newChat, { sender: "bot", text: response.data.reply }]);
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
        }
    };

    // 🔥 FIX: Handle "Enter" keypress inside input
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent new line
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <h3>Ask AIDA Anything</h3>
            <div className="chat-box">
                {chat.map((msg, i) => (
                    <p key={i} className={msg.sender}>{msg.text}</p>
                ))}
            </div>
            <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={handleKeyDown} // 🔥 FIX: Call sendMessage on Enter press
                placeholder="Ask something..."
            />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chatbot;
