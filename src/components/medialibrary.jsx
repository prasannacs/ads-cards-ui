import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";
import { Card, CardGroup, ToggleButton, Modal, Form, Toast } from "react-bootstrap";
import './library.css'
import { requestTwitterToken, getAccessTokens, getMediaLibrary } from "./services"
import config from '../config.js'

const axios = require("axios").default;

export default function MediaLibrary() {

  const [reqToken, setReqToken] = useState(null);
  const [oauthToken, setOauthToken] = useState(null);
  const [oauthTokenSecret, setOauthTokenSecret] = useState(null);
  const [userId, setUserId] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('1');
  const [show, setShow] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showA, setShowA] = useState(false);
  const [cardStatus, setCardStatus] = useState('Success');
  const [cardMessage, setCardMessage] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');


  useEffect(() => {
    console.log('Media lib use effect ', reqToken);
    if (reqToken === null)
      loadTokens();
  }, []);

  function loadTokens() {
    console.log('Twitter Authorization Handler');
    requestTwitterToken().then((requestToken) => {
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
        getMediaLibrary(accessTokens.userId).then((medList) => {
          setMediaList(medList);
        });
      })
  }

  const onChangeHandler = async (event) => {
    console.log('on file ', event.target.files);
    setSelectedFile(event.target.files[0]);
  }
  
  const fileUploadHandler = async (event) => {
    let options = { headers: { "Content-Type": "multipart/form-data", "Content-Transfer-Encoding": "base64" }, };
    const formData = new FormData();
    formData.append('File', selectedFile);
    formData.append('userId',userId);
    axios
      .post(config.backend.mediaUpload, formData, null)
      .then((res) => {
        console.log(' upload media results', res.data);
        setCardMessage(res.data.data.media_status);
        setCardStatus('Success');
        setShowA(true);
        setTimeout(() => {  
          console.log("Sleeping for media fetch"); 
          getMediaLibrary(userId).then((medList) => {
            setMediaList(medList);
          }); 
        }, 2000);     
      })
      .catch(function (error) {
        console.log(error);
        setCardMessage('Media Upload Failed');
        setCardStatus('Failure');
        setShowA(true);
      });
  }

  const radioOnChange = async (event) => {
    console.log('Radio button changed ', event)
    setChecked(true);
    setRadioValue(event);
    setSelectedMedia(event);
    setShow(true);
  }

  const handleClose = () => setShow(false);

  const createCard = async (event) => {
    let options = { headers: { "Content-Type": "application/json" }, };
    let body = { 'mediaKey': selectedMedia, 'cardName': name, 'websiteTitle': title, 'websiteURL': url }
    console.log('modalData ', name, ' ',title,' ', url);
    axios
      .post(config.backend.createCard, body, options)
      .then((res) => {
        console.log(' card create results', res.data);
        if (res.data.card_uri) {
          setCardStatus('Success');
          setCardMessage(res.data.card_uri)
        } else {
          setCardStatus('Failed');
          console.log('Error array ', res.data.error)
          setCardMessage(res.data.error.code + ' : ' + res.data.error.message)
        }
        setShow(false);
        setShowA(true);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  const toggleShowA = () => setShowA(false);

  return (
    <div>
      <h2>Twitter Media Library</h2>
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
                  <Toast show={showA} onClose={toggleShowA}>
                    <Toast.Header>
                      <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                      />
                      <strong className="me-auto">Media Notification</strong>
                      <small>{cardStatus}</small>
                    </Toast.Header>
                    <Toast.Body>{cardMessage}</Toast.Body>
                  </Toast>
                </Col>
              </Row>
            </Container>

            <Container fluid="md">
              <Row>
                <Col><input type="file" name="file" className="form-control" onChange={onChangeHandler} /></Col>
                <Col><button width="100%" type="button" className="btn btn-info" onClick={fileUploadHandler}>Upload File</button></Col>
              </Row>
              <Row><Col><p>Images/Video files are only allowed in the Twitter Media Library!</p></Col><Col><p></p></Col></Row>
              <Row md="auto"><p></p></Row>
              <Row md="auto">
                {mediaList && mediaList.map((media) => (
                  <div>
                    <Col>
                      <Card style={{ width: '12rem' }}>
                        <Card.Body>
                          <ToggleButton key={media.media_key} id={media.media_key} name={media.media_key} type="radio" variant="primary" checked={radioValue === media.media_key} value={media.media_key} onChange={(e) => radioOnChange(e.currentTarget.value)}>
                            Create Card
                          </ToggleButton>
                          <Card.Title>{media.file_name}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">{media.type}</Card.Subtitle>
                        </Card.Body>
                        <Card.Img className="photo" variant="bottom" src={media.media_url} />
                      </Card>

                      <Modal show={show} onHide={handleClose} value={selectedMedia}>
                        <Modal.Header closeButton>
                          <Modal.Title>Create Ads Card</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form onSubmit={createCard}>
                            <Form.Label>Media Key: {selectedMedia}</Form.Label>
                            <Form.Group className="mb-3" controlId="modalForm.ControlInput1">
                              <Form.Label>Card Name</Form.Label>
                              <Form.Control
                                type="text"
                                onChange={e => setName(e.target.value )}
                                placeholder=""
                                autoFocus
                              />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="modalForm.ControlInput2">
                              <Form.Label>Website Title</Form.Label>
                              <Form.Control
                                type="text"
                                onChange={e => setTitle(e.target.value )}
                                placeholder=""
                                autoFocus
                              />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="modalForm.ControlInput3">
                              <Form.Label>Website URL</Form.Label>
                              <Form.Control
                                type="text"
                                onChange={e => setUrl(e.target.value )}
                                placeholder=""
                                autoFocus
                              />
                            </Form.Group>

                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Cancel
                          </Button>
                          <Button variant="primary" onClick={createCard}>
                            Create Card
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Col>
                  </div>

                ))}
              </Row>
            </Container>


          </>

        }
      </div>
    </div>
  );

}


