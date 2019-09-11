import React from "react";
import "./App.css";
import ReactMinimalPieChart from "react-minimal-pie-chart";
import truncate from "./utils/truncate";
import compare from "./utils/compare";

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
    let db;
    let dbReq = indexedDB.open("web-tracker-db", 1);

    dbReq.onsuccess = event => {
      db = event.target.result;
      const tx = db.transaction(["web-links-count"], "readwrite");
      const store = tx.objectStore("web-links-count");

      const date = new Date();
      const today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

      const request = store.get(today);
      request.onsuccess = () => {
        request.result.urls.sort(compare);
        console.log(request.result.urls)
        const urls = request.result.urls.slice(0,5);
        console.log(urls)
        const sum = urls.reduce((x,y) => x.count + y.count, 0);
        const sites = []

        for (let index = 0; index < urls.length; index++) {
          const element = urls[index];
          
          sites.push({name: element.url, count: element.count, color: "#E38627", percentage: element.count * 100 / sum});
        }

        this.setState({
          response: {
            websites: sites,
            username: "iurii.khmelenko"
          }
        });
      }
    };
  };

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
          <div className="info">
            {truncate(website.name, this.MAX_WEBSITE_LENGTH)}
          </div>
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
