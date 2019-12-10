import firebase from "firebase";
import React, { Component } from "react";
import "./App.css";

const firebaseConfig = {
  apiKey: "AIzaSyBgQ5m6J2mHegGjv6pmO0QAoFovoX1F2JM",
  authDomain: "gaccha-bot.firebaseapp.com",
  databaseURL: "https://gaccha-bot.firebaseio.com",
  projectId: "gaccha-bot",
  storageBucket: "gaccha-bot.appspot.com",
  messagingSenderId: "155657260713",
  appId: "1:155657260713:web:1b5642c2c81287b1"
};

class App extends Component {
  state = {
    streams: {},
    username: ""
  };

  componentDidMount() {
    firebase.initializeApp(firebaseConfig);

    const usermatch = window.location.href.match(/\/c\/(.*)/i);
    if (!usermatch) return;

    const username = usermatch[1];

    firebase
      .database()
      .ref(`/viewers/${username}`)
      .once("value")
      .then(snapshot => {
        this.setState({
          streams: snapshot.val() || {},
          username
        });
      });
  }

  render() {
    const usermatch = window.location.href.match(/\/c\/(.*)/i);
    if (!usermatch || Object.keys(this.state.streams) < 1)
      return "Could not find user";

    const streams = this.state.streams;

    return (
      <React.Fragment>
        <h1>{this.state.username}'s Collection:</h1>
        {Object.keys(streams).map(streamKey => {
          const stream = streams[streamKey];
          return (
            <div key={streamKey}>
              <h3>On {streamKey}'s stream:</h3>
              <p>Last Opening: {new Date(stream.lastOpening).toString()}</p>
              <ul>
                {Object.keys(stream.inventory).map(key => (
                  <li key={key}>
                    {stream.inventory[key].name}: {stream.inventory[key].count}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

export default App;
