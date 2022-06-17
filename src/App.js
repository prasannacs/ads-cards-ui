import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import NaviBar from "./components/navibar";
import { Routes, Route, NavLink, BrowserRouter } from "react-router-dom";
import MediaLibrary from "./components/medialibrary";
import TweetComposer from "./components/tweetcomposer";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">

      <BrowserRouter>
          <div>
            <NaviBar />
          </div>
          <div className="content">
            <Routes>
              <Route path="/media" element={<MediaLibrary />} />
              <Route path="/composer" element={<TweetComposer />} />
              <Route exact path="/" element={<MediaLibrary />} />
            </Routes>
          </div>
        </BrowserRouter>
    </div>
  );
}

export default App;
