import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import Iframe from 'react-iframe'
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
        // const weightData = result["data"]["data"]["RecentWeights"];
        // console.log("logging weight data");
        // console.log(weightData);
        // // let posis = [];
        // // let labels = [];
        // weightData.map(a => {
        //   console.log("printing a");
        //   console.log(a);
        //   let rsi = this.state.rsiWeight;
        //   let bollinger = this.state.bollingerWeight;
        //   let fourWeightc = this.state.fourWeight;
        //   let twitterWeightc = this.state.twitterWeight;
        //   let companyWeightc = this.state.companyWeight;
        //   let awr = this.state.avgWeightLineRSI;
        //   let awB = this.state.avgWeightLineBollinger;
        //   let awf = this.state.avgWeightLineFourCandle;
        //   let awt = this.state.avgWeightLineRSITwitter;
        //   let awc = this.state.avgWeightLineRSICompany;
        //     rsi += parseInt(a.movingWeight);
        //     bollinger += parseInt(a.profitWeight);
        //     twitterWeightc += parseInt(a.twitterWeight);
        //     fourWeightc += parseInt(a.fourWeight);
        //     companyWeightc += parseInt(a.companyWeight);
        //     awr.push(rsi)
        //     // labels.push(a.symbol)
        //     this.setState({rsiWeight: rsi,
        //     bollingerWeight: bollinger,
        //     fourWeight: fourWeightc,
        //     twitterWeight: twitterWeightc,
        //     companyWeight: companyWeightc,
        //     });
        //     this.setState({
        //       weightLabels: [`RSI ${(rsi / count).toFixed(2)}`, `Bollinger Bands ${(bollinger / count).toFixed(2)}`, `Four Candle ${(fourWeightc / count).toFixed(2)}`, `Twitter ${(twitterWeightc / count).toFixed(2)}`, `Company ${(companyWeightc / count).toFixed(2)}` ]
        //     })
        //     console.log("state.rsi")
        //     console.log(this.state.rsiWeight / count);
        // });
    })

    // console.log(rsi);
    // console.log("printing avg");
    // console.log(rsi / count);
      
    })



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
              <Col md={12}>
              <Iframe url="https://stocktradingdashboard.herokuapp.com/"
        width="100%"
        height="2000px"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"/>
              </Col>
          </Row>

        </Grid>
      </div>
    );
  }
}

export default Dashboard;
