import React from "react";
import "./mainlayout.css";
import Header from "./Header";
import Footer from "./Footer";
import bfsImage from './bfs.png';
import mstImage from './mst.png';
import topoImage from './topo.png';
const cards = [
  {
    image: bfsImage,
    description: 'OptimalPath',
    link: '/gav'
  },
  {
    image: mstImage,
    description: 'Spanning the Divide: A Study in Minimum Spanning Trees',
    link: '/mst'
  },
  {
    image: topoImage,
    description: 'TopoTraverse',
    link: '/TopologicalSorting'
  }
];

const Card = ({ image, description, link }) => {
  return (
    <div className="card" onClick={() => window.open(link, '_blank')}>
      <img src={image} alt="card" className="card-img" />
      <p>{description}</p>
    </div>
  );
};

const MainLayout = () => (
  <>
    <Header />
    <div className="container">
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
    <Footer />
  </>
);

export default MainLayout;
