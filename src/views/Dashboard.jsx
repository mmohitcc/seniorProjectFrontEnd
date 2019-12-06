import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import axios from 'axios'
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import TweetList from "./TweetList";
import CurrentPositions from './CurrentPositions';
// import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";
import { get } from "https";
import { requiredSubselectionMessage } from "graphql/validation/rules/ScalarLeafs";
import { number } from "prop-types";

class Dashboard extends Component {

  constructor(props){

    super(props);

    this.state = {
      tweetCount: 0,
      accountData: {},
      piDataPositions: {
        labels: ["40%", "20%", "40%"],
        series: [40, 20, 40]
      },
      tickers: ["TSLA", "AMZN", "WMT", "AAPL", "JNJ", "GOOG", "XOM", "GE", "JPM"],
      rsiWeight: 0,
      bollingerWeight: 0,
      fourWeight: 0,
      twitterWeight: 0,
      companyWeight: 0,
      weightLabels: ["RSI", "Bollinger Bands", "Four Candle", "Twitter", "Company" ],
      avgWeightLineRSI: [],
      avgWeightLineBollinger: [],
      avgWeightLineFourCandle: [],
      avgWeightLineRSITwitter: [],
      avgWeightLineRSICompany: [],
    }

  }

  setNumberOfTweets(count){
    this.setState({
      tweetCount: count,
    })
  };

