import React from "react";
import "./App.css";
import ReactMinimalPieChart from "react-minimal-pie-chart";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      response: []
    };
  }

  componentWillMount = () => {
    this.setState({
      response: [
        {
          name: "amazon.com",
          count: 123,
          color: "#E38627",
          percentage: 33.4
        },
        {
          name: "google.com",
          count: 100,
          color: "#C13C37",
          percentage: 27.2
        },
        {
          name: "rambler.ru",
          count: 70,
          color: "#FF1493",
          percentage: 19
        },
        {
          name: "dou.ua",
          count: 50,
          color: "#F4A460",
          percentage: 13.6
        },
        {
          name: "habr.com",
          count: 25,
          color: "#FF00FF",
          percentage: 6.8
        }
      ]
    }, () => { console.log(this.state.response)});
}

  createContent = () => {
    let blocks = [];
    console.log(this.state.response);
    for (let i = 0; i < this.state.response.length; i++) {
      blocks.push(
        <div className="result-line">
          <div
            className="info bullet"
            style={{ backgroundColor: this.state.response[i].color }}
          ></div>
          <div className="info">{this.state.response[i].name}</div>
          <div className="info stats">({this.state.response[i].count})</div>
        </div>
      );
    }

    return blocks;
  };

  createChartData = () => {
    let chartData = [];

    for (let i = 0; i < this.state.response.length; i++) {
      chartData.push({
        title: this.state.response[i].name,
        value: this.state.response[i].percentage,
        color: this.state.response[i].color
      });
    }
    return chartData;
  };

  render() {
    return (
      <div className="App">
        <div>y.khmelenko</div>
        <ReactMinimalPieChart
          data={this.createChartData()}
          lineWidth={15}
          paddingAngle={5}
        />
        <br></br>
        {this.createContent()}
      </div>
    );
  }

  // state = { email: "", count: 0 };
  // constructor() {
  //   super();
  //   window.chrome.extension.sendMessage({}, response => {
  //     if (response.email) {
  //       this.setState({ email: response.email });
  //     } else {
  //       console.log("Couldn't get email address of profile user.");
  //     }
  //   });
  // }

  // handleClick = () => {
  //   this.setState({ count: ++this.state.count });
  // };

  // render() {
  //   return (
  //     <div className="App">
  //       <header className="App-header">
  //         {/* <img src={logo} className="App-logo" alt="logo" /> */}
  //         <p>{this.state.email}</p>
  //         <p>{this.state.count}</p>
  //         <button onClick={this.handleClick}> eat me </button>
  //         <a
  //           className="App-link"
  //           href="https://reactjs.org"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           Learn React
  //         </a>
  //       </header>
  //     </div>
  //   );
  // }
}
