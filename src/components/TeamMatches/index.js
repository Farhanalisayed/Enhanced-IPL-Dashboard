import {Component} from 'react'
import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

import './index.css'

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamMatchesData: {},
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getFormattedData = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`${teamMatchesApiUrl}${id}`)
    const fetchedData = await response.json()
    const formattedData = {
      teamBannerURL: fetchedData.team_banner_url,
      latestMatch: this.getFormattedData(fetchedData.latest_match_details),
      recentMatches: fetchedData.recent_matches.map(eachMatch =>
        this.getFormattedData(eachMatch),
      ),
    }

    this.setState({teamMatchesData: formattedData, isLoading: false})
  }

  renderPieChart = () => {
    const {teamMatchesData} = this.state
    let noOfWins = 0
    let noOfDraws = 0
    let noOfLosses = 0
    const data = teamMatchesData.recentMatches.map(each => each.matchStatus)
    data.forEach(each => {
      if (each === 'Won') {
        noOfWins += 1
      } else if (each === 'Lost') {
        noOfLosses += 1
      } else {
        noOfDraws += 1
      }
    })
    const pieData = [
      {name: 'WON', value: noOfWins},
      {name: 'LOST', value: noOfLosses},
      {name: 'DRAWN', value: noOfDraws},
    ]
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
            label="name"
          >
            <Cell name="WON" fill="#fecba6" />
            <Cell name="LOST" fill="#b3d23f" />
            <Cell name="DRAWN" fill="#a44c9e" />
          </Pie>
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  renderRecentMatchesList = () => {
    const {teamMatchesData} = this.state
    const {recentMatches} = teamMatchesData

    return (
      <div className="recent-back">
        <ul className="recent-matches-list">
          {recentMatches.map(recentMatch => (
            <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
          ))}
        </ul>
        <Link to="/">
          {' '}
          <button type="button" className="back-btn">
            Back
          </button>
        </Link>
      </div>
    )
  }

  renderTeamMatches = () => {
    const {teamMatchesData} = this.state
    const {teamBannerURL, latestMatch} = teamMatchesData

    return (
      <div className="responsive-container">
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <LatestMatch latestMatchData={latestMatch} />
        {this.renderPieChart()}
        {this.renderRecentMatchesList()}
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} />
    </div>
  )

  getRouteClassName = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  render() {
    const {isLoading} = this.state
    const className = `team-matches-container ${this.getRouteClassName()}`

    return (
      <div className={className}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
