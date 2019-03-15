import React, { Component } from 'react';
import clone from 'clone'
import { treeData, treeData2, mockFlatArray, debugData, individualShapesData } from './mockData';
// import {Tree, treeUtil} from 'react-d3-tree'
import { Tree, treeUtil } from '../react-d3-tree/lib/react-d3-tree'
import {version} from 'react-d3-tree/package.json'
import Switch from './components/Switch';
import './App.css';
import reactTree from './directory-trees/react-tree'
import scTree from './directory-trees/sc-tree'
import Button from './components/Button';

const nodeStyle = {
  fill: 'green',
}

const shapes = {
  circle: {
    shape: 'circle',
    baseProps: {
      r: 10,
      style: nodeStyle
    },
  },
  ellipse: {
    shape: 'ellipse',
    baseProps: {
      rx: 10,
      ry: 20,
      style: nodeStyle
    },
  },
  rect: {
    shape: 'rect',
    baseProps: {
      width: 140,
      height: 20,
      y: -10,
      x: -10,
      style: nodeStyle
    },
  },
  none: {
    shape: 'none'
  }
};

class App extends Component {
  constructor() {
    super();

    this.addedNodesCount = 0;

    this.state = {
      data: treeData,
      commonNodeElement: {
        shape: 'rect',
        baseProps: {
          r: 10,
          style: nodeStyle
        },
        leafNodeProps: {
          r: 5,
          style: {fill: 'transparent'}
        }
      },
      // pathFunc: (d, orientation) => orientation && `M${d.source.y},${d.source.x}V${d.target.x}H${d.target.y}`,
      orientation: 'horizontal',
      translateX: 200,
      translateY: 300,
      collapsible: true,
      initialDepth: 1,
      depthFactor: undefined,
      zoomable: true,
      zoom: 1,
      scaleExtent: { min: 0.1, max: 1 },
      separation: { siblings: 1, nonSiblings: 2 },
      nodeSize: { x: 140, y: 140 },
      transitionDuration: 500,
      styles: {
        nodes: {
          node: {
            circle: {
              fill: '#52e2c5',
            },
            attributes: {
              stroke: '#000',
            },
          },
          leafNode: {
            circle: {
              fill: 'transparent',
            },
            attributes: {
              stroke: '#000',
            },
          },
        },
      },
    };

    this.setTreeData = this.setTreeData.bind(this);
    this.setLargeTree = this.setLargeTree.bind(this);
    this.setTreeDataFromCSV = this.setTreeDataFromCSV.bind(this);
    this.setTreeDataFromJSON = this.setTreeDataFromJSON.bind(this);
    this.setTreeDataFromFlatJSON = this.setTreeDataFromFlatJSON.bind(this);
    this.setTreeDataFromFlatArray = this.setTreeDataFromFlatArray.bind(this);
    this.setOrientation = this.setOrientation.bind(this);
    this.setPathFunc = this.setPathFunc.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFloatChange = this.handleFloatChange.bind(this);
    this.handleShapeChange = this.handleShapeChange.bind(this);
    this.toggleCollapsible = this.toggleCollapsible.bind(this);
    this.toggleZoomable = this.toggleZoomable.bind(this);
    this.setScaleExtent = this.setScaleExtent.bind(this);
    this.setSeparation = this.setSeparation.bind(this);
    this.setNodeSize = this.setNodeSize.bind(this);
  }

  setTreeData(data) {
    this.setState({ data });
  }

  setLargeTree(data) {
    this.setState({
      data,
      transitionDuration: 0,
    })
  }

  setTreeDataFromCSV(csvFile, attributeFields) {
    treeUtil
      .parseCSV(csvFile, attributeFields)
      .then(data => {
        console.log(data);
        this.setState({ data });
      })
      .catch(err => console.error(err));
  }

  setTreeDataFromJSON(jsonFile) {
    treeUtil
      .parseJSON(jsonFile)
      .then(data => {
        console.log(data);
        this.setState({ data });
      })
      .catch(err => console.error(err));
  }

