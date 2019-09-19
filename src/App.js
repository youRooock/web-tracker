import React from "react";
import "./App.css";
import ReactMinimalPieChart from "react-minimal-pie-chart";
import truncate from "./utils/truncate";

const STORE_NAME = "web-links";
const DB_NAME = "web-tracker-db";
const MAX_WEBSITE_LENGTH = 15;
const COLORS = ["#8B0000", "#FFD700", "#FFDAB9", "#228B22", "#00FFFF"];

export default class App extends React.Component {
  state = {
    response: {
      websites: []
    }
  };

  componentWillMount = () => {
    let db;
    let dbReq = indexedDB.open(DB_NAME, 1);

    dbReq.onsuccess = event => {
      db = event.target.result;
      const tx = db.transaction([STORE_NAME], "readwrite");
      const store = tx.objectStore(STORE_NAME);

      const date = new Date();
      const today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

      const request = store.get(today);
      request.onsuccess = () => {
        const urls = request.result.urls
          .sort((a, b) => b.elapsedTime - a.elapsedTime)
          .slice(0, 5);
        const sum = urls.reduce((x, y) => x + y.elapsedTime, 0);
        const sites = urls.map((element, i) => {
          return {
            name: element.url,
            elapsedTime: element.elapsedTime,
            color: COLORS[i],
            percentage: (element.elapsedTime * 100) / sum
          }
        });

        this.setState({
          response: {
            websites: sites
          }
        });
      };
    };
  };

  createContent = () => {
    return this.state.response.websites.map(site => {
      return (
        <div className="result-line">
          <div
            className="info bullet"
            style={{ backgroundColor: site.color }}
          ></div>
          <div className="info">
            {truncate(site.name, MAX_WEBSITE_LENGTH)}
          </div>
          <div className="info stats">
            ({Math.round(site.elapsedTime / 60)})
          </div>
        </div>
      );
    });
  };

  createChartData = () => {
    return this.state.response.websites.map(site => {
      return {
        title: site.name,
        value: site.percentage,
        color: site.color
      };
    });
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
