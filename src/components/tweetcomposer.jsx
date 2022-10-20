import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Card, ToggleButton, Button, Modal, Form, Toast, Accordion } from "react-bootstrap";
import { requestTwitterToken, getAccessTokens } from "./services"
import config from '../config.js'

const axios = require("axios").default;

export default function TweetComposer() {

  const [reqToken, setReqToken] = useState(null);
  const [oauthToken, setOauthToken] = useState(null);
  const [oauthTokenSecret, setOauthTokenSecret] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cardList, setCardList] = useState([]);
  const [carouselList, setCarouselList] = useState([]);
  const [radioValue, setRadioValue] = useState('1');
  const [modalVis, setModalVis] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalData, setModalData] = useState({});
  const [toastVis, setToastVis] = useState(false);
  const [tweetStatus, setTweetStatus] = useState('Success');
  const [tweetMessage, setTweetMessage] = useState('');

  useEffect(() => {
    console.log('Tweet composer use effect ');
    loadTokens();
  }, []);

  function loadTokens() {
    console.log('Twitter Authorization Handler');
    requestTwitterToken('composer').then((requestToken) => {
      console.log('requestToken ', requestToken);
      setReqToken('https://api.twitter.com/oauth/authorize?oauth_token=' + requestToken);
    });
    const params = new URLSearchParams(window.location.search)
    let oauth_verifier = params.get('oauth_verifier')
    let oauth_token = params.get('oauth_token')
    console.log('oauth_verifier ', oauth_verifier, ' oauth_token ', oauth_token);
    if (oauth_verifier)
      getAccessTokens(oauth_verifier, oauth_token).then((accessTokens) => {
        setOauthToken(accessTokens.oauthToken);
        setOauthTokenSecret(accessTokens.oauthTokenSecret);
        setUserId(accessTokens.userId);
        fetchCards(accessTokens.userId).then(() =>  {
          console.log('getCardList ',cardList);
          console.log('getCarouselList ',carouselList); 
        });
      })
  }


  function fetchCards(userId) {
    console.log('getMediaLib');
    let options = { headers: { "Content-Type": "application/json" } };
    let url = config.backend.getCards + '?user_id=' + userId;
    // if (discriminator != null || discriminator != undefined) {
    //   url = url + '&discriminator=' + discriminator;
    // }
    console.log('get cards URL ', url);
    return new Promise(function (resolve, reject) {
      axios
        .get(url, null, options)
        .then((res) => {
          console.log(' fetch cards results website', res.data);
          if(res.data.length != undefined)  {
            let cardsArray = [];
            let carouselArray = []
            res.data.forEach((card) =>  {
              console.log('card -- ',card.card_type);
              if (card.card_type === 'IMAGE_WEBSITE') {          
                cardsArray.push(card);
              } else if (card.card_type === 'IMAGE_CAROUSEL_WEBSITE') {
                carouselArray.push(card);
              }
            })
            setCardList(cardsArray);
            setCarouselList(carouselArray);
        }
          resolve(res.data);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    })
  }

  const radioOnChange = async (event) => {
    console.log('Radio button changed ', event)
    setModalVis(true);
    setSelectedCard(event);
  }

  const handleModalClose = () => setModalVis(false);

  function createTweet() {
    console.log('create Tweet ', modalData.tweet, selectedCard)
    let options = { headers: { "Content-Type": "application/json" }, };
    let body = { 'cardURI': selectedCard, 'tweet': modalData.tweet, 'oauthToken': oauthToken, 'oauthTokenSecret': oauthTokenSecret }

    axios
      .post(config.backend.tweet, body, options)
      .then((res) => {
        console.log(' Tweet results', res.data);
        if (res.data) {
          setTweetStatus('Success');
          setTweetMessage('Tweet ' + res.data.id)
        } else {
          setTweetStatus('Failed');
          console.log('Error array ', res.data.error)
          setTweetMessage(res.data.error.code + ' : ' + res.data.error.message)
        }
        setModalVis(false);
        setToastVis(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const toastShow = () => setToastVis(false);

  return (

    <div>
      <div>
        {reqToken && !userId &&
          <a href={reqToken}>Authorize with your Twitter credentials</a>}
      </div>
      <div>
        {userId &&
          <>

            <Container>
              <Row>
                <Col md={6} className="mb-2">
                  <Toast show={toastVis} onClose={toastShow}>
                    <Toast.Header>
                      <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                      />
                      <strong className="me-auto">Tweet Create Status</strong>
                      <small>{tweetStatus}</small>
                    </Toast.Header>
                    <Toast.Body>{tweetMessage}</Toast.Body>
                  </Toast>
                </Col>
              </Row>
            </Container>

            <Accordion defaultActiveKey="1">

              <Container fluid="md">
                <Row md="auto"><p></p></Row>
                <Accordion.Item eventKey="0">
                  <Accordion.Header><h5>Single image cards</h5></Accordion.Header>
                  <Accordion.Body>

                    <Row md="auto"><p></p></Row>
                    <Row md="auto">
                      {cardList && cardList.map((card) => (
                        <div>
                          <Col>
                            <Card style={{ width: '12rem' }}>
                              <Card.Body>
                                <ToggleButton key={card.components[0].media_key} id={card.components[0].media_key} name={card.components[0].media_key} type="radio" variant="primary" checked={radioValue === card.card_uri} value={card.card_uri} onChange={(e) => radioOnChange(e.currentTarget.value)}>
                                  Tweet
                                </ToggleButton>
                                <Card.Title>{card.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{card.card_type}</Card.Subtitle>
                              </Card.Body>
                              <Card.Img className="photo" variant="bottom" src={card.components[0].media_metadata[card.components[0].media_key].url} />
                            </Card>

                          </Col>
                        </div>

                      ))}
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Container>

              <Container fluid="md">
                <Row md="auto"><p></p></Row>
                <Accordion.Item eventKey="1">
                  <Accordion.Header><h5>Carousel styled cards</h5></Accordion.Header>
                  <Accordion.Body>
                    <Row md="auto"><p></p></Row>
                    <Row md="auto">
                      {carouselList && carouselList.map((card) => (
                        <div>
                          <Col>
                            <Card style={{ width: '12rem' }}>
                              <Card.Body>
                                <ToggleButton key={card.id} id={card.id} name={card.id} type="radio" variant="primary" checked={radioValue === card.card_uri} value={card.card_uri} onChange={(e) => radioOnChange(e.currentTarget.value)}>
                                  Tweet
                                </ToggleButton>
                                <Card.Title>{card.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{card.card_type}</Card.Subtitle>
                              </Card.Body>
                              {card.components[0] && card.components[0].media_keys.map((mediaKey) => (
                                <Card.Img className="photo" variant="bottom" src={card.components[0].media_metadata[mediaKey].url} />
                              ))}
                            </Card>

                          </Col>
                        </div>

                      ))}
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Container>
            </Accordion>
            <Container fluid="md">
              <Row md="auto"><p></p></Row>
              <Row>
                <Modal show={modalVis} onHide={handleModalClose} value={selectedCard}>
                  <Modal.Header closeButton>
                    <Modal.Title>Create Tweet</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={createTweet}>
                      <Form.Label>Card URI: {selectedCard}</Form.Label>
                      <Form.Group className="mb-3" controlId="modalForm.ControlInput1">
                        <Form.Label>Tweet text</Form.Label>
                        <Form.Control
                          type="text"
                          onChange={e => setModalData({ tweet: e.target.value })}
                          placeholder=""
                          autoFocus
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={createTweet}>
                      Tweet
                    </Button>
                  </Modal.Footer>
                </Modal>

              </Row>
            </Container>
          </>
        }
      </div>
    </div>
  );

}


