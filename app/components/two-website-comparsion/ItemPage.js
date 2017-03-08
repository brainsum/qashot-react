import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router";

import { fetchTest } from '../../actions/testActions';

@connect((store) => {
  return {
    isLoading: store.test.fetching,
    loaded: store.test.fetched,
    data: store.test.test.data,
  };
})
export default class TwoWebsiteComparsionItemPage extends Component {
  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(fetchTest(id));
  }

  render() {
    const { isLoading, loaded, data } = this.props;

    if (loaded) {
      console.log(data);
      return (<div>
        <div class="test-head">
          <span>Comparison's name</span>
          <h1>{data.name[0].value}</h1>
          <div class="test-info-header">
            <div class="result">
              <div>Passed <span class="passed-number">X</span></div>
              <div>Failed <span class="failed-number">X</span></div>
            </div>
            <div>
              <div class="compared-time">Compared at: X</div>
              <div class="test-runtime">(Test run time: X)</div>
              <Link to="#" class="btn btn-link btn-sm">
                Re-run the test
              </Link>
              <Link to="#">
                Set automated runs
              </Link>
            </div>
            <div class="view-ports">
              <div>Viewports (<Link to="#">edit</Link>)</div>
              {data.viewport.map((viewport, index) => (
                <div key={index}>{viewport.width}x{viewport.height} ({viewport.name})</div>
              ))}
            </div>
          </div>
          <div class="test-links">
            <Link to="#">+ Add new test</Link>
            <div class="display-radios">
              <label for="radio-expand-all"><input type="radio" name="display" value="exp-all" id="radio-expand-all" />Expand all</label>
              <label for="radio-collapse-all"><input type="radio" name="display" value="coll-all" id="radio-collapse-all" />Collapse all</label>
              <label for="radio-expand-failed-only"><input type="radio" name="display" value="exp-fail" id="radio-expand-failed-only" />Expand the fails only</label>
            </div>
          </div>
        </div>
        <div class="test-cases">
          {data.field_scenario.map((scenario, i) => (
            <div key={i}>
              <h2>{scenario.label}</h2>

            </div>
          ))}
        </div>
        <Link to="#">+ Add new test</Link>
      </div>);
    }
    else {
      return (
        <div class="text-center">
          <span class="loading-spinner"></span>
        </div>
      );
    }
  }
}
