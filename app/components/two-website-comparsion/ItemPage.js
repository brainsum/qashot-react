import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router";

import {
  addNewViewport, changeValueOfViewport, deleteViewport, fetchTest,
  runTest
} from '../../actions/testActions';

@connect((store) => {
  return {
    isLoading: store.test.fetching,
    loaded: store.test.fetched,
    data: store.test.test.data,
    message: store.test.message,
    sMessage: store.test.successMessage,
    error: store.test.error,
    testIsRunning: store.test.testIsRunning,
  };
})
export default class TwoWebsiteComparsionItemPage extends Component {
  results = null;

  constructor(props) {
    super(props);

    this.state = {
      displayMode: "exp-fail",
      viewportsEditable: false,
      newScenario: false,
      newScenarioData: {
        name: "",
        source: "",
        destination: "",
      },
      editScenario: {},
    };
  }

  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(fetchTest(id));
  }

  displayMode(e) {
    this.setState({displayMode: e.target.value});
  }

  editViewports() {
    this.setState({viewportsEditable: true});
  }

  deleteViewport(index) {
    this.props.dispatch(deleteViewport(index));
  }

  changeValueOfViewport(index, field, e) {
    this.props.dispatch(changeValueOfViewport(e.target.value, index, field));
  }

  saveViewports() {
    this.setState({viewportsEditable: false});
  }

  editAddNewViewports() {
    this.props.dispatch(addNewViewport());
  }

  editScenario(id){
    this.setState({editScenario: {...this.state.editScenario, [id]: true}});
  }

  saveScenario(id) {
    if (id === null || id === "" || typeof(id) === undefined) {
      this.setState({
        newScenario: false,
        newScenarioData: {
          name: "",
          source: "",
          destination: "",
        }
      });
    }
    else {
      this.setState({editScenario: {...this.state.editScenario, [id]: false}});
    }
  }

  cancelNewScenario() {
    this.setState({
      newScenario: false,
      newScenarioData: {
        name: "",
        source: "",
        destination: "",
      }
    });
  }

  changeValueOfPageUrlPair(property, e) {
    this.setState({
      newScenarioData: {...this.state.newScenarioData, [property]: e.target.value}
    });
  }

  addNewScenario() {
    this.setState({newScenario: true});
  }

  runTest() {
    this.props.dispatch(runTest(this.props.data.id[0].value));
  }

  makeArray(a,b) {
    let arr = new Array(a);
    for(let i = 0; i<a; i++)
      arr[i] = new Array(b);
    return arr;
  }

  render() {
    const { isLoading, testIsRunning, loaded, data } = this.props;

    let display = [["radio-expand-all", "exp-all", "Expand all"], ["radio-collapse-all", "coll-all", "Collapse all"], ["radio-expand-failed-only", "exp-fail", "Expand the fails only"]];

    if (loaded) {
      return (<div>
        <div class="test-head">
          <span>Comparison's name</span>
          <h1 class="comparation">{data.name[0].value}</h1>
          {this.renderTestHeader()}
          <div class="test-links">
            <a onClick={this.addNewScenario.bind(this)}>+ Add new test</a>
            <div class="display-radios">
              {display.map(([id, value, text], i) => <label for={id} key={i} class={id}><input type="radio" name="display" value={value} id={id} onChange={this.displayMode.bind(this)} checked={this.state.displayMode === value} />{text}</label>)}
            </div>
          </div>
        </div>
        <div class="clearfix"/>
          {this.renderMessages()}
          { isLoading && testIsRunning ? "" : this.renderTestResults() }
        <a onClick={this.addNewScenario.bind(this)}>+ Add new test</a>
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

  renderMessages() {
    const {error, message, sMessage} = this.props;

    let errorMessage;
    if (error) {
      errorMessage = (
        <div class="alert alert-danger alert-dismissable" key="error">
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
          <strong>ERROR!</strong> {error.message} : {error.response.data.message}
        </div>
      );
    }

    let infoMessage;
    if (message) {
      infoMessage = (
        <div class="alert alert-info alert-dismissable" key="info">
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
          <span class="loading-spinner"/>{message}
        </div>
      );
    }

    let successMessage;
    if (sMessage) {
      successMessage = (
        <div class="alert alert-success alert-dismissable" key="success">
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
          {sMessage}
        </div>
      );
    }

    return [infoMessage, errorMessage, successMessage];
  }

  renderTestHeader() {
    const {data} = this.props;

    let isData = data.metadata_last_run.length > 0;

    return (<div class="test-info-header">
      <div class="result">
        <div class="success">Passed <span class="passed-number">{isData ? data.metadata_last_run[0].passed_count : "?"}</span></div>
        <div class="failed">Failed <span class="failed-number">{isData ? data.metadata_last_run[0].failed_count : "?"}</span></div>
      </div>
      <div class="middle-data">
        <div class="compared-time">Compared at: {isData ? <strong>{data.metadata_last_run[0].datetime}</strong> : "Not compared yet"}</div>
        <div class="test-runtime">(Test run time: {isData? data.metadata_last_run[0].duration : "Not runned yet"})</div>
        <button class="btn btn-primary btn-lg" onClick={this.runTest.bind(this)}>
          {data.metadata_last_run.length > 0 ? 'Re-run the test' : 'Run the test'}
        </button>
        <a>
          Set automated runs
        </a>
      </div>
      {this.renderViewports()}
      <div class="clearfix" />
    </div>);
  }

  renderViewports() {
    const {data} = this.props;

    if (this.state.viewportsEditable) {
      let viewportsItems = [];
      for (let i = 0; i < data.field_viewport.length; i++) {
        viewportsItems.push(<div key={i}>
          {i + 1}. <input type="text" placeholder="Width" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_WIDTH")} value={data.field_viewport[i].field_width} />*
          <input type="text" placeholder="Height" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_HEIGHT")} value={data.field_viewport[i].field_height} />
          &nbsp;(<input type="text" placeholder="Viewport name" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_NAME")} value={data.field_viewport[i].field_name} />) <a onClick={this.deleteViewport.bind(this, i)} class="btn btn-link btn-sm">Delete</a>
        </div>);
      }

      return (
        <div class="view-ports">
          <div>Viewports</div>
          <div class="viewports-edit">
            {viewportsItems}
            <div class="buttons"><a onClick={this.editAddNewViewports.bind(this)} class="btn btn-link btn-sm">+ Add new viewport</a> <a onClick={this.saveViewports.bind(this)} class="btn btn-link btn-sm">Save</a></div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div class="view-ports">
          <div class="view-ports-inside">
            <div>Viewports (<a onClick={this.editViewports.bind(this)}>edit</a>)</div>
            <div class="viewports-list">
              {data.field_viewport.map((viewport, index) => (
                <div key={index}>{viewport.field_width}x{viewport.field_height} ({viewport.field_name})</div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }

  renderTestResults() {
    const {data} = this.props;

    if (data.result.length > 0) {
      this.results = this.makeArray(data.field_scenario.length, data.field_viewport.length);

      data.result.map((res, i) => {
        this.results[res.scenario_delta][res.viewport_delta] = res;
      });

      return(<div class="test-cases">
        {data.field_scenario.map((scenario, i) => (
          <div key={i}>
            <div class="scenario-info">
              <h2>{scenario.label} (<a onClick={this.editScenario.bind(this, i)}>edit</a>)</h2>
              <div class="row">
                <div class="col-lg-4">{scenario.referenceUrl}</div>
                <div class="col-lg-4">{scenario.testUrl}</div>
                <div class="col-lg-4">Difference</div>
              </div>
            </div>

            <div class="viewports">
              {data.field_viewport.map((viewportItem, j) =>
                  this.renderTestResultsViewports(i, j, viewportItem)
              )}
            </div>
          </div>
        ))}
        {this.renderNewScenario()}
      </div>);
    }

    return;
  }

  renderTestResultsViewports(i, j, viewportItem) {
    if (this.results[i][j]) {
      if (this.results[i][j].success === "1") {
        if (this.state.displayMode === "exp-all") {
          return this.renderTestResultsViewportsExpanded(i, j, viewportItem);
        }
        else {
          return this.renderTestResultsViewportsCollapsed(i, j, viewportItem);
        }
      }
      else {
        if (this.state.displayMode === "coll-all") {
          return this.renderTestResultsViewportsCollapsed(i, j, viewportItem);
        }
        else {
          return this.renderTestResultsViewportsExpanded(i, j, viewportItem);
        }
      }
    }
    else {
      return this.renderTestResultsViewportsNone(j, viewportItem);
    }
  }

  renderTestResultsViewportsExpanded(i, j, viewportItem) {
    return (<div key={j} class="row">
      <h3 class="col-lg-12">Viewport: {viewportItem.field_width} * {viewportItem.field_height} ({viewportItem.field_name})</h3>
      <div class="source col-lg-4">
        <img src={this.results[i][j].full_reference}/>
      </div>
      <div class="test col-lg-4">
        <img src={this.results[i][j].full_test}/>
      </div>
      {this.renderTestResult(this.results[i][j].success, this.results[i][j].full_diff)}
    </div>);
  }

  renderTestResultsViewportsCollapsed(i, j, viewportItem) {
    return (<div key={j} class="row">
      <h3 class="col-lg-8">Viewport: {viewportItem.field_width} * {viewportItem.field_height} ({viewportItem.field_name})</h3>
      {this.renderTestResult(this.results[i][j].success, this.results[i][j].full_diff)}
    </div>);
  }

  renderTestResultsViewportsNone(j, viewportItem) {
    return (<div key={j} class="row">
      <h3 class="col-lg-8">Viewport: {viewportItem.field_width} * {viewportItem.field_height} ({viewportItem.field_name})</h3>
      <div class="compare col-lg-4"><span class="difference-info">There's no test result for this. Please run the test first.</span></div>
    </div>);
  }

  renderTestResult(success, url) {
    if (success === "1") {
      if (this.state.displayMode === "exp-all") {
        return (<div class="compare col-lg-4">
          <svg version="1.2" preserveAspectRatio="none" viewBox="0 0 256 256"
               class="ng-element" data-id="e570c265c9ed35c5bf0197f6fc1e80ba"
               fill="#7bdb7c"
               style={{opacity: 1, width: "32px", height: "32px"}}>
            <path fill="#7bdb7c"
                  d="M128.09,0c17.712,0,34.36,3.333,49.785,10.032c15.489,6.666,29.083,15.783,40.718,27.384 c11.633,11.568,20.782,25.13,27.383,40.685c6.601,15.522,9.935,32.188,9.935,49.899s-3.334,34.377-9.935,49.899 c-6.601,15.521-15.75,29.116-27.383,40.685c-11.635,11.601-25.229,20.718-40.718,27.384C162.45,252.634,145.802,256,128.09,256 c-17.744,0-34.377-3.366-49.899-10.032c-15.555-6.666-29.117-15.783-40.685-27.384c-11.601-11.568-20.718-25.163-27.384-40.685 C3.423,162.377,0.09,145.712,0.09,128s3.333-34.377,10.032-49.899c6.667-15.555,15.784-29.116,27.384-40.685 c11.568-11.601,25.129-20.718,40.685-27.384C93.712,3.333,110.346,0,128.09,0z M215.259,104.439c1.438-1.47,2.223-3.3,2.288-5.424 c0.064-2.157-0.72-3.954-2.288-5.457l-16.666-17.124c-1.7-1.503-3.595-2.255-5.686-2.255c-2.092,0-3.922,0.751-5.556,2.255 l-72.398,72.545c-1.503,1.503-3.3,2.254-5.36,2.254c-2.091,0-3.921-0.751-5.522-2.254l-35.423-35.391 c-1.503-1.503-3.268-2.255-5.359-2.255c-2.092,0-4.02,0.752-5.85,2.255l-16.666,16.96c-1.503,1.503-2.222,3.334-2.222,5.457 c0,2.124,0.719,3.954,2.222,5.457l51.109,51.109c1.503,1.471,3.529,2.777,6.078,3.921c2.581,1.111,4.934,1.667,7.058,1.667h8.987 c2.124,0,4.444-0.523,6.96-1.601c2.516-1.079,4.575-2.419,6.176-3.987L215.259,104.439L215.259,104.439z"/>
          </svg>
          <div class="difference-success"><span class="first-line">EVERYTHING LOOKS FINE</span><br/><span
            class="secound-line">​​​There's no difference.</span></div>
        </div>);
      }
      else {
        return (<div class="compare col-lg-4">
          <svg version="1.2" preserveAspectRatio="none" viewBox="0 0 256 256"
               class="ng-element" data-id="e570c265c9ed35c5bf0197f6fc1e80ba"
               fill="#7bdb7c"
               style={{opacity: 1, width: "17px", height: "17px"}}>
            <path fill="#7bdb7c"
                  d="M128.09,0c17.712,0,34.36,3.333,49.785,10.032c15.489,6.666,29.083,15.783,40.718,27.384 c11.633,11.568,20.782,25.13,27.383,40.685c6.601,15.522,9.935,32.188,9.935,49.899s-3.334,34.377-9.935,49.899 c-6.601,15.521-15.75,29.116-27.383,40.685c-11.635,11.601-25.229,20.718-40.718,27.384C162.45,252.634,145.802,256,128.09,256 c-17.744,0-34.377-3.366-49.899-10.032c-15.555-6.666-29.117-15.783-40.685-27.384c-11.601-11.568-20.718-25.163-27.384-40.685 C3.423,162.377,0.09,145.712,0.09,128s3.333-34.377,10.032-49.899c6.667-15.555,15.784-29.116,27.384-40.685 c11.568-11.601,25.129-20.718,40.685-27.384C93.712,3.333,110.346,0,128.09,0z M215.259,104.439c1.438-1.47,2.223-3.3,2.288-5.424 c0.064-2.157-0.72-3.954-2.288-5.457l-16.666-17.124c-1.7-1.503-3.595-2.255-5.686-2.255c-2.092,0-3.922,0.751-5.556,2.255 l-72.398,72.545c-1.503,1.503-3.3,2.254-5.36,2.254c-2.091,0-3.921-0.751-5.522-2.254l-35.423-35.391 c-1.503-1.503-3.268-2.255-5.359-2.255c-2.092,0-4.02,0.752-5.85,2.255l-16.666,16.96c-1.503,1.503-2.222,3.334-2.222,5.457 c0,2.124,0.719,3.954,2.222,5.457l51.109,51.109c1.503,1.471,3.529,2.777,6.078,3.921c2.581,1.111,4.934,1.667,7.058,1.667h8.987 c2.124,0,4.444-0.523,6.96-1.601c2.516-1.079,4.575-2.419,6.176-3.987L215.259,104.439L215.259,104.439z"/>
          </svg>
          <span class="first-line">EVERYTHING LOOKS FINE</span>
        </div>);
      }
    }

    if (this.state.displayMode === "coll-all") {
      return (<div class="compare col-lg-4"><span class="difference-fail">Houston, We've Got a Problem</span></div>);
    }
    else {
      return (<div class="compare col-lg-4"><img src={url}/></div>);
    }
  }

  renderNewScenario() {
    if (this.state.newScenario) {
      return (
        <div class="add-scenario">
          <div class="compare-url-title"><input type="text" placeholder="Scenario name" value={this.state.newScenarioData.name} onChange={this.changeValueOfPageUrlPair.bind(this, "name")}/>
          </div>
          <div class="right-buttons"><a onClick={this.cancelNewScenario.bind(this)}>Cancel</a></div>
          <div class="urls row">
            <div class="url1 col-lg-5">
              <div class="url1-title">URL1</div>
              <div class="url1-input"><input type="text" placeholder="Reference URL" value={this.state.newScenarioData.source} onChange={this.changeValueOfPageUrlPair.bind(this, "source")}/>
              </div>
            </div>
            <div class="url-vs-text col-lg-auto"> VS</div>
            <div class="url2 col-lg-5">
              <div class="url2-title">URL2</div>
              <div class="url2-input"><input type="text" placeholder="Test URL" value={this.state.newScenarioData.destination} onChange={this.changeValueOfPageUrlPair.bind(this, "destination")}/>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
