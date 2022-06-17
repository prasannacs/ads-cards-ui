import config from '../config.js'

const axios = require("axios").default;

export function requestTwitterToken(path) {
    let options = {
        headers: { "Content-Type": "application/json" },
    };
    return new Promise(function (resolve, reject) {
      let url = config.backend.requestToken;
      if(path)
        url = url+'?path='+path;
        console.log('url ',url);
        axios
            .get(url, null, options)
            .then((res) => {
                console.log('Response token', res.data);
                resolve(res.data.oauth_token);
            })
            .catch(function (error) {
                console.log(error);
                reject(error);
            });
    })
}

export function getAccessTokens(oauth_verifier, oauth_token) {
    console.log('getAccessTokens ', oauth_verifier, ' -- ', oauth_token);
    let options = {
      headers: { "Content-Type": "application/json" },
    };
    let url = config.backend.accessTokens + '?oauth_verifier=' + oauth_verifier + '&oauth_token=' + oauth_token;
    return new Promise(function (resolve, reject) {
      axios
        .get(url, null, options)
        .then((res) => {
          console.log(' getAccessTokens Response token', res.data);
          resolve(res.data);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    })
  }

export function getMediaLibrary(userId) {
    console.log('getMediaLib ',userId);
    let options = { headers: { "Content-Type": "application/json" } };
    let url = config.backend.mediaLibrary + '?user_id=' + userId;
    return new Promise(function (resolve, reject) {
      axios
        .get(url, null, options)
        .then((res) => {
          console.log(' getMediaLibrary results', res.data);
          resolve(res.data);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    })

  }


