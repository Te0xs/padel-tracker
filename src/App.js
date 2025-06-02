import React from "react";
import PadelTracker from "./PadelTracker";

function App() {
  return (
    <div style={{ 
      width: "100%", 
      maxWidth: "100vw", 
      padding: 16, 
      boxSizing: "border-box",
      overflowX: "auto"
    }}>
      <PadelTracker />
    </div>
  );
}

export default App;
