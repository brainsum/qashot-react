import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router';
//import { push } from 'react-router-redux';

import { fetchTests, fetchTestsByUrl, fetchTestsByPageAndLimit } from '../../actions/testsActions';
import { deleteTest, runTest } from "../../actions/testsActions";

@connect((store) => {
  return {
    isLoading: store.tests.fetching,
    deleting: store.tests.deleting,
    running: store.tests.running,
    tests: store.tests.tests.data,
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
    const { isLoading, tests, running, deleting } = this.props;

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
    if (tests) {
      return (
        <tbody>
          {tests.entity.map((test, index) => (
            <tr key={test.id[0].value}>
              <td>{(tests.pagination.page - 1) * 10 + index + 1}</td>
              <td>
                <Link to={`/two-website-comparsion/${test.id[0].value}`}>
                  {test.name[0].value}
                </Link>
              </td>
              <td>{test.metadata_last_run.length > 0 ? test.metadata_last_run[0].datetime : '-'}</td>
              <td class="text-center">{test.metadata_last_run.length > 0 ? test.metadata_last_run[0].passed_count : '-'}</td>
              <td class="text-center">{test.metadata_last_run.length > 0 ? test.metadata_last_run[0].failed_count : '-'}</td>
              <td>
                {running[test.id[0].value] ? "Running..." :
                  <button class="btn btn-primary btn-sm" onClick={this.runTest.bind(this, test.id[0].value)}>
                    {test.metadata_last_run.length > 0 ? 'Re-run the test' : 'Run the test'}
                  </button>
                }
              </td>
              <td>
                {deleting[test.id[0].value] ? "Deleting..." :
                  <button class="btn btn-link btn-sm" onClick={this.deleteTest.bind(this, test.id[0].value)}>Delete</button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      );
    }

    return null;
  }

  renderPagination() {
    const { tests } = this.props;

    if (tests) {
      const dotDotDot = <li class="disabled"><a role="button" href="#" tabindex="-1" style="pointer-events:none;"><span aria-label="More">…</span></a></li>;

      let pageNumbers = [];
      for (let i = 1; i <= tests.pagination.total_pages; i++) {
        pageNumbers.push(<li class={tests.pagination.page == i ? 'page-item active' : 'page-item'} key={i} onClick={this.pagerGotoPageByNumber.bind(this, i, tests.pagination.limit)}><a class="page-link" href="#">{i}</a></li>);
      }

      let previous, first, next, last;

      if (tests.pagination.links.first) {
        first = (<li class="page-item">
          <a class="page-link" href="#" aria-label="First" onClick={this.pagerGotoPage.bind(this, tests.pagination.links.first)}>
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">First</span>
          </a>
        </li>);
      }
      if (tests.pagination.links.previous) {
        previous = (<li class="page-item">
          <a class="page-link" href="#" aria-label="Previous" onClick={this.pagerGotoPage.bind(this, tests.pagination.links.previous)}>
            <span aria-hidden="true">‹</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>);
      }
      if (tests.pagination.links.next) {
        next = (<li class="page-item">
          <a class="page-link" href="#" aria-label="Next" onClick={this.pagerGotoPage.bind(this, tests.pagination.links.next)}>
            <span aria-hidden="true">›</span>
            <span class="sr-only">Next</span>
          </a>
        </li>);
      }
      if (tests.pagination.links.last) {
        last = (<li class="page-item">
          <a class="page-link" href="#" aria-label="Last" onClick={this.pagerGotoPage.bind(this, tests.pagination.links.last)}>
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
