import React, { useState, useEffect } from "react";
import { Navbar } from 'react-bootstrap'

export default function NaviBar() {
    
    return (
      <div>

        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="media">
            <img
              alt=""
              src="https://static.thenounproject.com/png/3147006-200.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
             &nbsp; Create Cards
          </Navbar.Brand>
          <Navbar.Brand href="composer">
            <img
              alt=""
              src="https://cdn1.vectorstock.com/i/1000x1000/76/15/analytics-icon-on-transparent-analytics-sign-vector-20707615.jpg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
             &nbsp; Tweet Composer
          </Navbar.Brand>
        </Navbar>
      </div>
    );

}


