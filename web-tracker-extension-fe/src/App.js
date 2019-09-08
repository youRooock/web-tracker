import React from "react";
import "./App.css";
import ReactMinimalPieChart from "react-minimal-pie-chart";
import truncate from "./utils/truncate";

export default class App extends React.Component {
  constructor() {
    super();
    this.MAX_WEBSITE_LENGTH = 15;
    this.state = {
      response: {
        websites: [],
        username: null
      }
    };
  }

  componentWillMount = () => {
    this.setState({
      response: {
        websites: [
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
            name: "stackoverflow.com",
            count: 25,
            color: "#FF00FF",
            percentage: 6.8
          }
        ],
        username: "iurii.khmelenko"
      }
    });
  }

  createContent = () => {
    let blocks = [];
    for (let i = 0; i < this.state.response.websites.length; i++) {
      let website = this.state.response.websites[i];
      blocks.push(
        <div className="result-line">
          <div
            className="info bullet"
            style={{ backgroundColor: website.color }}
          ></div>
          <div className="info">{truncate(website.name, this.MAX_WEBSITE_LENGTH)}</div>
          <div className="info stats">({website.count})</div>
        </div>
      );
    }

    return blocks;
  };

  createChartData = () => {
    let chartData = [];

    for (let i = 0; i < this.state.response.websites.length; i++) {
      let website = this.state.response.websites[i];
      chartData.push({
        title: website.name,
        value: website.percentage,
        color: website.color
      });
    }
    return chartData;
  };

  render() {
    return (
      <div className="App">
        <div>{this.state.response.username}</div>
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
}
