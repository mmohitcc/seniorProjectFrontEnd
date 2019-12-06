/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from 'axios'

import Card from "components/Card/Card.jsx";
// import { thArray, tdArray } from "variables/Variables.jsx";


const thArray = ["Ticker", "Quantity", "Price", "Action", "Date"];
class TradesList extends Component {

  constructor(props){
    super(props);

    this.state = {
      data: [["", "", "", "", ""]],
    }
  }

  componentDidMount(){
    const axiosSp = axios.create({
      baseURL: 'https://seniorprojectu.herokuapp.com/graphql',
    });

    const getTrades = 
    `
    query{
        getTrades
        }
    `

    const tweetData = [];

    // loop through all the companies
    // this.state.companyList.map(company => {
    //     const companyTweets = 
    //     `
    //     query{
    //       recentTweets(ticker: "${company}"){
    //               tweet
    //               rating
    //           }
    //       }
    //     `

    //     axiosSp
    //     .post('', {query: companyTweets})
    //     .then(result  => {
    //       // this.setState({data: result})
    //       const tweets = result['data']['data']['recentTweets'];
    //     //   console.log(tweets)
    //       const a = tweets.map(a => {
    //         let b = []
    //         b.push(company)
    //         b.push(a.tweet)
    //         b.push(a.rating)
    //         tweetData.push(b)
    //       });
    //     //   console.log(tweetData);
          
    //     }
    //     );
    //     this.setState({data: tweetData})
    // });

    
    axiosSp
    .post('', {query: getTrades})
    .then(result  => {
        console.log(result);
      // this.setState({data: result})
      const tweets = result['data']['data']['getTrades'];
      console.log(tweets)
      const a = tweets.map(a => {
        let b = []
        b.push(a.ticker)
        b.push(a.qty)
        b.push(a.price_per_stock)
        b.push(a.side)
        b.push(a.date)

        tweetData.push(b)
      });
      console.log(tweetData);
      this.setState({data: tweetData})
    }
    );
  }

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Trades"
                category="Recently Executed Trades"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>

            {/* <Col md={12}>
              <Card
                plain
                title="Striped Table with Hover"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {tdArray.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col> */}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default TradesList;
