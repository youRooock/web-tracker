import React from "react";
import "./App.css";
import ReactMinimalPieChart from "react-minimal-pie-chart";
import truncate from "./utils/truncate";
import compare from "./utils/compare";

export default class App extends React.Component {
  constructor() {
    super();
    this.linksStore = "web-links";
    this.MAX_WEBSITE_LENGTH = 15;
    this.colors = ["#8B0000", "#FFD700", "#FFDAB9", "#228B22", "#00FFFF"];
    this.state = {
      response: {
        websites: []
      }
    };
  }

  componentWillMount = () => {
    let db;
    let dbReq = indexedDB.open("web-tracker-db", 1);

    dbReq.onsuccess = event => {
      db = event.target.result;
      const tx = db.transaction([this.linksStore], "readwrite");
      const store = tx.objectStore(this.linksStore);

      const date = new Date();
      const today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

      const request = store.get(today);
      request.onsuccess = () => {
        request.result.urls.sort(compare);
        const urls = request.result.urls.slice(0,5);
        const sum = urls.reduce((x,y) => x + y.elapsedTime, 0);
        const sites = []

        for (let index = 0; index < urls.length; index++) {
          const element = urls[index];
          
          sites.push({name: element.url, elapsedTime: element.elapsedTime, color: this.colors[index], percentage: element.elapsedTime * 100 / sum});
        }

        this.setState({
          response: {
            websites: sites
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
          <div className="info stats">({Math.round(website.elapsedTime / 60)})</div>
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
