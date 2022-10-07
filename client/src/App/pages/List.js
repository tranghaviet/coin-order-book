import React, { Component } from 'react';
import {io} from 'socket.io-client';

class List extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      bids: [],
      asks: [],
      datetime: '',
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    const socket = io('http://localhost:5000')
    socket.on('connect', () => console.log(socket.id))
    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 5000)
    })
    socket.on('time', (data) => {
      this.setState({datetime: data})
    })
    socket.on('orderbook', (res) => {
      this.setState({...res});
    })
    socket.on('disconnect', () => this.setState({datetime: 'server disconnected'}))

    // this.getList();
    // setInterval(() => {
    //   this.getList();
    // }, 1000);
  }

  // getList = () => {
  //   fetch('http://localhost:5000/api/getList', {
  //     credentials: "include",
  //     method: "GET",
  //     cache: "no-cache"
  //   })
  //
  //     .then(res => {
  //       return res.json()
  //     })
  //     .then(res => {
  //       this.setState({ bids: res.bids, asks: res.asks })
  //     })
  // }

  render() {
    const { bids, asks } = this.state;
    const totalBidValue = Math.round(bids.reduce((sum, bid) => sum + +bid[0] * bid[1], 0) * 100) / 100;
    const totalAskSize = Math.round(asks.reduce((sum, ask) => sum + +ask[1], 0) * 100) / 100;

    return (
      <div className="App">
        <h1>Server time {this.state.datetime}</h1>
        <table border={1}>
          <thead>
          <tr>
            <th>Size</th>
            <th width="200px">Bid</th>
            <th width="200px">Ask</th>
            <th>Size</th>
          </tr>
          </thead>
            {(bids.length && asks.length) ? (
                <tbody>
                  {bids.map((bid, index) => {
                    return (
                      <tr key={index}>
                        <td>{bid[1]}</td>
                        <td>{bid[0]}</td>
                        <td>{asks[index][0]}</td>
                        <td>{asks[index][1]}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td><b>Total Bid value</b></td>
                    <td>{totalBidValue}</td>
                    <td><b>Total Ask size</b></td>
                    <td>{totalAskSize}</td>
                  </tr>
                  <tr>
                    <td><b>Total Bid orders</b></td>
                    <td colSpan={3}>{bids.length}</td>
                  </tr>
                </tbody>
            ) : (
                <tbody>
                  <tr>
                    <td colSpan={4}>No records</td>
                  </tr>
                </tbody>
            )
            }
        </table>

      </div>
    );
  }
}

export default List;