  componentDidMount(){

    const axiosSp = axios.create({
      baseURL: 'https://seniorprojectu.herokuapp.com/graphql',
    });

    const getData = `
    query{pricesUniverse { ticker openPrice closePrice bull}}
    `;




    const getTweets = 
    `
    query{
      recentTweets(ticker:"Amazon"){
              tweet
            rating
          }
      }
    `


    // for weights chart of single graph
    const weights = `
    query{
      RecentWeights(ticker: "TSLA", count: 15) {
          ticker
          fourWeight
          profitWeight
          twitterWeight
          movingWeight
          companyWeight
          date
      }
  }
`;

    const positions = `
      query{
        GetPositions {
          ticker
        }
      }
    `;

    const tweetCount = `
    query{
      TweetCount
    }
    `;

    const getAccount = `
    query{
      getAccount
    }
    `;

    const pricePagination = `
      query{
        pricePagination(page: 1, perPage: 20, sort: DATE_ASC) {
          count
          items {
            ticker
          }
        }
      }
    `;

    const getPositions = `
    query{
      getPositions
    } 
    `
    

    const getWeight = 
    `query{
      MostRecentWeight(ticker:"TSLA"){
        ticker
        twitterWeight
        fourWeight
        profitWeight
        movingWeight
        companyWeight
      }
    }
    `

    const tweetMany = 
    `query{
      tweetMany(filter:{company:"GOOGL"}){
      company
      tweet
      rating
    }
  }
    `;


    const count = 15 * 9;
    this.state.tickers.map(ticker => {

            const RecentWeights = `
      query{
        RecentWeights(ticker: "${ticker}", count: 15) {
            ticker
            fourWeight
            profitWeight
            twitterWeight
            movingWeight
            companyWeight
            date
        }
    }
  `;
      axiosSp
      .post('', {query: RecentWeights})
      .then(result => {
        const weightData = result["data"]["data"]["RecentWeights"];
        console.log("logging weight data");
        console.log(weightData);
        // let posis = [];
        // let labels = [];
        weightData.map(a => {
          console.log("printing a");
          console.log(a);
          let rsi = this.state.rsiWeight;
          let bollinger = this.state.bollingerWeight;
          let fourWeightc = this.state.fourWeight;
          let twitterWeightc = this.state.twitterWeight;
          let companyWeightc = this.state.companyWeight;
          let awr = this.state.avgWeightLineRSI;
          let awB = this.state.avgWeightLineBollinger;
          let awf = this.state.avgWeightLineFourCandle;
          let awt = this.state.avgWeightLineRSITwitter;
          let awc = this.state.avgWeightLineRSICompany;
            rsi += parseInt(a.movingWeight);
            bollinger += parseInt(a.profitWeight);
            twitterWeightc += parseInt(a.twitterWeight);
            fourWeightc += parseInt(a.fourWeight);
            companyWeightc += parseInt(a.companyWeight);
            // labels.push(a.symbol)
            this.setState({rsiWeight: rsi,
            bollingerWeight: bollinger,
            fourWeight: fourWeightc,
            twitterWeight: twitterWeightc,
            companyWeight: companyWeightc,
            });
            this.setState({
              weightLabels: [`RSI ${(rsi / count).toFixed(2)}`, `Bollinger Bands ${(bollinger / count).toFixed(2)}`, `Four Candle ${(fourWeightc / count).toFixed(2)}`, `Twitter ${(twitterWeightc / count).toFixed(2)}`, `Company ${(companyWeightc / count).toFixed(2)}` ]
            })
            console.log("state.rsi")
            console.log(this.state.rsiWeight / count);
        });
    })

    // console.log(rsi);
    // console.log("printing avg");
    // console.log(rsi / count);
      
    })

    


    axiosSp
    .post('', {query: getPositions})
    .then(result => {
      this.setState({positionData: result["data"]["data"]["getPositions"]});
      const positionsData = result["data"]["data"]["getPositions"];
      let totalValue = 0;
      let posis = [];
      let labels = [];
      positionsData.map(a => {
          posis.push(a.market_value)
          labels.push(a.symbol)
      });

      let posisData = this.state.piDataPositions;
      posisData.series = posis;
      posisData.labels = labels;
      this.setState({piDataPositions: posisData});
      console.log("inside here")
      console.log(posis);
      console.log(labels);
      console.log(this.state.positionData);
    });


    axiosSp
    .post('', {query: getAccount})
    .then(result => {
      this.setState({accountData: result["data"]["data"]["getAccount"]});
      console.log(this.state.accountData);
    });

    let numberOfTweets = 0;
    axiosSp
    .post('', {query: tweetCount})
    .then(result => {
      numberOfTweets = result["data"]["data"]["TweetCount"]
      this.setNumberOfTweets(numberOfTweets);
      console.log(numberOfTweets);
    });

    
    
    // this.setState({tweetCount: numberOfTweets});

    axiosSp
    .post('', {query: pricePagination})
    .then(result => console.log(result));


    // const client = new ApolloClient({
    //   uri: 'https://seniorprojectu.herokuapp.com/graphql',
    //   fetchOptions: {
    //     mode: "no-cors",
    //     headers: { 'Content-Type': 'application/json' },
		// 	},
    // })

    // client
    // .query({
    //   query: gql`
    //     query{pricesUniverse {ticker openPrice closePrice}}
    //   `
    // })
    // .then(result => console.log(result));
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  render() {

    function portfolioValue(equity){
      const pl = equity - 100000;
        return pl.toFixed(2);
    }

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Portfolio Value"
                statsValue={this.state.accountData.last_equity}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-dollar text-danger" />}
                statsText="Profit"
                statsValue={portfolioValue(this.state.accountData.last_equity)}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Today"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Trades"
                statsValue= {this.state.accountData.daytrade_count}
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="All Time"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText="Tweets Analyzed"
                statsValue={this.state.tweetCount}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
                < CurrentPositions />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Portfolio"
                category="Portfolio Split"
                stats=""
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={this.state.piDataPositions} type="Pie" />
                  </div>
                }
              />
            </Col>
            <Col md={6}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Machine Learning Weights"
                category="Machine Learning Weight Split"
                stats=""
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={{labels: this.state.weightLabels, series: [this.state.rsiWeight, this.state.bollingerWeight, this.state.fourWeight ,this.state.twitterWeight, this.state.companyWeight]}} type="Pie" />
                  </div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Portfolio Value"
                category="All time performance"
                stats="Updated 3 minutes ago"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataSales}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Portfolio Value"
                category="All time performance"
                stats="Updated 3 minutes ago"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataSales}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Portfolio Value"
                category="All time performance"
                stats="Updated 3 minutes ago"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataSales}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Machine Learning Statistics"
                category="Last Campaign Performance"
                stats="Campaign sent 2 days ago"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={dataPie} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendPie)}</div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="Profit Loss"
                category="Top 10 stocks"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>

            {/* <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col> */}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
