import React, { Component } from 'react';
import api from './utils/api';
import isLocalHost from './utils/isLocalHost';
import './App.css';

export default class App extends Component {
  state = {
    counts: []
  }
  componentDidMount() {
    // Fetch all todos
    api.readAll().then((counts) => {
      if (counts.message === 'unauthorized') {
        if (isLocalHost()) {
          alert('FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info')
        } else {
          alert('FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct')
        }
        return false
      }

      console.log('all counts', counts)
      this.setState({
        counts: counts
      })
    })
  }
  renderCounts() {
    const { counts } = this.state
    
    if (!counts || !counts.length) {
      return null
    }

    return counts.map((count, i) => {
      const { data, ref } = count
      const id = getCountId(count)
      let countTs
      if (ref) {
        countTs = (
          <span>{count.ts}</span>
        )
      }
      return (
        <div key={i}>
          <span>count.data["stackoverflow.com"] = {data["stackoverflow.com"]}</span><br></br>
          <span>count.ts = {countTs}</span><br></br>
          <span>count.id = {id}</span>
        </div>
      )
    })
  }
  render() {
    return (
      <div>
        {this.renderCounts()}
      </div>
    );
  }
}

function getCountId(count) {
  if (!count.ref) {
    return null
  }
  return count.ref['@ref'].id
}
