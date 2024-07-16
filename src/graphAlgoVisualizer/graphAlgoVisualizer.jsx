import React, { Component } from "react";
import Node from "./node/node.jsx";
import Navbar from "./navbar.jsx";
import "./graphAlgoVisualizer.css";
import {
  dijkstra,
  getShortestPathDijkstra,
  getWeightOfShortestPathDijkstra,
} from "../algorithms/dijkstra.js";
import {
  bfs,
  getPathBFS,
  getWeightOfShortestPathBFS,
} from "../algorithms/bfs.js";
import { dfs, getPathDFS, getWeightOfPathDFS } from "../algorithms/dfs.js";
import "./node/node.css";

const total_rows = 18;
const total_columns = 45;
var startNode_Row = 5;
var startNode_Col = 10;
var endNode_Row = 10;
var endNode_Col = 37;
const FixedWeight = 10;

class GraphAlgoVisualizer extends Component {
  state = {
    grid: [],
    isMousePressed: false,
    timeComplexity: 0,
    pathCost: 0,
    pathLength: 0,
    isMovingStart: false,
    isMovingEnd: false,
    addWeights: false,
    processActive: false,
    description: "Selecting the Nodes in the grid creates Obstacles/Weights. To switch from Obstacles to Weight and vice versa, use the checkbox at Navbar and select an Algorithm",
  };

  componentDidMount() {
    const grid = [];
    for (let row = 0; row < total_rows; row++) {
      const currentRow = [];
      for (let column = 0; column < total_columns; column++) {
        const currentNode = {
          row,
          column,
          isStart: row === startNode_Row && column === startNode_Col,
          isEnd: row === endNode_Row && column === endNode_Col,
          distance: Infinity,
          weight: 0,
          isVisited: false,
          previousNode: null,
          isWall: false,
          visitedNode: false,
          pathNode: false,
        };
        currentRow.push(currentNode);
      }
      grid.push(currentRow);
    }
    this.setState({ grid });
  }

  getNewGridWithWallToggled = (row, column) => {
    const newGrid = this.state.grid.slice();
    const node = newGrid[row][column];
    const newNode = {
      ...node,
      isWall: !node.isWall,
      weight: 0,
    };
    newGrid[row][column] = newNode;
    return newGrid;
  };

  getNewGridWithWeights = (row, column) => {
    const newGrid = this.state.grid.slice();
    const node = newGrid[row][column];
    let changeInValue = 0;
    if (node.weight === 0) {
      changeInValue = FixedWeight;
    } else {
      changeInValue = -FixedWeight;
    }
    const newNode = {
      ...node,
      isWall: false,
      weight: node.weight + changeInValue,
    };
    newGrid[row][column] = newNode;
    return newGrid;
  };

  handleMouseDown = (row, column) => {
    if (this.state.processActive === true) {
      return;
    }
    if (
      !(
        (row === startNode_Row && column === startNode_Col) ||
        (row === endNode_Row && column === endNode_Col)
      )
    ) {
      let newGrid;
      if (!this.state.addWeights) {
        newGrid = this.getNewGridWithWallToggled(row, column);
      } else {
        newGrid = this.getNewGridWithWeights(row, column);
      }
      this.setState({ grid: newGrid, isMousePressed: true });
    }
    // if user wants to change positon of start or end node
    else {
      this.setState({ isMousePressed: true });
      if (row === startNode_Row && column === startNode_Col) {
        const newGrid = this.state.grid.slice();
        const node = newGrid[row][column];
        const newNode = {
          ...node,
          isStart: false,
        };
        newGrid[row][column] = newNode;
        this.setState({ grid: newGrid, isMovingStart: true });
      } else if (row === endNode_Row && column === endNode_Col) {
        const newGrid = this.state.grid.slice();
        const node = newGrid[row][column];
        const newNode = {
          ...node,
          isEnd: false,
        };
        newGrid[row][column] = newNode;
        this.setState({ grid: newGrid, isMovingEnd: true });
      }
    }
  };

