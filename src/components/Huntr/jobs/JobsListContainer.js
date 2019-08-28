import React from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { loadJobs } from '../../../actions/jobs'
import JobsList from './JobsList'
import JobsFormContainer from './JobsFormContainer'

class JobsListContainer extends React.PureComponent {
  queries = queryString.parse(this.props.location.search)

  state = {
    page: this.queries.page ? this.queries.page : 0,
    sortBy: this.queries.sortBy ? this.queries.sortBy : "title",
    search: this.props.companies ? this.props.companies.query.search : ''
  }

  componentDidMount() {
    console.log('this.props cdidMount:', this.props)
    const queries = queryString.parse(this.props.location.search)

    if (!queries.page) {
      const newState = {
        page: this.state.page,
        sortBy: this.state.sortBy,
      }
      this.props.loadJobs(newState)
    }
    else {
      this.props.loadJobs(queries)
    }
  }

  componentDidUpdate() {
    console.log('JOBLISTCONTAINER DidUpdate props.jobs:', this.props.jobs)
    console.log('JOBLISTCONTAINER DidUpdate state:', this.state)
    // 1: const { page, sortBy } = this.props.jobs.query
    const { page, sortBy } = this.state
    const condition2 = this.state.page !== page
    const condition1 = this.state.sortBy !== sortBy

    if (this.state.search === '') {
      if (condition1 || condition2) {
        const newState = {
          page: this.state.page,
          sortBy: this.state.sortBy,
        }

        this.props.loadJobs(newState)
      }
    }
  }

  OnPageChange = (event) => {
    console.log('event:', event)
    const { selected } = event;
    const { sortBy } = this.props.jobs.query
    // const pageAndSortByQueries = `/jobs?page=${selected}&sortBy=${sortBy}`
    const pageAndSortByQueries = `/jobs1?page=${selected}&sortBy=${sortBy}`

    this.setState({
      page: selected
    })

    this.props.history.push(pageAndSortByQueries)
  }

  OnSortChange = (event) => {
    const newSortBy = event.target.value
    const { page } = this.state
    // const pageAndSortByQueries = `/jobs?page=${page}&sortBy=${newSortBy}`
    const pageAndSortByQueries = `/jobs1?page=${page}&sortBy=${newSortBy}`

    this.setState({
      sortBy: newSortBy
    })   

    this.props.history.push(pageAndSortByQueries)
  }

  OnSearchChange = (event) => {
    this.setState({
      search: event.target.value
    })
  }

  OnSubmit = (event) => {
    event.preventDefault()
    this.props.loadJobs(this.state)
    if(this.state.search !== '') {
      this.props.history.push(
        // `/jobs?search=${this.state.search}`
        `/jobs1?search=${this.state.search}`
      )
    }
  }

  render() {
    console.log('this.props render:', this.props)
    return (
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ textTransform: "uppercase", fontSize: 20 }}>
          List of Jobs
        </h3>
        <JobsFormContainer />
        <JobsList
          jobs={this.props.jobs}
          OnPageChange={this.OnPageChange}
          OnSortChange={this.OnSortChange}
          OnSubmit={this.OnSubmit}
          OnSearchChange={this.OnSearchChange}
          jobTitle={this.state.search}
          sortBy={this.state.sortBy}
          currentPage={parseInt(this.state.page)}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    jobs: state.jobs
  }
}

export default connect(mapStateToProps, { loadJobs })(JobsListContainer)