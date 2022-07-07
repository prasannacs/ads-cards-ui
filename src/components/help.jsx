import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Accordion } from "react-bootstrap";
import config from '../config.js'


export default function Help() {

  useEffect(() => {
    console.log('Help ');
  }, []);


  return (

    <div>
      <Container>
        <Row>

          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>What does this application do?</Accordion.Header>
              <Accordion.Body>
                This application helps you Tweet with Ads-Styled-Cards. 
                Currently, the app support images, and video/gif support is coming soon.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Whom should I contact for support?</Accordion.Header>
              <Accordion.Body>
                This app is created and maintained by the DevRel - Solutions Architecture team. 
                Please get in touch with Prasanna Selvaraj for questions.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>What are some of the use cases for this app?</Accordion.Header>
              <Accordion.Body>
                <a target="blank" href="https://docs.google.com/presentation/d/1R3KlirfeZ4VYBqXxLyNNChHT9AGtNybRdnMSvDJdezI/edit?usp=sharing">Use case deck</a>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Can you show example Tweets created from this app?</Accordion.Header>
              <Accordion.Body>
                <a target="blank" href="https://twitter.com/PrasannaCS13/status/1542901228295839744">Image Carousel Tweet</a>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row></Container>
    </div>
  );

}