  handleMouseEnter = (row, column) => {
    //Mouse entering a node with no click
    if (!this.state.isMousePressed && !this.state.processActive) {
      if (
        !(
          (row === startNode_Row && column === startNode_Col) ||
          (row === endNode_Row && column === endNode_Col)
        )
      ) {
        let newGrid;
        if (!this.state.addWeights) {
          newGrid = this.getNewGridWithWallToggled(row, column);
        } else {
          newGrid = this.getNewGridWithWeights(row, column);
        }
        this.setState({ grid: newGrid });
      } else {
      }
      return;
    }

    if (this.state.isMovingStart){
      const newGrid=this.state.grid;
      newGrid[startNode_Row][startNode_Col].isStart=false;
      newGrid[row][column].isStart=true;
      startNode_Row=row;
      startNode_Col=column;
      this.setState({grid:newGrid});
    }
    else if (this.state.isMovingEnd){
      const newGrid=this.state.grid;
      newGrid[endNode_Row][endNode_Col].isEnd=false;
      newGrid[row][column].isEnd=true;
      endNode_Row=row;
      endNode_Col=column;
      this.setState({grid:newGrid});
    }
    if (
      this.state.isMousePressed &&
      !(
        (row === startNode_Row && column === startNode_Col) ||
        (row === endNode_Row && column === endNode_Col)
      )
    ) {
      let newGrid;
      if (!this.state.addWeights) {
        newGrid = this.getNewGridWithWallToggled(row, column);
      } else {
        newGrid = this.getNewGridWithWeights(row, column);
      }
      this.setState({ grid: newGrid });
    } else {
    }
  };

  handleMouseUp = (row, column) => {
    if (this.state.processActive === true) {
      return;
    }
    this.setState({ isMousePressed: false });

    //if moving start or end
    if (this.state.isMovingStart === true) {
      const newGrid = this.state.grid.slice();
      const node = newGrid[row][column];
      const newNode = {
        ...node,
        isWall: false,
        isStart: true,
      };
      newGrid[row][column] = newNode;
      this.setState({ grid: newGrid, isMovingStart: false });
      startNode_Row = row;
      startNode_Col = column;
    } else if (this.state.isMovingEnd === true) {
      const newGrid = this.state.grid.slice();
      const node = newGrid[row][column];
      const newNode = {
        ...node,
        isWall: false,
        isEnd: true,
      };
      newGrid[row][column] = newNode;
      this.setState({ grid: newGrid, isMovingEnd: false });
      endNode_Row = row;
      endNode_Col = column;
    }
  };

  handleMouseLeave = (row, column) => {
    if (!this.state.isMousePressed && !this.state.processActive) {
      if (
        !(
          (row === startNode_Row && column === startNode_Col) ||
          (row === endNode_Row && column === endNode_Col)
        )
      ) {
        let newGrid;
        if (!this.state.addWeights) {
          newGrid = this.getNewGridWithWallToggled(row, column);
        } else {
          newGrid = this.getNewGridWithWeights(row, column);
        }
        this.setState({ grid: newGrid });
      } else {
      }
      return;
    }
  };

