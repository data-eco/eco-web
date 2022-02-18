//
// Eco web UI
//
import React from 'react';
import DataBrowser from "./DataBrowser"
import DatasetViewer from "./Dataset/DatasetViewer"
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './index.css';
import './static/main.css';
import './App.css';
import './static/bootstrap.min.css'

const rootElement = document.getElementById('root');

render(
  <div>
    <Navbar expand="sm">
        <Navbar.Brand href="/">🧬 Eco Datasets</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
            <Nav.Link href="/">Home</Nav.Link>
        </Navbar.Collapse>
    </Navbar>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DataBrowser />} />
        <Route path="/dataset/:uuid" element={<DatasetViewer />} />
      </Routes>
    </BrowserRouter>
  </div>,
  rootElement
)
