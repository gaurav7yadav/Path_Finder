import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";


const Checkbox = (props) => <input type="checkbox" {...props} />;

class classNavbar extends Component {
  state = {
    currentAlgo: "Choose Algorithm",
    addWeights: "false",
  };
  forDijkstra = () => {
    this.setState({ currentAlgo: "Dijkstra" });
    this.props.handleDescription("Dijkstra");
  };
  forBFS = () => {
    this.setState({ currentAlgo: "Breadth First Search" });
    this.props.handleDescription("BFS");
  };
  forDFS = () => {
    this.setState({ currentAlgo: "Depth First Search" });
    this.props.handleDescription("DFS");
  };
  visualize = () => {
    if (this.state.currentAlgo === "Dijkstra") {
      this.props.handleDijkstra();
    } else if (this.state.currentAlgo === "Breadth First Search") {
      this.props.handleBFS();
    } else if (this.state.currentAlgo === "Depth First Search") {
      this.props.handleDFS();
    }
  };
  handleCheckboxChange = () => {
    console.log(this.state.addWeights);
    this.setState({ addWeights: !this.state.addWeights });
  };
  render() {
    const {
      handleClearAlgorithm,
      handleClearGrid,
      addWeights,
      handleCheckboxChange,
      timeComplexity,
      pathLength,
      pathCost,
    } = this.props;
    return (
      <Navbar variant="dark" expand="lg" sticky="top" style={{backgroundColor: "#262626",paddingLeft: "7rem"}}>
        
        <Navbar.Brand className=" mr-4">{/*Path Finder Visualizer*/}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title={this.state.currentAlgo} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={this.forDijkstra}>
                Dijkstra
              </NavDropdown.Item>
              <NavDropdown.Item onClick={this.forBFS}>
                Breadth First Search
              </NavDropdown.Item>
              <NavDropdown.Item onClick={this.forDFS}>
                Depth First Search
              </NavDropdown.Item>
            </NavDropdown>
            <Button
              variant="success"
              className="mx-4"
              onClick={this.visualize}
              id="visualize"
            >
              Visualize!
            </Button>
            <Button
              variant="info"
              className="mx-4"
              id="clearAlgo"
              onClick={handleClearAlgorithm}
            >
              Clear Algorithm
            </Button>
            <Button
              variant="danger"
              className="mx-4"
              onClick={handleClearGrid}
              id="clearGrid"
            >
              Clear Grid
            </Button>
            <label className="mx-3">
              <Checkbox checked={addWeights} onChange={handleCheckboxChange} />
              <span className="checkBox">Switch to Weights</span>
            </label>
            <label className="checkBox mx-3">Path Length : {pathLength}</label>
            <label className="checkBox mx-3">Path Cost : {pathCost}</label>
            <label className="checkBox mx-3">Time Complexity : {timeComplexity}</label>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default classNavbar;
