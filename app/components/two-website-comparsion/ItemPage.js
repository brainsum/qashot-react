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

  makeArray(a,b) {
    let arr = new Array(a);
    for(let i = 0; i<a; i++)
      arr[i] = new Array(b);
    return arr;
  }

  render() {
    const { isLoading, loaded, data } = this.props;

    if (loaded) {
      return (<div>
        <div class="test-head">
          <span>Comparison's name</span>
          <h1>{data.name[0].value}</h1>
          {this.renderTestHeader()}
          <div class="test-links">
            <Link to="#">+ Add new test</Link>
            <div class="display-radios">
              <label for="radio-expand-all"><input type="radio" name="display" value="exp-all" id="radio-expand-all" defaultChecked="defaultChecked" />Expand all</label>
              <label for="radio-collapse-all"><input type="radio" name="display" value="coll-all" id="radio-collapse-all" />Collapse all</label>
              <label for="radio-expand-failed-only"><input type="radio" name="display" value="exp-fail" id="radio-expand-failed-only" />Expand the fails only</label>
            </div>
          </div>
        </div>
          {this.renderTestResults()}
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

  renderTestHeader() {
    const {data} = this.props;

    let isData = data.metadata_last_run.length > 0;

    return (<div class="test-info-header">
      <div class="result">
        <div>Passed <span class="passed-number">{isData ? data.metadata_last_run[0].passed_count : "?"}</span></div>
        <div>Failed <span class="failed-number">{isData ? data.metadata_last_run[0].failed_count : "?"}</span></div>
      </div>
      <div>
        <div class="compared-time">Compared at: {isData ? data.metadata_last_run[0].datetime : "Not compared yet"}</div>
        <div class="test-runtime">(Test run time: {isData? data.metadata_last_run[0].duration : "Not runned yet"})</div>
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
    </div>);
  }

  renderTestResults() {
    const {data} = this.props;

    if (data.result.length > 0) {
      let results = this.makeArray(data.field_scenario.length, data.viewport.length);

      data.result.map((res, i) => {
        results[res.scenario_delta][res.viewport_delta] = res;
      });

      return(<div class="test-cases">
        {data.field_scenario.map((scenario, i) => (
          <div key={i}>
            <h2>{scenario.label}</h2>
            {data.viewport.map((viewportItem, j) => (
              <div key={j} class="row">
                <h3 class="col-lg-12">Viewport: {viewportItem.width} * {viewportItem.height} ({viewportItem.name})</h3>
                <div class="source col-lg-4">
                  <img src={results[i][j].full_reference}/>
                </div>
                <div class="test col-lg-4">
                  <img src={results[i][j].full_test}/>
                </div>
                {this.renderTestResult(results[i][j].success, results[i][j].full_diff)}
              </div>
            ))}
          </div>
        ))}
      </div>);
    }

    return;
  }

  renderTestResult(success, url) {
    if (success === "1") {
      return (<div class="compare col-lg-4">
      <svg version="1.2" preserveAspectRatio="none" viewBox="0 0 256 256"
           class="ng-element" data-id="e570c265c9ed35c5bf0197f6fc1e80ba"
           fill="#7bdb7c"
           style={{opacity: 1, width: "32px", height: "32px"}}>
        <path fill="#7bdb7c"
  d="M128.09,0c17.712,0,34.36,3.333,49.785,10.032c15.489,6.666,29.083,15.783,40.718,27.384 c11.633,11.568,20.782,25.13,27.383,40.685c6.601,15.522,9.935,32.188,9.935,49.899s-3.334,34.377-9.935,49.899 c-6.601,15.521-15.75,29.116-27.383,40.685c-11.635,11.601-25.229,20.718-40.718,27.384C162.45,252.634,145.802,256,128.09,256 c-17.744,0-34.377-3.366-49.899-10.032c-15.555-6.666-29.117-15.783-40.685-27.384c-11.601-11.568-20.718-25.163-27.384-40.685 C3.423,162.377,0.09,145.712,0.09,128s3.333-34.377,10.032-49.899c6.667-15.555,15.784-29.116,27.384-40.685 c11.568-11.601,25.129-20.718,40.685-27.384C93.712,3.333,110.346,0,128.09,0z M215.259,104.439c1.438-1.47,2.223-3.3,2.288-5.424 c0.064-2.157-0.72-3.954-2.288-5.457l-16.666-17.124c-1.7-1.503-3.595-2.255-5.686-2.255c-2.092,0-3.922,0.751-5.556,2.255 l-72.398,72.545c-1.503,1.503-3.3,2.254-5.36,2.254c-2.091,0-3.921-0.751-5.522-2.254l-35.423-35.391 c-1.503-1.503-3.268-2.255-5.359-2.255c-2.092,0-4.02,0.752-5.85,2.255l-16.666,16.96c-1.503,1.503-2.222,3.334-2.222,5.457 c0,2.124,0.719,3.954,2.222,5.457l51.109,51.109c1.503,1.471,3.529,2.777,6.078,3.921c2.581,1.111,4.934,1.667,7.058,1.667h8.987 c2.124,0,4.444-0.523,6.96-1.601c2.516-1.079,4.575-2.419,6.176-3.987L215.259,104.439L215.259,104.439z"/>
      </svg>
        <div class="success-text"><span class="first-line">EVERYTHING LOOKS FINE</span><br/><span class="secound-line">​​​There's no difference.</span></div>
      </div>);
    }

    return (<div class="compare col-lg-4"><img src={url}/></div>);
  }
}
