import React from "react";
import { DataSet } from "vis-data";
import "./form.css";
import Network from './Network';

class FormInput extends React.Component {
  tempdata = {
    value1: '', value2: '', value3: '', value4: '',
    value1prereq: '', value2prereq: '', value3prereq: '', value4prereq: ''
  };
  temptaskCounter = 1;
  tempgraph = {
    nodes: [],
    edges: []
  };
  tempanswer = '';

  constructor(props) {
    super(props);
    this.state = {
      data: {
        value1: '', value2: '', value3: '', value4: '',
        value1prereq: '', value2prereq: '', value3prereq: '', value4prereq: ''
      },
      taskCounter: 1,
      graph: {
        nodes: [],
        edges: []
      },
      answer: '',
      open: false
    };
    this.createNetwork = this.createNetwork.bind(this);
    this.handlebuttonclick = this.handlebuttonclick.bind(this);
    this.topologicalSort = this.topologicalSort.bind(this);
    this.hasCycle = this.hasCycle.bind(this);
    this.hasCycleUtil = this.hasCycleUtil.bind(this);
    this.computeInDegree = this.computeInDegree.bind(this);
    this.generateFormInput = this.generateFormInput.bind(this);
    this.visualizeNetwork = this.visualizeNetwork.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  resetForm() {
    this.temptaskCounter = 1;
    for (let i = 1; i < 4; i++) {
      this.formmanage.children[i].hidden = true;
    }
  }

  handlebuttonclick() {
    this.setState({ open: !this.state.open });
  }

  generateFormInput(e) {
    e.preventDefault();
    this.temptaskCounter += 1;
    if (this.temptaskCounter === 4) {
      e.target.disabled = true;
    }
    e.target.parentElement.children[this.temptaskCounter - 1].hidden = false;
  }

  computeInDegree(adjMap) {
    let inDegreeMap = new Map();
    for (let [node, list] of adjMap) {
      if (!inDegreeMap.has(node)) {
        inDegreeMap.set(node, 0);
      }
      for (let neighbour of list) {
        if (inDegreeMap.has(neighbour)) {
          inDegreeMap.set(neighbour, inDegreeMap.get(neighbour) + 1);
        } else {
          inDegreeMap.set(neighbour, 1);
        }
      }
    }
    return inDegreeMap;
  }

  hasCycleUtil(i, visited, recStack, adjMap) {
    if (recStack[i]) return true;
    if (visited[i]) return false;

    visited[i] = true;
    recStack[i] = true;
    let children = adjMap.get(i);

    for (let c = 0; c < children.length; c++) {
      if (this.hasCycleUtil(children[c], visited, recStack, adjMap)) return true;
    }

    recStack[i] = false;
    return false;
  }

  hasCycle(adjMap) {
    let visited = new Array(this.temptaskCounter).fill(false);
    let recStack = new Array(this.temptaskCounter).fill(false);

    for (let i = 0; i < this.temptaskCounter; i++) {
      if (this.hasCycleUtil(i, visited, recStack, adjMap)) return true;
    }

    return false;
  }

  topologicalSort(adjMap, inDegreeMap) {
    let q = [];
    for (let [key, value] of inDegreeMap) {
      if (value === 0) {
        q.push(key);
      }
    }

    let answer = [];
    while (q.length) {
      let curr = q.shift();
      answer.push(curr);
      let neighbours = adjMap.get(curr);
      for (let i = 0; i < neighbours.length; ++i) {
        inDegreeMap.set(neighbours[i], inDegreeMap.get(neighbours[i]) - 1);
        if (inDegreeMap.get(neighbours[i]) === 0) {
          q.push(neighbours[i]);
        }
      }
    }

    if (answer.length < this.temptaskCounter) {
      this.tempanswer = "Topological Sort is not possible since given graph has cycle";
    } else {
      this.tempanswer = "Order Of Execution = " + answer.toString();
    }
  }

  visualizeNetwork() {
    const data = this.tempdata;
    let adjMap = new Map();
    for (let i = 0; i < this.temptaskCounter; i++) {
      let key = Object.values(data).at(i).toLowerCase().trim();
      if (!key) {
        continue;
      }
      let values = Object.values(data).at(i + 4).split(',');
      values = values.filter(str => str.trim().length > 0);
      for (let i = 0; i < values.length; ++i) {
        values[i] = values[i].toLowerCase().trim();
        if (!adjMap.has(values[i])) {
          adjMap.set(values[i], [key]);
        } else {
          adjMap.get(values[i]).push(key);
        }
      }

      if (key && !adjMap.has(key)) {
        adjMap.set(key, []);
      }
    }
    this.createNetwork(adjMap);
    this.topologicalSort(adjMap, this.computeInDegree(adjMap));
  }

  createNetwork(adjMap) {
    let dataSet = [];
    let edgesArr = [];
    for (let [key, values] of adjMap) {
      dataSet.push({ id: key, label: key });
      for (let i = 0; i < values.length; ++i) {
        edgesArr.push({ from: key, to: values[i], width: 1 });
      }
    }
    let network = new DataSet(dataSet);
    let edges = new DataSet(edgesArr);
    let data = {
      nodes: network,
      edges: edges
    };
    this.tempgraph = data;
  }

  handleChange(event) {
    this.tempdata[event.target.name] = event.target.value;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.temptaskCounter >= 1 && this.tempdata.value1 !== "") {
      event.target.parentElement.children[4].hidden = false;
    }

    this.visualizeNetwork();
    this.setState({
      data: this.tempdata,
      taskCounter: this.temptaskCounter,
      graph: this.tempgraph,
      answer: this.tempanswer
    });
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    return (
      <>
        <div className="container-fluid px-0">
          <div className="pt-2 pb-2 container-fluid text-center">
            <div className="navbar-brand">
              <span style={{ color: "yellow", fontWeight: "bold" }}>Topological Sorting</span>
            </div>
          </div>
        </div>

        <div className="m-2 text-center" style={{ color: "white"}}>
          <b>In computer science, a topological sort or topological ordering of a directed graph is
            a linear ordering of its vertices such that for every directed edge uv from vertex u to vertex v, u
            comes before v in the ordering.
            For instance, the vertices of the graph may represent tasks to be performed,
            and the edges may represent constraints that one task must be performed before
            another; in this application, a topological ordering is just a valid sequence
            for the tasks. A topological ordering is possible if and only if the graph has
            no directed cycles, that is, if it is a directed acyclic graph (DAG)</b>
        </div>

        <div className="text-white mt-4" style={{ paddingLeft: '12px' }}>
          <b>Enter Tasks Data:</b>
        </div>

        <form onSubmit={this.handleSubmit} ref={(em) => { this.formmanage = em; }}>

          <div>
            <input type="text" name="value1" placeholder="Task 1" onChange={this.handleChange} className="m-2 input-field" />
            <input type="text" name="value1prereq" placeholder="Task1 - Prerequisite" onChange={this.handleChange} className="m-2 input-field" />
          </div>

          <div hidden={true}>
            <input type="text" name="value2" placeholder="Task 2" onChange={this.handleChange} className="m-2 input-field" />
            <input type="text" name="value2prereq" placeholder="Task2 - Prerequisite" onChange={this.handleChange} className="m-2 input-field" />
          </div>

          <div hidden={true}>
            <input type="text" name="value3" placeholder="Task 3" onChange={this.handleChange} className="m-2 input-field" />
            <input type="text" name="value3prereq" placeholder="Task3 - Prerequisite" onChange={this.handleChange} className="m-2 input-field" />
          </div>

          <div hidden={true}>
            <input type="text" name="value4" placeholder="Task 4" onChange={this.handleChange} className="m-2 input-field" />
            <input type="text" name="value4prereq" placeholder="Task4 - Prerequisite" onChange={this.handleChange} className="m-2 input-field" />
          </div>
          <input type="button" value="Add More" onClick={this.generateFormInput} className="mt-2 ml-2 mr-1 button" style={{ color: 'black' }}/>
          <input type="submit" value="Visualize" className="mt-2 mr-2 ml-1 button" style={{ color: 'black' }}/>

        </form>
        <div className="result" hidden={false} ref={(el) => { this.messagesEnd = el; }} >
          {this.state.answer}
        </div>
        <div className="vis-react m-1">
          <Network value1={this.state.graph} />
        </div>

      </>
    );
  }
}

export default FormInput;
