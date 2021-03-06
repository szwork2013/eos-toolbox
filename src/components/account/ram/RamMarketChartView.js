import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Background from './RamBackground'
import RamPrice from './RamPrice'
import sizeMe from 'react-sizeme'
import '../../../styles/components/account/ram/RamMarketChartView.scss'

class RamMarketChartView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    fetch('https://api.coindesk.com/v1/bpi/historical/close.json')
      .then(res => {
        return res.json()
      })
      .then(json => {
        this.setState({
          data: json
        })
      })
  }
  render() {
    const { size } = this.props
    const { data } = this.state
    const width = Math.floor(size.width)

    return (
      <div className="col-sm-12">
        <div className="row">
          <div className="card statustic-card">
            <div className="app">
              <div className="center">
                <RamPrice data={data} width={width} height={600} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default sizeMe()(RamMarketChartView)
