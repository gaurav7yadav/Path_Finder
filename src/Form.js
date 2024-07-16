import logo from './logo.svg';
import './App.css';
import React ,{useState}from 'react'
function Form() {
const [name,setname]=useState("");
const [tnc,setTnc]=useState(false);
const [interest,setInterest]=useState("");


  function getFormData(e)
  {
    console.warn(name,interest,tnc)
    e.preventDefault();
  }
  return (
   <div className="Form">
    <h1>Form bna dala</h1>
    <form onSubmit={getFormData}>
      <input type="text" placeholder='Enter name' onChange={(e)=>setname(e.target.value)}/><br /><br />
      <select onChange={(e)=>setInterest(e.target.value)}>
        <option>Select Options</option>
        <option>Bollywood</option>
        <option>Hollywood</option>
        <option>Marvel</option>
        <option>DC</option>
      </select><br /><br/>
      <input type="checkbox" onChange={(e)=>setTnc(e.target.checked)} /><span>Accept Terms & Condition</span>
      <br /><br />
      <button type="Submit">Submit</button>
    </form>
   </div>
  );
}

export default Form;