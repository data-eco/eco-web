import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const SummaryPane = (props) => {
  const [citations, setCitations] = useState()

  useEffect(() => {
    if (props.pkg === undefined) {
      return
    }

    // get metadata associated with root node in dag
    //const rootId = Object.keys(props.pkg.eco.nodes)[0]
    //const rootNode = props.pkg.eco.nodes[rootId]

    // generate citations block
    let citetationList = [];

    props.pkg.eco.metadata.provenance.citations.forEach((x, ind) => {
      let url = "https://doi.org/" + x;
      citetationList.push(<li key={"citation-" + ind}><a href={url}>{x}</a></li>);
    })

    setCitations(citetationList)
  }, [props.pkg])
  
  if (props.pkg === undefined) {
    return(<div />)
  } else {
    return (
      <div id="dataset-summary">
        <h3>{props.pkg.eco.metadata.data.dataset.id}</h3>
        <span>{props.pkg.eco.metadata.data.dataset.title}</span><br /><br />

        <ul style={{listStyleType: "none", paddingLeft: "0.1rem"}}>
          <li><strong>Source:</strong> <a href="{props.pkg.eco.metadata.data.source.url}">{props.pkg.eco.metadata.data.source.title}</a></li>
          <li><strong>Processing:</strong> {props.pkg.eco.metadata.data.processing}</li>
          <li><strong>Version:</strong> {props.pkg.eco.metadata.data.version}</li>
          <li><strong>Rows:</strong> <i>N</i></li>
          <li><strong>Columns:</strong> {props.pkg.resources[0].schema.fields.length}</li>
          <li>(Other summary stats, download links...)</li>
        </ul>

        <span>Description:</span><br />
        <div style={{fontSize: "0.8em"}}>
          {props.pkg.eco.metadata.provenance.description}
        </div>

        <hr />

        <i>Citations:</i>
        <ol>
          {citations}
        </ol>
      </div>
    )
  }
}

SummaryPane.propTypes = {
  pkg: PropTypes.object
}

export default SummaryPane;
