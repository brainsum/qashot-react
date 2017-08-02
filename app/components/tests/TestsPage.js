import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router';
import { fetchTests, fetchTestsByUrl, fetchTestsByPageAndLimit } from '../../actions/testsActions';
import { deleteTest, runTest } from "../../actions/testsActions";

@connect((store) => {
  return {
    isLoading: store.tests.fetching,
    deleting: store.tests.deleting,
    running: store.tests.running,
    tests: store.entities.tests,
    metadata_lifetimes: store.entities.metadata_lifetimes,
    list: store.tests.pages[store.tests.pagination.page],
    pagination: store.tests.pagination,
  };
})
export default class TestsPage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchTests());
  }

  runTest(id) {
    this.props.dispatch(runTest(id))
  }

  deleteTest(id) {
    this.props.dispatch(deleteTest(id))
  }

  static isEmpty(obj) {
    for(let prop in obj) {
      if(obj.hasOwnProperty(prop))
        return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  render() {
    return (
      <div>
        <h2>
          <strong>2 website</strong> comparsions (eg. Development VS Live)
        </h2>

        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Session name</th>
              <th>Last run</th>
              <th class="text-center">Tests Passed</th>
              <th class="text-center">Tests Failed</th>
              <th width="1%"></th>
              <th width="1%"></th>
            </tr>
          </thead>
          {this.renderTests()}
        </table>
        {this.renderPagination()}
        <Link to="/create-two-website-comparsion" class="btn btn-link btn-sm">
          + Add new session
        </Link>
      </div>
    );
  }

  renderTests() {
    const { isLoading, tests, running, deleting, list, pagination, metadata_lifetimes } = this.props;

    if (isLoading && !tests) {
      return (
        <tbody>
          <tr>
            <td colSpan="7" class="text-center">
              <div class="loading-spinner"></div>
            </td>
          </tr>
        </tbody>
      )
    }
    if (list) {
      return (
        <tbody>
          {list.map((testId, index) => {
            let test = tests[testId];
            return (
              <tr key={test.id}>
                <td>{(pagination.page - 1) * 10 + index + 1}</td>
                <td>
                  <Link to={`/two-website-comparsion/${test.id}`}>
                    {test.name}
                  </Link>
                </td>
                <td>{test.metadata_last_run.length > 0 ? metadata_lifetimes[test.metadata_last_run[0]].datetime : '-'}</td>
                <td class="text-center">{test.metadata_last_run.length > 0 ? metadata_lifetimes[test.metadata_last_run[0]].passed_count : '-'}</td>
                <td class="text-center">{test.metadata_last_run.length > 0 ? metadata_lifetimes[test.metadata_last_run[0]].failed_count : '-'}</td>
                <td>
                  {running[test.id] ? "Running..." :
                    <button class="btn btn-primary btn-sm" onClick={this.runTest.bind(this, test.id)}>
                      {test.metadata_last_run.length > 0 ? 'Re-run the test' : 'Run the test'}
                    </button>
                  }
                </td>
                <td>
                  {deleting[test.id] ? "Deleting..." :
                    <button class="btn btn-link btn-sm" onClick={this.deleteTest.bind(this, test.id)}>Delete</button>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      );
    }

    return null;
  }

  renderPagination() {
    const { pagination } = this.props;

    if (pagination.total_pages) {
      const dotDotDot = <li class="disabled"><a role="button" href="#" tabindex="-1" style="pointer-events:none;"><span aria-label="More">…</span></a></li>;

      let pageNumbers = [];
      for (let i = 1; i <= pagination.total_pages; i++) {
        pageNumbers.push(<li class={pagination.page == i ? 'page-item active' : 'page-item'} key={i} onClick={this.pagerGotoPageByNumber.bind(this, i, pagination.limit)}><a class="page-link" href="#">{i}</a></li>);
      }

      let previous, first, next, last;

      if (pagination.links.first) {
        first = (<li class="page-item">
          <a class="page-link" href="#" aria-label="First" onClick={this.pagerGotoPage.bind(this, pagination.links.first)}>
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">First</span>
          </a>
        </li>);
      }
      if (pagination.links.previous) {
        previous = (<li class="page-item">
          <a class="page-link" href="#" aria-label="Previous" onClick={this.pagerGotoPage.bind(this, pagination.links.previous)}>
            <span aria-hidden="true">‹</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>);
      }
      if (pagination.links.next) {
        next = (<li class="page-item">
          <a class="page-link" href="#" aria-label="Next" onClick={this.pagerGotoPage.bind(this, pagination.links.next)}>
            <span aria-hidden="true">›</span>
            <span class="sr-only">Next</span>
          </a>
        </li>);
      }
      if (pagination.links.last) {
        last = (<li class="page-item">
          <a class="page-link" href="#" aria-label="Last" onClick={this.pagerGotoPage.bind(this, pagination.links.last)}>
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Last</span>
          </a>
        </li>);
      }

      return (
        <nav aria-label="Page navigation for tests">
          <ul class="pagination justify-content-center">
            {first}
            {previous}
            {pageNumbers}
            {next}
            {last}
          </ul>
        </nav>
      );
    }

    return null;
  }

  pagerGotoPage(url) {
    this.props.dispatch(fetchTestsByUrl(url));
  }

  pagerGotoPageByNumber(number, limit) {
    this.props.dispatch(fetchTestsByPageAndLimit(number, limit));
  }
}
