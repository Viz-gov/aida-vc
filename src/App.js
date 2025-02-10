import React from "react";
import Chatbot from "./Chatbot";
import "./App.css";

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">AIDA</h1>
        <h2 className="subtitle">AI-based Decision Automation</h2>
        <p className="description">
          AIDA is an AI-powered platform that makes informed investment decisions in AI and crypto/Web3 projects.
        </p>
        <button className="button" onClick={() => alert("Coming Soon!")}>
          Learn More
        </button>
        <Chatbot />
      </header>
    </div>
  );
}

export default App;
