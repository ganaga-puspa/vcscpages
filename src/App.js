import React from "react";
import AppContainer from "./components/AppContainer";
import "./App.css";
import { Login, Dashboard } from "./components/";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContainer />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
