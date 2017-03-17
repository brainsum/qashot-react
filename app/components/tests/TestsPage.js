import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router';

import { fetchTests } from '../../actions/testsActions';

@connect((store) => {
  return {
    isLoading: store.tests.fetching,
    tests: store.tests.tests.data,
  };
})
export default class TestsPage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchTests());
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
        <Link to="/create-two-website-comparsion" class="btn btn-link btn-sm">
          + Add new session
        </Link>
      </div>
    );
  }

  renderTests() {
    const { isLoading, tests } = this.props;

    if (isLoading) {
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
          {tests.map((test, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/two-website-comparsion/${test.id}`}>
                  {test.name}
                </Link>
              </td>
              <td>-</td>
              <td class="text-center">-</td>
              <td class="text-center">-</td>
              <td>
                <button class="btn btn-primary btn-sm">Run the test</button>
              </td>
              <td>
                <button class="btn btn-link btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      );
    }

    return null;
  }
}
