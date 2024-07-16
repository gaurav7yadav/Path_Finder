import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import GraphAlgoVisualizer from "./graphAlgoVisualizer/graphAlgoVisualizer";
import MinimumSpanningTree from "./minimumSpanningTree/minimumSpanningTree";
import TopologicalSorting from "./topologicalSorting/FormInput";
import MainLayout from "./mainLayout";
import "./App.css";
class App extends Component {
  render() {
    return (
      <>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route exact path="/gav" element={<GraphAlgoVisualizer />} />
          <Route path="/mst" element={<MinimumSpanningTree />} />
          <Route path="/TopologicalSorting" element={<TopologicalSorting />} />
        </Routes>
      </>
    );
  }
}


export default App;
