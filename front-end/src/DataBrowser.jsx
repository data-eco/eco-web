import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";

const DataBrowser = (props) => {
  const [datasets, setDatasets] = useState({});
  const [datasetLinks, setDatasetLinks] = useState(<div />);

  // retrieve list of known datasets
  useEffect(() => {
    if (Object.keys(datasets).length > 0) {
      return
    }

    axios.get(`http://api.localhost/datasets`, {}).then(resp => {
      setDatasets(resp.data)
    }).catch(function (error) {
      console.log("Request failed!")
      console.log(error);
    });
  }, [datasets])

  // render dataset list
  useEffect(() => {
    if (Object.keys(datasets).length === 0) {
      return
    }

    let links = [];

    for (const [uuid, pkg] of Object.entries(datasets)) {
      let node = Object.values(pkg["eco"]["nodes"]).slice(-1)[0];

      let title = pkg["eco"]["metadata"]["data"]["dataset"]["title"];

      let level = node['metadata']['processing']

      if (level !== undefined) {
        title = `${title} (${level})`
      }

      links.push(<li key={uuid}><Link to={"dataset/" + uuid}>{title}</Link></li>)
    }

    setDatasetLinks(links)
  }, [datasets])

  return(
    <div className="App">
      <Container fluid>
        <Row>
          <h2>Datasets:</h2>
        </Row>
        <Row>
          <ol style={{"textAlign": "left", "marginLeft": "15px"}}>
            {datasetLinks}
          </ol>
        </Row>
      </Container>
    </div>
  )
}

DataBrowser.propTypes = {
}

export default DataBrowser;