  setTreeDataFromFlatJSON(jsonFile, attributeFields) {
    treeUtil
      .parseFlatJSON(jsonFile, attributeFields)
      .then(data => {
        console.log(data);
        this.setState({ data });
      })
      .catch(err => console.error(err));
  }

  setTreeDataFromFlatArray(flatArray) {
    const data = treeUtil.generateHierarchy(flatArray);
    console.log(data);
    this.setState({ data });
  }

  setOrientation(orientation) {
    this.setState({ orientation });
  }

  setPathFunc(pathFunc) {
    this.setState({ pathFunc });
  }

  handleChange(evt) {
    const target = evt.target;
    const value = parseInt(target.value, 10);
    if (!isNaN(value)) {
      this.setState({
        [target.name]: value,
      });
    }
  }

  handleFloatChange(evt) {
    const target = evt.target;
    const value = parseFloat(target.value);
    if (!isNaN(value)) {
      this.setState({
        [target.name]: value,
      });
    }
  }

  handleShapeChange(evt) {
    const targetShape = evt.target.value;
    if (targetShape === 'rect') {
      this.setState({
        commonNodeElement: shapes[targetShape],
        textLayout: {
          textAnchor: 'start',
          x: 0,
          y: 0,
        },
      });
    } else {
      this.setState({ commonNodeElement: shapes[targetShape] });
    }
  }

  toggleCollapsible() {
    this.setState(prevState => ({ collapsible: !prevState.collapsible }));
  }

  toggleZoomable() {
    this.setState(prevState => ({ zoomable: !prevState.zoomable }));
  }

  setScaleExtent(scaleExtent) {
    this.setState({ scaleExtent });
  }

  setSeparation(separation) {
    if (!isNaN(separation.siblings) && !isNaN(separation.nonSiblings)) {
      this.setState({ separation });
    }
  }

  setNodeSize(nodeSize) {
    if (!isNaN(nodeSize.x) && !isNaN(nodeSize.y)) {
      this.setState({ nodeSize });
    }
  }

  addChildNode = () => {
    const data = clone(this.state.data)
    const target = data[0].children ? data[0].children : data[0]._children
    this.addedNodesCount++;
    target.push({ name: `Inserted Node ${this.addedNodesCount}`, id: `inserted-node-${this.addedNodesCount}` })
    this.setState({
      data
    })
  }

