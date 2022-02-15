//
// Eco web UI
//
import React from 'react';
import DataBrowser from "./Dataset/DataBrowser"
import DatasetViewer from "./Dataset/DatasetViewer"
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import './index.css';
import './static/main.css';
import './App.css';

const rootElement = document.getElementById('root');

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DataBrowser />} />
      <Route path="/dataset/:uuid" element={<DatasetViewer />} />
    </Routes>
  </BrowserRouter>,
  rootElement
)
