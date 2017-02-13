import React, { Component } from 'react';
import axios from 'app/utils/axios';
import { Link } from 'react-router';

export default class TestsPage extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      tests: null
    };
  }

  componentDidMount() {
    axios.get('api/rest/v1/test_list?_format=json').then(response => {
      this.setState({
        isLoading: false,
        tests: response.data
      });
    });
  }

  render() {
    return (
      <div>
        <h2>
          <strong>2 website</strong> comparsions (eg. Development VS Live)
        </h2>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Session name</th>
              <th>Last run</th>
              <th className="text-center">Tests Passed</th>
              <th className="text-center" className="text-center">Tests Failed</th>
              <th width="1%"></th>
              <th width="1%"></th>
            </tr>
          </thead>
          {this.renderTests()}
        </table>
        <Link to="/create-two-website-comparsion" className="btn btn-link btn-sm">
          + Add new session
        </Link>
      </div>
    );
  }

  renderTests() {
    const { isLoading, tests } = this.state;

    if (isLoading) {
      return (
        <tbody>
          <tr>
            <td colSpan="7" className="text-center">
              <div className="loading-spinner"></div>
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
                <Link to={`/two-website-comparsion/${test.id[0].value}`}>
                  {test.name[0].value}
                </Link>
              </td>
              <td>-</td>
              <td className="text-center">-</td>
              <td className="text-center">-</td>
              <td>
                <button className="btn btn-primary btn-sm">Run the test</button>
              </td>
              <td>
                <button className="btn btn-link btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      );
    }

    return null;
  }
}
