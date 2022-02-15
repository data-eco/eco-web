import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import PropTypes from 'prop-types';

const DataDAG = (props) => {

  return(
    <ForceGraph2D
      graphData={props.graphData}
      dagMode='td'
      dagLevelDistance={50}
      backgroundColor="#ffffff"
      linkDirectionalArrowLength={4}
      linkDirectionalArrowRelPos={1}
      nodeRelSize={4}
      nodeLabel="name"
      nodeColor={node => node.id === props.focus ? "#ba3083" : "#3183ba"}
      width={380}
      height={480}
    />
  )
}

DataDAG.propTypes = {
  focus: PropTypes.string,
  graphData: PropTypes.object
}

export default DataDAG;
