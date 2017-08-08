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
    listAB: store.tests.pagesAB[store.tests.paginationAB.page],
    paginationAB: store.tests.paginationAB,
    listBA: store.tests.pagesBA[store.tests.paginationBA.page],
    paginationBA: store.tests.paginationBA,
  };
})
export default class TestsPage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchTests('a_b'));
    this.props.dispatch(fetchTests('before_after'));
  }

  runTest(id, stage) {
    this.props.dispatch(runTest(id, stage))
  }

  deleteTest(id, type) {
    this.props.dispatch(deleteTest(id, type))
  }

  render() {
    const { paginationAB, paginationBA } = this.props;

    return (
      <div>
        <div>
          <h2>
            <strong>2 website</strong> comparsions (eg. Development VS Live)
          </h2>

          <table class="table table-striped type--a-b">
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
            {this.renderABTests()}
          </table>
          {this.renderPagination(paginationAB, "a_b")}
          <Link to="/create-two-website-comparsion" class="btn btn-link btn-sm">
            + Add new session
          </Link>
        </div>
        <div>
          <h2>
            <strong>BEFORE and AFTER</strong> comparison of 1 website
          </h2>

          <table class="table table-striped type--before-after">
            <thead>
              <tr>
                <th>#</th>
                <th>Session name</th>
                <th>"Before" shots</th>
                <th>"After" shots</th>
                <th class="text-center">Tests Passed</th>
                <th class="text-center">Tests Failed</th>
                <th width="1%"></th>
              </tr>
            </thead>
            {this.renderBATests()}
          </table>
          {this.renderPagination(paginationBA, "before_after")}
          <Link to="/create-two-website-comparsion" class="btn btn-link btn-sm">
            + Add new session
          </Link>
        </div>
      </div>
    );
  }

  renderABTests() {
    const { tests, running, deleting, listAB, paginationAB, metadata_lifetimes } = this.props;

    if (!listAB) {
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

    if (listAB) {
      if (listAB.length === 0) {
        return (
          <tbody>
            <tr><td colSpan="7">There's no saved tests!</td></tr>
          </tbody>
        )
      }

      return (
        <tbody>
          {listAB.map((testId, index) => {
            let test = tests[testId];
            return (
              <tr key={test.id}>
                <td>{(paginationAB.page - 1) * 10 + index + 1}</td>
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
                    <button class="btn btn-primary btn-sm" onClick={this.runTest.bind(this, test.id, '')}>
                      {test.metadata_last_run.length > 0 ? 'Re-run the test' : 'Run the test'}
                    </button>
                  }
                </td>
                <td>
                  {deleting[test.id] ? "Deleting..." :
                    <button class="btn btn-link btn-sm" onClick={this.deleteTest.bind(this, test.id, 'a_b')}>Delete</button>
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

  renderBATests() {
    const { tests, running, deleting, listBA, paginationBA, metadata_lifetimes } = this.props;

    if (!listBA) {
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

    if (listBA) {
      if (listBA.length === 0) {
        return (
          <tbody>
            <tr><td colSpan="7">There's no saved tests!</td></tr>
          </tbody>
        )
      }

      return (
        <tbody>
        {listBA.map((testId, index) => {
          let test = tests[testId];
          let lastReference = {}, lastTest = {};

          lastReference = metadata_lifetimes[test.metadata_last_run[0]];
          lastTest = metadata_lifetimes[test.metadata_last_run[1]];

          return (
            <tr key={test.id}>
              <td>{(paginationBA.page - 1) * 10 + index + 1}</td>
              <td>
                <Link to={`/two-website-comparsion/${test.id}`}>
                  {test.name}
                </Link>
              </td>
              <td>
                {!jQuery.isEmptyObject(lastReference) ? lastReference.datetime : '-'}
                {running[test.id] ? "Running..." :
                  <button class="btn btn-primary btn-sm" onClick={this.runTest.bind(this, test.id, 'reference')}>
                    {!jQuery.isEmptyObject(lastReference) ? 'Recreate shots' : 'Create shots'}
                  </button>
                }
              </td>
              {!jQuery.isEmptyObject(lastReference) ? (
                <td>
                  {!jQuery.isEmptyObject(lastTest) ? lastTest.datetime : '-'}
                  {running[test.id] ? "Running..." :
                    <button class="btn btn-primary btn-sm" onClick={this.runTest.bind(this, test.id, 'after')}>
                      {!jQuery.isEmptyObject(lastTest) ? 'Re-run the test' : 'Run the test'}
                    </button>
                  }
                </td>
              ) : (
                  <td>-</td>
              )}
              <td class="text-center">{!jQuery.isEmptyObject(lastTest) ? lastTest.passed_count : '-'}</td>
              <td class="text-center">{!jQuery.isEmptyObject(lastTest) ? lastTest.failed_count : '-'}</td>
              <td>
                {deleting[test.id] ? "Deleting..." :
                  <button class="btn btn-link btn-sm" onClick={this.deleteTest.bind(this, test.id, 'before_after')}>Delete</button>
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

  renderPagination(pagination, type) {
    if (pagination.total_pages) {
      const dotDotDot = <li class="disabled"><a role="button" href="#" tabindex="-1" style="pointer-events:none;"><span aria-label="More">…</span></a></li>;

      let pageNumbers = [];
      for (let i = 1; i <= pagination.total_pages; i++) {
        pageNumbers.push(<li class={pagination.page == i ? 'page-item active' : 'page-item'} key={i} onClick={this.pagerGotoPageByNumber.bind(this, i, pagination.limit, type)}><a class="page-link" href="#">{i}</a></li>);
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
        <nav aria-label="Page navigation for tests" class={type.replace('_', '-')}>
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

  pagerGotoPageByNumber(number, limit, type) {
    this.props.dispatch(fetchTestsByPageAndLimit(number, limit, type));
  }
}
