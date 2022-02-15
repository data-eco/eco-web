import React, { useEffect, useState } from 'react';
import DatasetViewer from "./Dataset/DatasetViewer"
import './App.css';
//import { Col, Container, Navbar, Nav, Row } from 'react-bootstrap';

// ex. http://localhost/dataset/bb9424e4-35fa-40fc-ae7f-f2677280e7f8

function App() {
  const [uuid, setUUID] = useState("")

  // testing..
  useEffect(() => {
    if (uuid === "") {
      setUUID("bb9424e4-35fa-40fc-ae7f-f2677280e7f8")
    }
  }, [uuid])

  return (
  );

export default App;