  animateAlgo = (visitedNodesInOrder, shortestPath) => {
    this.setState({ processActive: true });
    document.getElementById("visualize").disabled = true;
    document.getElementById("clearAlgo").disabled = true;
    document.getElementById("clearGrid").disabled = true;
    const newGrid = this.state.grid.slice();
    for (let i = 1; i < visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        for (let j = 0; j < shortestPath.length; j++) {
          setTimeout(() => {
            setTimeout(() => {
              const node = shortestPath[j];
              const newGridNode = newGrid[node.row][node.column];
              const newNode = {
                ...newGridNode,
                pathNode: true,
              };
              newGrid[node.row][node.column] = newNode;
              if (
                document.getElementById(`node-${node.row}-${node.column}`)
                  .className === "node weight-present-visited"
              ) {
                document.getElementById(
                  `node-${node.row}-${node.column}`
                ).className = "node weight-present-path";
              } else {
                document.getElementById(
                  `node-${node.row}-${node.column}`
                ).className = "node node-shortestPath";
              }
            }, 50 * j);
          }, 25 * i);
        }
        // Finally the solution to bug
        setTimeout(() => {
          setTimeout(() => {
            this.setState({ processActive: false });
            document.getElementById("visualize").disabled = false;
            document.getElementById("clearAlgo").disabled = false;
            document.getElementById("clearGrid").disabled = false;
            this.setState({ grid: newGrid});
          }, 50 * shortestPath.length);
        }, 25 * visitedNodesInOrder.length);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
              const newGridNode = newGrid[node.row][node.column];
              const newNode = {
                ...newGridNode,
                visitedNode: true,
              };
              newGrid[node.row][node.column] = newNode;
        if (
          document.getElementById(`node-${node.row}-${node.column}`)
            .className === "node weight-present"
        ) {
          document.getElementById(`node-${node.row}-${node.column}`).className =
            "node weight-present-visited";
        } else {
          document.getElementById(`node-${node.row}-${node.column}`).className =
            "node node-visited";
        }
      }, 25 * i);
    }
  };

  visualizeDijkstra = () => {
    this.clearAlgo(); //for clearing grid for any previous algo if implemented
    const { grid } = this.state;
    const startNode = grid[startNode_Row][startNode_Col];
    const endNode = grid[endNode_Row][endNode_Col];
    const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
    const shortestPath = getShortestPathDijkstra(grid, startNode, endNode);
    const shortestPathCost = getWeightOfShortestPathDijkstra(
      grid,
      shortestPath
    );
    this.animateAlgo(visitedNodesInOrder, shortestPath);
    this.setState({
      timeComplexity: visitedNodesInOrder.length,
      pathLength: shortestPath.length,
      pathCost: shortestPathCost,
    });
  };

  visualizeBFS = () => {
    this.clearAlgo(); //for clearing grid for any previous algo if implemented
    const { grid } = this.state;
    const startNode = grid[startNode_Row][startNode_Col];
    const endNode = grid[endNode_Row][endNode_Col];
    const visitedNodesInOrder = bfs(grid, startNode, endNode);
    const path = getPathBFS(grid, startNode, endNode);
    this.animateAlgo(visitedNodesInOrder, path);
    const pathCost = getWeightOfShortestPathBFS(grid, path);
    this.setState({
      timeComplexity: visitedNodesInOrder.length,
      pathLength: path.length,
      pathCost,
    });
  };

  visualizeDFS = () => {
    this.clearAlgo(); //for clearing grid for any previous algo if implemented
    const { grid } = this.state;
    const startNode = grid[startNode_Row][startNode_Col];
    const endNode = grid[endNode_Row][endNode_Col];
    const visitedNodesInOrder = dfs(grid, startNode, endNode);
    const path = getPathDFS(grid, startNode, endNode);
    this.animateAlgo(visitedNodesInOrder, path);
    const pathCost = getWeightOfPathDFS(grid, path);
    this.setState({
      timeComplexity: visitedNodesInOrder.length,
      pathLength: path.length,
      pathCost,
    });
  };

  //clear visitedNodes and shortestPath properties from the grid leaving walls and weights untouched
  clearAlgo = () => {
    const newGrid = this.state.grid;
    for (let row = 0; row < total_rows; row++) {
      for (let column = 0; column < total_columns; column++) {
        newGrid[row][column].distance = Infinity;
        newGrid[row][column].isVisited = false;
        newGrid[row][column].previousNode = null;
        newGrid[row][column].visitedNode = false;
        newGrid[row][column].pathNode = false;
        if (
          !(
            (row === startNode_Row && column === startNode_Col) ||
            (row === endNode_Row && column === endNode_Col) ||
            newGrid[row][column].isWall === true
          )
        ) {
          if (newGrid[row][column].weight > 0) {
            document.getElementById(`node-${row}-${column}`).className =
              "node weight-present";
          } else {
            document.getElementById(`node-${row}-${column}`).className = "node";
          }
        }
      }
    }
    this.setState({
      grid: newGrid,
      timeComplexity: 0,
      pathLength: 0,
      pathCost: 0,
    });
  };

  //clear whole grid
  undoAlgoAndWalls = () => {
    const newGrid = this.state.grid;
    for (let row = 0; row < total_rows; row++) {
      for (let column = 0; column < total_columns; column++) {
        newGrid[row][column].distance = Infinity;
        newGrid[row][column].isVisited = false;
        newGrid[row][column].previousNode = null;
        newGrid[row][column].isWall = false;
        newGrid[row][column].weight = 0;
        newGrid[row][column].visitedNode = false;
        newGrid[row][column].pathNode = false;
        if (
          !(
            (row === startNode_Row && column === startNode_Col) ||
            (row === endNode_Row && column === endNode_Col)
          )
        ) {
          document.getElementById(`node-${row}-${column}`).className = "node";
        }
      }
    }
    this.setState({
      grid: newGrid,
      timeComplexity: 0,
      pathLength: 0,
      pathCost: 0,
    });
  };

  handleCheckboxChange = () => {
    this.setState({ addWeights: !this.state.addWeights });
  };

  getDescription=(algo)=>{
    if (algo==="Dijkstra"){
      this.setState({description:"Dijkstra's Algorithm is Weighted and guarantees the Shortest Path!"});
    }
    else if (algo==="Astar"){
      this.setState({description:"A* Search (AI based Algorithm) is Weighted and guarantees the Shortest Path!"});
    }
    else if (algo==="BFS"){
      this.setState({description:"Breath-first Search is Unweighted and guarantees the Shortest Path!"});
    }
    else if (algo==="DFS"){
      this.setState({description:"Depth-first Search is Unweighted and does not guarantee the Shortest path!"});
    }
  }

  render() {
    const { grid } = this.state;
    return (
      <div>
        <Navbar
          addWeights={this.state.addWeights}
          handleDijkstra={this.visualizeDijkstra}
          handleAstar={this.visualizeAstar}
          handleBFS={this.visualizeBFS}
          handleDFS={this.visualizeDFS}
          handleClearAlgorithm={this.clearAlgo}
          handleClearGrid={this.undoAlgoAndWalls}
          handleCheckboxChange={this.handleCheckboxChange}
          processActive={this.state.processActive}
          timeComplexity={this.state.timeComplexity}
          pathCost={this.state.pathCost}
          pathLength={this.state.pathLength}
          handleDescription={(algo)=>this.getDescription(algo)}
        ></Navbar>
        <div className="labels mt-3">
          <li className="node startNode ml-5"></li>  Start node{" "}
          <li className="node endNode ml-5"></li>  End Node{" "}{" "}
          <li className="node node-visited ml-5"></li>  Visited node{"  "}
          <li className="node node-shortestPath ml-5"></li>  Path Node{"  "}
          <li className="node wall-true ml-5"></li>  Obstacle Node{"  "}
          <li className="node weight-present ml-5"></li>  Weight Node{"  "}
          <li className="node ml-5"></li>  Unvisited Node
        </div>

        <div className="description mt-3">
          {this.state.description}
        </div>
        
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  return (
                    <Node
                      key={nodeIdx}
                      row={node.row}
                      column={node.column}
                      isStart={node.isStart}
                      isEnd={node.isEnd}
                      distance={node.distance}
                      isVisited={node.isVisited}
                      previousNode={node.previousNode}
                      isWall={node.isWall}
                      weight={node.weight}
                      visitedNode={node.visitedNode}
                      pathNode={node.pathNode}
                      // isMousePressed={isMousePressed}
                      onMouseDown={(row, column) =>
                        this.handleMouseDown(row, column)
                      }
                      onMouseEnter={(row, column) =>
                        this.handleMouseEnter(row, column)
                      }
                      onMouseUp={(row, column) =>
                        this.handleMouseUp(row, column)
                      }
                      onMouseLeave={(row, column) =>
                        this.handleMouseLeave(row,column)
                      }
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default GraphAlgoVisualizer;
