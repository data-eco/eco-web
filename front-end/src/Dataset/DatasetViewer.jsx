import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import axios from "axios";
//import PropTypes from 'prop-types';
import DataDAG from "./DataDAG"
import { VegaLite } from 'react-vega'
import SummaryPane from "./SummaryPane"
import { useParams } from 'react-router-dom'

const DatasetViewer = (props) => {
  const [pkg, setPkg] = useState()
  const [datasetId, setDatasetId] = useState("")
  const [viewData, setViewData] = useState()
  const [viewSpec, setViewSpec] = useState()
  const [graphData, setGraphData] = useState({ "nodes": [], "links": [] })
  const [focus, setFocus] = useState()

  const { uuid } = useParams();

  // retrieve datapackage
  useEffect(() => {
    if (uuid === "") {
      return
    }

    axios.get(`http://api.localhost/dataset/${uuid}`, {}).then(resp => {
      setPkg(resp.data)
      setDatasetId(resp.data.eco.metadata.data.dataset.id)
    }).catch(function (error) {
      console.log("Request failed!")
      console.log(error);
    });
  }, [uuid])

  // load default view, if present..
  useEffect(() => {
    if (pkg === undefined) {
      return
    }

    // if no views found, stop here
    let num_views = Object.keys(pkg.eco.nodes[uuid].views).length;

    if (num_views === 0) {
      console.log("No views found!")
      return
    }

    // load view
    axios.get(`http://api.localhost/dataset/${uuid}/views/sample-pca`, {}).then(resp => {
      setViewData({"table": resp.data})
    }).catch(function (error) {
      console.log("Request failed!")
      console.log(error);
    });
  }, [pkg, uuid])

  // update view spec, once view data has been retrieved
  useEffect(() => {
    if (viewData === undefined) {
      return
    }

    // retrieve first view;
    // note: for now, assuming view is a sample pca plot
    let spec = pkg.eco.nodes[uuid].views[0];

    spec.data = {"name": "table"};
    spec.width = 640;
    spec.height = 640;

    // temp work-around (moved to view in pipeline..)
    spec.encoding.x.scale = {"padding": 5};
    spec.encoding.y.scale = {"padding": 5};

    setViewSpec(spec)

  }, [viewData, pkg, uuid])

  // set graph data for datadag
  useEffect(() => {
    if (pkg === undefined || Object.keys(graphData.nodes).length !== 0) {
      return
    }

    // convert dag to format expected by react-force-graph
    const dat = {
      "nodes": [],
      "links": []
    }

    Object.keys(pkg.eco.nodes).forEach(nodeId => {

      let node = pkg.eco.nodes[nodeId];

      // temp work-around: check for both "name" and "processing" fields of node-level
      // metadata
      let node_name;

      if ("processing" in node.metadata) {
        node_name = node['metadata']['processing'];
      } else if ("name" in node.metadata) {
        node_name = node['metadata']['name'];
      }

      dat.nodes.push({
        "id": nodeId,
        "name": node_name,
        "desc": node['description']
      })
    })
    dat.links = pkg.eco.edges;

    setFocus(dat.nodes[dat.nodes.length - 1].id)
    setGraphData(dat)
  }, [graphData, pkg])

  function renderView() {
    if (viewSpec === undefined || viewData === undefined) {
      return(<div />)
    } else {
      return(<VegaLite spec={viewSpec} data={viewData} />)
    }
  }

  return(
      <div className="App">
        <Container fluid>
          <Row id='header-row'>
            <Col>
              <h3>Dataset: {datasetId}</h3>
            </Col>
          </Row>
          <Row>
            <Col xs={3} id='summary-col'>
              <SummaryPane pkg={pkg} />
            </Col>
            <Col>
              {renderView()}
            </Col>
            <Col xs={3}>
              <DataDAG graphData={graphData} focus={focus} />
            </Col>
          </Row>
        </Container>
      </div>
  )
}

DatasetViewer.propTypes = {
}

export default DatasetViewer;
