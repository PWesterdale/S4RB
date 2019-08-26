import React, { Component } from 'react'
import Filter from './Filter'

import { getComplaints } from '../services/complaints'

class App extends Component {
    state = {
        complaints: [],
        loading: true,
        filter: 'byMonth',
    }
    setFilter = async filter => {
        this.setState({
            filter,
            complaints: [],
            loading: true,
        })
        const complaints = await getComplaints(filter)
        this.setState({ complaints, loading: false })
    }
    componentDidMount = async () => {
        const complaints = await getComplaints()
        this.setState({ complaints, loading: false })
    }
    render() {
        return (
            <React.Fragment>
                <div className="header">
                    <h2>Complaints per million units</h2>
                    <Filter
                        loading={this.state.loading}
                        active={this.state.filter}
                        setFilter={this.setFilter}
                    />
                    <a
                        href={`/complaints?filter=${this.state.filter}&format=csv`}
                    >
                        CSV
                    </a>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                {this.state.filter === 'byMonth'
                                    ? 'Month'
                                    : 'Quarter'}
                            </th>
                            <th>Complaints</th>
                            <th>Units Sold</th>
                            <th>CPMU</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.complaints.map(c => {
                            return this.state.filter === 'byMonth' ? (
                                <tr key={c.Month}>
                                    <td>{c.Month}</td>
                                    <td>{c.Complaints}</td>
                                    <td>{c.UnitsSold}</td>
                                    <td>{c.CPMU}</td>
                                </tr>
                            ) : (
                                <tr key={c.Quarter}>
                                    <td>{c.Quarter}</td>
                                    <td>{c.Complaints}</td>
                                    <td>{c.UnitsSold}</td>
                                    <td>{c.CPMU}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}

export default App
