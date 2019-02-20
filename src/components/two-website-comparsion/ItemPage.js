import React, { Component } from 'react';
import { connect } from "react-redux";
import { diffEngines } from '../../utils/helper';

import {
  fetchTest, patchTest, runTest
} from '../../actions/testActions';
import Messages from "../part/message";
import {getEntityUpdate, getQueueUpdate} from "../../actions/testsActions";
import {getReadableRunName} from "../../utils/helper";
import {SketchPicker} from "react-color";


class TwoWebsiteComparsionItemPage extends Component {
  results = null;

  constructor(props) {
    super(props);

    this.state = {
      displayMode: "exp-fail",
      viewportsEditable: false,
      editSettings: false,
      settingsData: {
        name: "",
        selectorsToHide: [],
        selectorsToRemove: [],
        testerEngine: "",
        diffColor: "",
        tags: [],
      },
      newScenario: false,
      newScenarioData: {
        field_label: "",
        field_reference_url: "",
        field_test_url: "",
      },
      editScenario: {},
      editScenarioData: {},
      editViewport: [],
    };
  }

  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(fetchTest(id));
    setTimeout(function () {
      this.props.dispatch(getQueueUpdate([id]));
    }.bind(this), 100);

    this.timer = setInterval(this.periodicTask.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  periodicTask() {
    const { data } = this.props;

    if (typeof data.id !== "undefined") {
      this.props.dispatch(getEntityUpdate([{tid: data.id, changed: data.changed}]));
      setTimeout(function () {
        this.props.dispatch(getQueueUpdate([data.id]));
      }.bind(this), 100);
    }
  }

  displayMode(e) {
    this.setState({displayMode: e.target.value});
  }

  /********** VIEWPORTS **********/

  editViewports() {
    const { data, viewports } = this.props;
    let newViewports = [];
    data.field_viewport.map((viewportId) => {
      let viewTmp = viewports[viewportId];
      delete viewTmp.id;
      delete viewTmp.revision_id;
      newViewports.push(viewTmp);
    });
    this.setState({viewportsEditable: true, editViewport: newViewports});
  }

  deleteViewport(index) {
    this.setState({editViewport: [
      ...this.state.editViewport.slice(0, index),
      ...this.state.editViewport.slice(index + 1)
    ]});
  }

  changeValueOfViewport(index, field, e) {
    let viewport = {...this.state.editViewport[index]};
    switch (field) {
      case "FIELD_WIDTH": {
        viewport.field_width = e.target.value;
        break;
      }
      case "FIELD_HEIGHT": {
        viewport.field_height = e.target.value;
        break;
      }
      case "FIELD_NAME": {
        viewport.field_name = e.target.value;
        break;
      }
    }
    this.setState({editViewport: [
      ...this.state.editViewport.slice(0, index),
      viewport,
      ...this.state.editViewport.slice(index + 1)
    ]});
  }

  saveViewports() {
    this.props.dispatch(patchTest(this.props.data.id, {
      type: this.props.data.type,
      field_viewport: this.state.editViewport,
    }));
    this.cancelViewports();
  }

  cancelViewports() {
    this.setState({viewportsEditable: false});
  }

  editAddNewViewports() {
    this.setState({editViewport: [
      ...this.state.editViewport,
      {
        field_width: "",
        field_height: "",
        field_name: "",
      }
    ]});
  }

  /********** NEW SCENARIO **********/

  addNewScenario() {
    this.setState({newScenario: true});
  }

  cancelNewScenario() {
    this.setState({
      newScenario: false,
      newScenarioData: {
        field_label: "",
        field_reference_url: "",
        field_test_url: "",
      },
    });
  }

  /********** NEW/EDIT SCENARIO **********/

  changeValueOfPageUrlPair(id, property, e) {
    if (id === null || id === "" || typeof(id) === undefined) {
      this.setState({
        newScenarioData: {
          ...this.state.newScenarioData,
          [property]: e.target.value
        },
      });
    }
    else {
      this.setState({
        editScenarioData: {
          ...this.state.editScenarioData,
          [id]: {
            ...this.state.editScenarioData[id],
            [property]: e.target.value,
          },
        },
      });
    }
  }

  editScenario(id) {
    const { scenarios } = this.props;
    this.setState({
      editScenario: {
        ...this.state.editScenario,
        [id]: true
      },
      editScenarioData: {
        ...this.state.editScenarioData,
        [id]: {
          ...scenarios[id],
        }
      }
    });
  }

  saveScenario(id) {
    const { data, scenarios } = this.props;
    let localScenario = [];
    data.field_scenario.map((scenarioId, i) => {
      let scenario = {...scenarios[scenarioId]};
      if (scenario.id === id) {
        scenario = this.state.editScenarioData[id];
        this.cancelEditScenario(id);
      }
      delete scenario.id;
      delete scenario.revision_id;
      localScenario.push(scenario);
    });

    if (id === null || id === "" || typeof(id) === undefined) {
      localScenario.push({...this.state.newScenarioData});

      this.setState({
        newScenario: false,
        newScenarioData: {
          field_label: "",
          field_reference_url: "",
          field_test_url: "",
        },
      });
    }

    this.props.dispatch(patchTest(data.id, {
      type: data.type,
      field_scenario: localScenario,
    }));
  }

  /********** EDIT SCENARIO **********/

  cancelEditScenario(id) {
    let editScenarioData = {...this.state.editScenarioData};
    delete editScenarioData[id];

    this.setState({
      editScenario: {
        ...this.state.editScenario,
        [id]: false
      },
      editScenarioData: editScenarioData,
    });
  }

  deleteScenario(sid) {
    const { data, scenarios } = this.props;

    let savedScenarios = [];
    data.field_scenario.map(function (item) {
      if (item !== sid) {
        let scenTmp = scenarios[item];
        delete scenTmp.id;
        delete scenTmp.revision_id;
        savedScenarios.push(scenTmp);
      }
    });

    this.props.dispatch(patchTest(data.id, {
      type: data.type,
      field_scenario: savedScenarios,
    }));
  }

  /********** RUN TEST **********/

  runTest() {
    this.props.dispatch(runTest(this.props.data.id, this.props.data.type, ''));
  }

  saveSettings() {
    let tags = [];
    this.state.settingsData.tags.map((tag) => tags.push({name: tag}));

    this.props.dispatch(patchTest(this.props.data.id, {
      type: this.props.data.type,
      name: this.state.settingsData.name,
      selectors_to_hide: this.state.settingsData.selectorsToHide,
      selectors_to_remove: this.state.settingsData.selectorsToRemove,
      field_tester_engine: this.state.settingsData.testerEngine,
      field_diff_color: this.state.settingsData.color.replace('#', ''),
      field_tag: tags,
    }));
    this.cancelSettings();
  }

  editSettings() {
    const { data } = this.props;
    let tags = [];
    data.field_tag.map((tag) => tags.push(tag.name));

    this.setState({
      editSettings: true,
      settingsData: {
        name: data.name,
        selectorsToHide: data.selectors_to_hide,
        selectorsToRemove: data.selectors_to_remove,
        testerEngine: data.field_tester_engine,
        color: '#' + data.field_diff_color,
        tags: tags,
      }
    });
  }

  cancelSettings() {
    this.setState({
      editSettings: false,
    });
  }

  changeName(e) {
    this.setState({
      settingsData: {
        ...this.state.settingsData,
        name: e.target.value,
      }
    });
  }

  changeEngine(e) {
    this.setState({
      settingsData: {
        ...this.state.settingsData,
        testerEngine: e.target.value,
      }
    });
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({
      settingsData: {
        ...this.state.settingsData,
        color: color.hex,
      }
    });
  };

  changeArrayValue(i, propName, e) {
    if (e.target.value === "" || e.target.value === null) {
      this.setState({
        settingsData: {
          ...this.state.settingsData,
          [propName]: [
            ...this.state.settingsData[propName].slice(0, i),
            ...this.state.settingsData[propName].slice(i + 1)
          ]
        },
      });
    }
    else {
      let newSettingsData = {...this.state.settingsData};
      if (i === this.state.settingsData[propName].length) {
        newSettingsData[propName] = [
          ...this.state.settingsData[propName],
          e.target.value,
        ];
        this.lastChanged = propName + "-" + i;
      }
      else {
        newSettingsData[propName] = [
          ...this.state.settingsData[propName].slice(0, i),
          e.target.value,
          ...this.state.settingsData[propName].slice(i + 1),
        ];
      }
      this.setState({
        settingsData: newSettingsData,
      });
    }
  }

  componentDidUpdate() {
    if (typeof this.lastChanged !== "undefined" && typeof this.refs[this.lastChanged] !== "undefined" && typeof this.refs[this.lastChanged].focus === "function") {
      let element = this.refs[this.lastChanged];
      let contentLength = element.value.length;

      element.focus();
      if (element.setSelectionRange) {
        element.setSelectionRange(contentLength, contentLength);
      }

      delete this.lastChanged;
    }
  }

  render() {
    const { isLoading, testIsRunning, data } = this.props;
    const {error, message, sMessage} = this.props;

    let display = [["radio-expand-all", "exp-all", "Expand all"], ["radio-collapse-all", "coll-all", "Collapse all"], ["radio-expand-failed-only", "exp-fail", "Expand the fails only"]];

    if (typeof data !== 'undefined' && data.uuid) {
      return (<div>
        <div className="test-head">
          <span>Comparison's name</span>
          {this.renderTestTitleAndSettings()}
          {this.renderTestHeader()}
          <div className="test-links">
            <a onClick={this.addNewScenario.bind(this)}>+ Add new test</a>
            <div className="display-radios">
              {display.map(([id, value, text], i) => <label for={id} key={i} className={id}><input type="radio" name="display" value={value} id={id} onChange={this.displayMode.bind(this)} checked={this.state.displayMode === value} />{text}</label>)}
            </div>
          </div>
        </div>
        <div className="clearfix"/>
          <Messages notGlobal errorMessage={error} successMessage={sMessage} infoMessage={message} />
          { isLoading && testIsRunning ? "" : this.renderTestResults() }
        <a onClick={this.addNewScenario.bind(this)}>+ Add new test</a>
      </div>);
    }
    else if(typeof data !== 'undefined' && data.name) {
      return (<div>
        <div className="test-head">
          <span>Comparison's name</span>
          <h1 className="comparation">{data.name}</h1>
        </div>
        <div className="clearfix"/>
        <div className="text-center">
          <span className="loading-spinner"></span>
        </div>
       </div>);
    }
    else {
      return (
        <div className="text-center">
          <span className="loading-spinner"></span>
        </div>
      );
    }
  }

  renderTestTitleAndSettings() {
    const { data } = this.props;

    if (this.state.editSettings) {
      const { name, selectorsToHide, selectorsToRemove, testerEngine, color, tags } = this.state.settingsData;
      return (
        <div>
          <h1 className="comparation ba">
            <input value={name} onChange={this.changeName.bind(this)}/>
          </h1>
          <div id="compare-site-other-data" className="compare-site-other-data">
            <div className="expandable-list">
              <div className="input-title">Selectors to hide:</div>
              {selectorsToHide.map((toHide, i) => {
                return (<div key={"toHide" + i}>{i + 1}. <input ref={"selectorsToHide-" + i} type="text" value={toHide} onChange={this.changeArrayValue.bind(this, i, 'selectorsToHide')}/></div>);
              })}
              <div>{selectorsToHide.length + 1}. <input key={"toHide" + selectorsToHide.length} type="text" value="" onChange={this.changeArrayValue.bind(this, selectorsToHide.length, 'selectorsToHide')}/></div>
            </div>
            <div className="expandable-list">
              <div className="input-title">Selectors to remove</div>
              {selectorsToRemove.map((toRemove, i) => {
                return (<div key={"toRemove" + i}>{i + 1}. <input ref={"selectorsToRemove-" + i} type="text" value={toRemove} onChange={this.changeArrayValue.bind(this, i, 'selectorsToRemove')}/></div>);
              })}
              <div>{selectorsToRemove.length + 1}. <input key={"toRemove" + selectorsToRemove.length} type="text" value="" onChange={this.changeArrayValue.bind(this, selectorsToRemove.length, 'selectorsToRemove')}/></div>
            </div>
            <div>
              Tester engine:&nbsp;
              <select value={testerEngine} onChange={this.changeEngine.bind(this)}>
                {diffEngines.map((engine) => {
                  return <option key={engine.code} value={engine.code}>{engine.name}</option>
                })}
              </select>
            </div>
            <div>
              Diff color:&nbsp;
              <div className="color-picker-swatch" onClick={ this.handleClick }>
                <div className="color-picker-color" style={ {background: color} } />
              </div>
              { this.state.displayColorPicker ? <div className="color-picker-popover">
                <div className="color-picker-cover" onClick={ this.handleClose }/>
                <SketchPicker disableAlpha color={color} onChange={ this.handleChange } />
              </div> : null }
            </div>
            <div className="expandable-list">
              <div className="input-title">Tags:</div>
              {tags.map((tags, i) => {
                return (<div key={"tags" + i}>{i + 1}. <input ref={"tags-" + i} type="text" value={tags} onChange={this.changeArrayValue.bind(this, i, 'tags')}/></div>);
              })}
              <div>{tags.length + 1}. <input key={"tags" + tags.length} type="text" value="" onChange={this.changeArrayValue.bind(this, tags.length, 'tags')}/></div>
            </div>
          </div>
          <div className="settings-actions action-btn">
            <a onClick={this.saveSettings.bind(this)} className="btn btn-link btn-sm save">Save</a> <a onClick={this.cancelSettings.bind(this)} className="btn btn-link btn-sm">Cancel</a>
          </div>
        </div>
      );
    }

    let engineName = "";
    for (let i = 0; i < diffEngines.length; i++) {
      if (data.field_tester_engine === diffEngines[i].code) {
        engineName = diffEngines[i].name;
        break;
      }
    }
    let tags = "";
    data.field_tag.map((tag, i) => {
      tags += i === 0 ? tag.name : "; " + tag.name;
    });

    return (
      <div>
        <h1 className="comparation ba">
          {data.name}
          <img className="test-settings" src="/img/gears.png" width="25" height="25" alt="Edit settings" title="Edit settings" onClick={this.editSettings.bind(this)}/>
        </h1>
        <div id="compare-site-other-data">
          Selectors to hide: {data.selectors_to_hide.join("; ") || "-"}<br/>
          Selectors to remove: {data.selectors_to_remove.join("; ") || "-"}<br/>
          Tester engine: {engineName || data.field_tester_engine}<br/>
          Diff color: <span className="color-picker-color" style={ {background: '#' + data.field_diff_color} } /><br/>
          Tags: {tags || "-"}<br/>
        </div>
      </div>
    );
  }

  renderTestHeader() {
    const {data, metadata_lifetimes, queue} = this.props;

    let isData = data.metadata_last_run.length > 0;
    let lastRun = data.metadata_last_run[0];

    return (<div className="test-info-header">
      <div className="result">
        <div className="success">Passed <span className="passed-number">{isData ? metadata_lifetimes[lastRun].passed_count : "?"}</span></div>
        <div className="failed">Failed <span className="failed-number">{isData ? metadata_lifetimes[lastRun].failed_count : "?"}</span></div>
      </div>
      <div className="middle-data">
        <div className="compared-time">Compared at: {isData ? <strong>{metadata_lifetimes[lastRun].datetime}</strong> : "Not compared yet"}</div>
        <div className="test-runtime">(Test run time: {isData? metadata_lifetimes[lastRun].duration : "Not runned yet"})</div>
        {queue[data.id] ? getReadableRunName(queue[data.id].status) :
          <button className="btn btn-primary btn-lg"
                  onClick={this.runTest.bind(this)}>
            {data.metadata_last_run.length > 0 ? 'Re-run the test' : 'Run the test'}
          </button>
        }
      </div>
      {this.renderViewports()}
      <div className="clearfix" />
    </div>);
  }

  renderViewports() {
    const {data, viewports} = this.props;

    if (this.state.viewportsEditable) {
      let viewportsItems = [];
      for (let i = 0; i < this.state.editViewport.length; i++) {
        viewportsItems.push(<div key={i}>
          {i + 1}. <input type="text" className="viewport-width" placeholder="Width" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_WIDTH")} value={this.state.editViewport[i].field_width} />x
          <input type="text" className="viewport-height" placeholder="Height" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_HEIGHT")} value={this.state.editViewport[i].field_height} />
          &nbsp;<input type="text" className="viewport-name" placeholder="Viewport name" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_NAME")} value={this.state.editViewport[i].field_name} /> <a onClick={this.deleteViewport.bind(this, i)} className="btn btn-link btn-sm">Delete</a>
        </div>);
      }

      return (
        <div className="view-ports edit">
          <div>Viewports</div>
          <div className="viewports-edit">
            {viewportsItems}
            <div className="buttons"><a onClick={this.editAddNewViewports.bind(this)} className="btn btn-link btn-sm">+ Add new viewport</a> <a onClick={this.saveViewports.bind(this)} className="btn btn-link btn-sm">Save</a> <a onClick={this.cancelViewports.bind(this)} className="btn btn-link btn-sm">Cancel</a></div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="view-ports">
          <div className="view-ports-inside">
            <div>Viewports (<a onClick={this.editViewports.bind(this)}>edit</a>)</div>
            <div className="viewports-list">
              {data.field_viewport.map((viewportId, index) => (
                <div key={index}>{viewports[viewportId].field_width}x{viewports[viewportId].field_height} ({viewports[viewportId].field_name})</div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }

  renderTestResults() {
    const {data, results, scenarios, viewports} = this.props;

    if (data.result.length > 0) {
      this.results = {};

      data.result.map((res, i) => {
        if (this.results[results[res].scenario_id] === null || typeof this.results[results[res].scenario_id] !== 'object') {
          this.results[results[res].scenario_id] = {};
        }
        this.results[results[res].scenario_id][results[res].viewport_id] = results[res];
      });

      return(<div className="test-cases">
        {data.field_scenario.map((scenarioId, i) => {
          let scenario = scenarios[scenarioId];

          if (typeof this.state.editScenario[scenarioId] !== "undefined" && this.state.editScenario[scenarioId]) {
            let editData = this.state.editScenarioData[scenarioId];
            return (
              <div key={i}>
                <div className="scenario-info">
                  <div className="scenario-name"><input type="text" placeholder="Scenario name" value={editData.field_label} onChange={this.changeValueOfPageUrlPair.bind(this, scenarioId, "field_label")}/> <span className="operations">(<a onClick={this.cancelEditScenario.bind(this, scenarioId)}>cancel</a> <a onClick={this.saveScenario.bind(this, scenarioId)}>save</a> <a onClick={this.deleteScenario.bind(this, scenarioId)}>delete</a>)</span></div>
                  <div className="urls row">
                    <div className="url1 col-lg-5">
                      <div className="url1-title">URL1</div>
                      <div className="url1-input"><input type="text" placeholder="Reference URL" value={editData.field_reference_url} onChange={this.changeValueOfPageUrlPair.bind(this, scenarioId, "field_reference_url")}/></div>
                    </div>
                    <div className="url-vs-text col-lg-auto"> VS </div>
                    <div className="url2 col-lg-5">
                      <div className="url2-title">URL2</div>
                      <div className="url2-input"><input type="text" placeholder="Test URL" value={editData.field_test_url} onChange={this.changeValueOfPageUrlPair.bind(this, scenarioId, "field_test_url")}/></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          let plussClass = "";
          return (
            <div key={i}>
              <div className="scenario-info">
                {
                  data.field_viewport.map((viewportId, j) => {
                    if (this.results.hasOwnProperty(scenarioId) && this.results[scenarioId].hasOwnProperty(viewportId) && this.results[scenarioId][viewportId].success === "1" && plussClass === "") {
                      plussClass = "success";
                    }
                    else if (this.results.hasOwnProperty(scenarioId) && this.results[scenarioId].hasOwnProperty(viewportId) && this.results[scenarioId][viewportId].success === "0") {
                      plussClass = "failed";
                    }
                  })
                }
                <div className={"scenario-name " + plussClass}>{scenario.field_label} <span className="operations">(<a onClick={this.editScenario.bind(this, scenarioId)}>edit</a>)</span></div>
                <div className="row">
                  <div className="col-lg-4">{scenario.field_reference_url}</div>
                  <div className="col-lg-4">{scenario.field_test_url}</div>
                  <div className="col-lg-4">Difference</div>
                </div>
              </div>

              <div className="viewports">
                {data.field_viewport.map((viewportId, j) =>
                  this.renderTestResultsViewports(scenarioId, viewportId, viewports[viewportId])
                )}
              </div>
            </div>
          )})}
        {this.renderNewScenario()}
      </div>);
    }

    return;
  }

  renderTestResultsViewports(i, j, viewportItem) {
    if (typeof this.results[i] !== "undefined" && typeof this.results[i][j] !== "undefined" && this.results[i][j]) {
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
    return (<div key={j} className="row">
      <div className="viewport-name col-lg-12">Viewport: {viewportItem.field_width} * {viewportItem.field_height} ({viewportItem.field_name})</div>
      <div className="source col-lg-4">
        <img src={this.results[i][j].full_reference}/>
      </div>
      <div className="test col-lg-4">
        <img src={this.results[i][j].full_test}/>
      </div>
      {this.renderTestResult(this.results[i][j].success, this.results[i][j].full_diff)}
    </div>);
  }

  renderTestResultsViewportsCollapsed(i, j, viewportItem) {
    return (<div key={j} className="row">
      <div className="viewport-name col-lg-8">Viewport: {viewportItem.field_width} * {viewportItem.field_height} ({viewportItem.field_name})</div>
      {this.renderTestResult(this.results[i][j].success, this.results[i][j].full_diff)}
    </div>);
  }

  renderTestResultsViewportsNone(j, viewportItem) {
    return (<div key={j} className="row">
      <div className="viewport-name col-lg-8">Viewport: {viewportItem.field_width} * {viewportItem.field_height} ({viewportItem.field_name})</div>
      <div className="compare col-lg-4"><span className="difference-info">There's no test result for this. Please run the test first.</span></div>
    </div>);
  }

  renderTestResult(success, url) {
    if (success === "1") {
      if (this.state.displayMode === "exp-all") {
        return (<div className="compare col-lg-4">
          <svg version="1.2" preserveAspectRatio="none" viewBox="0 0 256 256"
               className="ng-element" data-id="e570c265c9ed35c5bf0197f6fc1e80ba"
               fill="#7bdb7c"
               style={{opacity: 1, width: "32px", height: "32px"}}>
            <path fill="#7bdb7c"
                  d="M128.09,0c17.712,0,34.36,3.333,49.785,10.032c15.489,6.666,29.083,15.783,40.718,27.384 c11.633,11.568,20.782,25.13,27.383,40.685c6.601,15.522,9.935,32.188,9.935,49.899s-3.334,34.377-9.935,49.899 c-6.601,15.521-15.75,29.116-27.383,40.685c-11.635,11.601-25.229,20.718-40.718,27.384C162.45,252.634,145.802,256,128.09,256 c-17.744,0-34.377-3.366-49.899-10.032c-15.555-6.666-29.117-15.783-40.685-27.384c-11.601-11.568-20.718-25.163-27.384-40.685 C3.423,162.377,0.09,145.712,0.09,128s3.333-34.377,10.032-49.899c6.667-15.555,15.784-29.116,27.384-40.685 c11.568-11.601,25.129-20.718,40.685-27.384C93.712,3.333,110.346,0,128.09,0z M215.259,104.439c1.438-1.47,2.223-3.3,2.288-5.424 c0.064-2.157-0.72-3.954-2.288-5.457l-16.666-17.124c-1.7-1.503-3.595-2.255-5.686-2.255c-2.092,0-3.922,0.751-5.556,2.255 l-72.398,72.545c-1.503,1.503-3.3,2.254-5.36,2.254c-2.091,0-3.921-0.751-5.522-2.254l-35.423-35.391 c-1.503-1.503-3.268-2.255-5.359-2.255c-2.092,0-4.02,0.752-5.85,2.255l-16.666,16.96c-1.503,1.503-2.222,3.334-2.222,5.457 c0,2.124,0.719,3.954,2.222,5.457l51.109,51.109c1.503,1.471,3.529,2.777,6.078,3.921c2.581,1.111,4.934,1.667,7.058,1.667h8.987 c2.124,0,4.444-0.523,6.96-1.601c2.516-1.079,4.575-2.419,6.176-3.987L215.259,104.439L215.259,104.439z"/>
          </svg>
          <div className="difference-success"><span className="first-line">EVERYTHING LOOKS FINE</span><br/><span
            className="secound-line">​​​There's no difference.</span></div>
        </div>);
      }
      else {
        return (<div className="compare col-lg-4">
          <svg version="1.2" preserveAspectRatio="none" viewBox="0 0 256 256"
               className="ng-element" data-id="e570c265c9ed35c5bf0197f6fc1e80ba"
               fill="#7bdb7c"
               style={{opacity: 1, width: "17px", height: "17px"}}>
            <path fill="#7bdb7c"
                  d="M128.09,0c17.712,0,34.36,3.333,49.785,10.032c15.489,6.666,29.083,15.783,40.718,27.384 c11.633,11.568,20.782,25.13,27.383,40.685c6.601,15.522,9.935,32.188,9.935,49.899s-3.334,34.377-9.935,49.899 c-6.601,15.521-15.75,29.116-27.383,40.685c-11.635,11.601-25.229,20.718-40.718,27.384C162.45,252.634,145.802,256,128.09,256 c-17.744,0-34.377-3.366-49.899-10.032c-15.555-6.666-29.117-15.783-40.685-27.384c-11.601-11.568-20.718-25.163-27.384-40.685 C3.423,162.377,0.09,145.712,0.09,128s3.333-34.377,10.032-49.899c6.667-15.555,15.784-29.116,27.384-40.685 c11.568-11.601,25.129-20.718,40.685-27.384C93.712,3.333,110.346,0,128.09,0z M215.259,104.439c1.438-1.47,2.223-3.3,2.288-5.424 c0.064-2.157-0.72-3.954-2.288-5.457l-16.666-17.124c-1.7-1.503-3.595-2.255-5.686-2.255c-2.092,0-3.922,0.751-5.556,2.255 l-72.398,72.545c-1.503,1.503-3.3,2.254-5.36,2.254c-2.091,0-3.921-0.751-5.522-2.254l-35.423-35.391 c-1.503-1.503-3.268-2.255-5.359-2.255c-2.092,0-4.02,0.752-5.85,2.255l-16.666,16.96c-1.503,1.503-2.222,3.334-2.222,5.457 c0,2.124,0.719,3.954,2.222,5.457l51.109,51.109c1.503,1.471,3.529,2.777,6.078,3.921c2.581,1.111,4.934,1.667,7.058,1.667h8.987 c2.124,0,4.444-0.523,6.96-1.601c2.516-1.079,4.575-2.419,6.176-3.987L215.259,104.439L215.259,104.439z"/>
          </svg>
          <span className="first-line">EVERYTHING LOOKS FINE</span>
        </div>);
      }
    }

    if (this.state.displayMode === "coll-all") {
      return (<div className="compare col-lg-4"><span className="difference-fail">Houston, We've Got a Problem</span></div>);
    }
    else {
      return (<div className="compare col-lg-4"><img src={url}/></div>);
    }
  }

  renderNewScenario() {
    if (this.state.newScenario) {
      return (
        <div className="add-scenario">
          <div className="compare-url-title"><input type="text" placeholder="Scenario name" value={this.state.newScenarioData.field_label} onChange={this.changeValueOfPageUrlPair.bind(this, "", "field_label")}/>
          </div>
          <div className="right-buttons"><a onClick={this.cancelNewScenario.bind(this)}>Cancel</a> <a onClick={this.saveScenario.bind(this, "")}>Save</a></div>
          <div className="urls row">
            <div className="url1 col-lg-5">
              <div className="url1-title">URL1</div>
              <div className="url1-input"><input type="text" placeholder="Reference URL" value={this.state.newScenarioData.field_reference_url} onChange={this.changeValueOfPageUrlPair.bind(this, "", "field_reference_url")}/>
              </div>
            </div>
            <div className="url-vs-text col-lg-auto"> VS</div>
            <div className="url2 col-lg-5">
              <div className="url2-title">URL2</div>
              <div className="url2-input"><input type="text" placeholder="Test URL" value={this.state.newScenarioData.field_test_url} onChange={this.changeValueOfPageUrlPair.bind(this, "", "field_test_url")}/>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (store) => {
  return {
    isLoading: store.test.fetching,
    loaded: store.test.fetched,
    //data: store.entities.tests[props.params.id],
    data: store.entities.tests,
    metadata_lifetimes: store.entities.metadata_lifetimes,
    results: store.entities.results,
    scenarios: store.entities.scenarios,
    viewports: store.entities.viewports,
    message: store.test.message,
    sMessage: store.test.successMessage,
    error: store.test.error,
    testIsRunning: store.test.testIsRunning,
    queue: store.entities.queue,
  };
};

const TwoWebsiteComparsionItemPageContainer = connect(mapStateToProps)(TwoWebsiteComparsionItemPage);
  
export default TwoWebsiteComparsionItemPageContainer;