  removeChildNode = () => {
    const data = clone(this.state.data)
    const target = data[0].children ? data[0].children : data[0]._children
    target.pop()
    this.addedNodesCount--;
    this.setState({
      data
    })
  }


  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translateX: dimensions.width / 2.5,
      translateY: dimensions.height / 2,
    });
  }

  //  handleClick(d,evt) {
    // console.log(evt);
    //    setTimeout(() => console.log(evt), 1000);
    //  }

  render() {
    return (
      <div className="App">
        <div className="demo-container">
          <div className="column-left">
            <div className="controls-container">
              <div className="prop-container">
                <h2 className="title">React D3 Tree</h2>
                <h3 className="title">v{version}</h3>
                <span className="prop">Examples</span>
                <div style={{ marginBottom: '5px' }}>
                {[
                  {name: 'debug', data: debugData}, 
                  {name: 'Simple A', data: treeData},
                  {name:'Simple B', data: treeData2},
                  {name: 'Individual Node Shapes', data: individualShapesData},
                ].map(example => (
                  <Button key={example.name} onClick={() => this.setTreeData(example.data)}>
                    {example.name}
                  </Button>
                ))}
                  <Button onClick={() => this.setTreeDataFromFlatArray(mockFlatArray)}>
                    From Flat Array
                  </Button>
                </div>
              </div>

              <div className="prop-container">
                <span className="prop">Large Trees</span>
                <span className="prop">(animations off for performance)</span>
                {[
                  {name: 'React Repo', data: reactTree},
                  {name: 'Styled Components Repo', data: scTree}
                ].map(tree => (
                  <Button key={tree.name} onClick={() => this.setLargeTree(tree.data)}>
                    {tree.name}
                  </Button>
                ))}
              </div>

              <div className="prop-container">
                <span className="prop">Mutating loaded data</span>
                <button
                  type="button"
                  className="btn btn-controls btn-block"
                  onClick={() => this.addChildNode()}
                >
                  Insert Node
                  </button>
                <button
                  type="button"
                  className="btn btn-controls btn-block"
                  onClick={() => this.removeChildNode()}
                >
                  Remove Node
                  </button>
              </div>

              <div className="prop-container">
                <span className="prop">Data parsed from static source</span>
                <div>
                  {[
                    {name: 'From CSV File', 
                    onClick: () => 
                      this.setTreeDataFromCSV('csv-example.csv', [
                        'CSV Attribute A',
                        'CSV Attribute B',
                      ])},
                    {
                      name: 'From Flat JSON File',
                      onClick: () =>
                        this.setTreeDataFromFlatJSON('flat-json-example.json', [
                          'FlatJSON Attribute A',
                          'FlatJSON Attribute B',
                        ])
                    }
                  ].map(staticSource => (
                    <Button key={staticSource.name} onClick={staticSource.onClick}>
                      {staticSource.name}
                    </Button>
                  ))}
                  {/* <button type="button" className="btn btn-controls" onClick={() => this.setTreeData(ast)}>
                  AST (experimental)
                </button> */}
                </div>
              </div>

              <div className="prop-container">
                <span className="prop">Orientation</span>
                {['Horizontal', 'Vertical'].map(orientation =>
                  <Button key={orientation} onClick={() => this.setOrientation(orientation.toLowerCase())}>
                    {orientation}
                  </Button>
                )}
              </div>

              <div className="prop-container">
                <span className="prop">Path Function</span>
                {['Diagonal', 'Elbow', 'Straight'].map(pathFn => 
                  <Button key={pathFn} onClick={() => this.setPathFunc(pathFn.toLowerCase())}>
                    {pathFn}
                  </Button>
                )}
              </div>

              <div className="prop-container">
                <span className="prop">Collapsible</span>
                <Switch
                  name="collapsibleBtn"
                  checked={this.state.collapsible}
                  onChange={this.toggleCollapsible}
                />
              </div>

              <div className="prop-container">
                <label className="prop" htmlFor="commonNodeElement">
                 Common Node Element 
                </label>
                <select className="form-control" onChange={this.handleShapeChange}>
                  <option value="circle">{'<circle />'}</option>
                  <option value="ellipse">{'<ellipse />'}</option>
                  <option value="rect">{'<rect />'}</option>
                  <option value="none">{'None'}</option>
                </select>
                <textarea
                  className="form-control"
                  style={{ height: '90px' }}
                  name="commonNodeElement"
                  value={JSON.stringify(this.state.commonNodeElement, null, 2)}
                  readOnly
                />
              </div>

              <div className="prop-container">
                <div>
                  <label className="prop" htmlFor="translateX">
                    Translate X
                  </label>
                  <input
                    className="form-control"
                    name="translateX"
                    type="number"
                    value={this.state.translateX}
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  <label className="prop" htmlFor="translateY">
                    Translate Y
                  </label>
                  <input
                    className="form-control"
                    name="translateY"
                    type="number"
                    value={this.state.translateY}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="prop-container">
                <label className="prop" htmlFor="initialDepth">
                  Initial Depth
                </label>
                <input
                  className="form-control"
                  style={{ color: 'grey' }}
                  name="initialDepth"
                  type="text"
                  value={this.state.initialDepth || 'maximum'}
                  readOnly
                />
              </div>

              <div className="prop-container">
                <label className="prop" htmlFor="depthFactor">
                  Depth Factor
                </label>
                <input
                  className="form-control"
                  name="depthFactor"
                  type="number"
                  defaultValue={this.state.depthFactor}
                  onChange={this.handleChange}
                />
              </div>

              {/* <div className="prop-container prop">{`Zoomable: ${this.state.zoomable}`}</div> */}

              <div className="prop-container">
                <label className="prop" htmlFor="zoom">
                  Zoom
                </label>
                <input
                  className="form-control"
                  name="zoom"
                  type="number"
                  defaultValue={this.state.zoom}
                  onChange={this.handleFloatChange}
                />
              </div>

              <div className="prop-container">
                <span className="prop prop-large">Scale Extent</span>
                <label className="sub-prop" htmlFor="scaleExtentMin">
                  Min
                </label>
                <input
                  className="form-control"
                  name="scaleExtentMin"
                  type="number"
                  defaultValue={this.state.scaleExtent.min}
                  onChange={evt =>
                    this.setScaleExtent({
                      min: parseFloat(evt.target.value),
                      max: this.state.scaleExtent.max,
                    })
                  }
                />
                <label className="sub-prop" htmlFor="scaleExtentMax">
                  Max
                </label>
                <input
                  className="form-control"
                  name="scaleExtentMax"
                  type="number"
                  defaultValue={this.state.scaleExtent.max}
                  onChange={evt =>
                    this.setScaleExtent({
                      min: this.state.scaleExtent.min,
                      max: parseFloat(evt.target.value),
                    })
                  }
                />
              </div>

              <div className="prop-container">
                <span className="prop prop-large">Node separation</span>
                <label className="sub-prop" htmlFor="separationSiblings">
                  Siblings
                </label>
                <input
                  className="form-control"
                  name="separationSiblings"
                  type="number"
                  defaultValue={this.state.separation.siblings}
                  onChange={evt =>
                    this.setSeparation({
                      siblings: parseFloat(evt.target.value),
                      nonSiblings: this.state.separation.nonSiblings,
                    })
                  }
                />
                <label className="sub-prop" htmlFor="separationNonSiblings">
                  Non-Siblings
                </label>
                <input
                  className="form-control"
                  name="separationNonSiblings"
                  type="number"
                  defaultValue={this.state.separation.nonSiblings}
                  onChange={evt =>
                    this.setSeparation({
                      siblings: this.state.separation.siblings,
                      nonSiblings: parseFloat(evt.target.value),
                    })
                  }
                />
              </div>

              <div className="prop-container">
                <span className="prop prop-large">Node size</span>
                <label className="sub-prop" htmlFor="nodeSizeX">
                  X
                </label>
                <input
                  className="form-control"
                  name="nodeSizeX"
                  type="number"
                  defaultValue={this.state.nodeSize.x}
                  onChange={evt =>
                    this.setNodeSize({ x: parseFloat(evt.target.value), y: this.state.nodeSize.y })
                  }
                />
                <label className="sub-prop" htmlFor="nodeSizeY">
                  Y
                </label>
                <input
                  className="form-control"
                  name="nodeSizeY"
                  type="number"
                  defaultValue={this.state.nodeSize.y}
                  onChange={evt =>
                    this.setNodeSize({ x: this.state.nodeSize.x, y: parseFloat(evt.target.value) })
                  }
                />
              </div>

              <div className="prop-container">
                <label className="prop" htmlFor="transitionDuration">
                  Transition Duration
                </label>
                <input
                  className="form-control"
                  name="transitionDuration"
                  type="number"
                  value={this.state.transitionDuration}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>

          <div className="column-right">
            <div ref={tc => (this.treeContainer = tc)} className="tree-container">
              <Tree
                data={this.state.data}
                commonNodeElement={this.state.commonNodeElement}
                orientation={this.state.orientation}
                translate={{ x: this.state.translateX, y: this.state.translateY }}
                pathFunc={this.state.pathFunc}
                collapsible={this.state.collapsible}
                initialDepth={this.state.initialDepth}
                zoomable={this.state.zoomable}
                zoom={this.state.zoom}
                scaleExtent={this.state.scaleExtent}
                nodeSize={this.state.nodeSize}
                separation={this.state.separation}
                transitionDuration={this.state.transitionDuration}
                depthFactor={this.state.depthFactor}
                textLayout={this.state.textLayout}
                // styles={this.state.styles}
                onClick={this.handleClick}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
