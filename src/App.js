import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (!input.trim()) return; // Prevent empty messages
    
        const userMessage = { sender: "user", text: input };
        setMessages(prevMessages => [...prevMessages, userMessage]); // Keep previous messages
    
        setInput(""); // Clear input immediately
    
        try {
            const response = await axios.post("http://localhost:5000/chat", { message: input });
            const botMessage = { sender: "bot", text: response.data.reply };
            setMessages(prevMessages => [...prevMessages, userMessage, botMessage]);
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
        }
    };
    


    return (
        <div className="container">
            <header className="header">
                <h1 className="title">AIDA</h1>
                <h2 className="subtitle">Autonomous VC Fund Agent</h2>
                <p className="description">
                    AIDA is an AI-powered autonomous decision-making agent designed for venture capital investment.
                </p>
                <button className="button" onClick={() => alert("Coming Soon!")}>
                    Learn More
                </button>

                <div className="chat-container">
                    <h3>Ask AIDA Anything</h3>
                    <div className="chat-box">
                        {messages.map((msg, i) => (
                            <p key={i} className={msg.sender}>
                                {msg.text}
                            </p>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // Prevents new line in input
                                sendMessage();
                            }
                        }}
                        placeholder="Ask something..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </header>
        </div>
    );
}

export default App;
