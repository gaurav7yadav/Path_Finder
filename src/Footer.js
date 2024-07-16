import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <p>
        Developed by (
        <a
          href=" https://www.linkedin.com/in/gaurav-yadav-7645b4230/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gaurav Yadav
        </a>
        {" & "}
        <a
          href="https://www.linkedin.com/in/harsh-raj-689488224"
          target="_blank"
          rel="noopener noreferrer"
        >
          Harsh Raj
        </a>
        )
      </p>
    </div>
  );
}