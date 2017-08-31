import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router";
import { fetchTest } from '../../actions/testActions';
import { SketchPicker } from 'react-color';
import { diffEngines } from '../../utils/helper';
import {
  loadTestEditor,
  addNewPageUrlPair, addNewViewport,
  changeValueOfPageUrlPair,
  changeValueOfTitle, changeValueOfViewport, deletePageUrlPair, deleteViewport,
  editViewports,
  saveTest, saveAndRunTest, changeValueOfColor, deleteHideValue,
  changeOrAddHideValue, deleteRemoveValue, changeOrAddRemoveValue,
  deleteTagsValue, changeOrAddTagsValue
} from "../../actions/editorActions";
import Messages from "../part/message";

@connect((store) => {
  return {
    settings: store.editor,
  };
})
export default class TwoWebsiteComparsionCreatePage extends Component {
  constructor(props) {
    super(props);

    let type = "";

    if (props.pathname === "/create/two-website-comparsion") {
      type = "a_b";
    }
    else if (props.pathname === "/create/before-after-comparsion") {
      type = "before_after";
    }

    this.state = {
      type: type,
      displayColorPicker: false,
    };
  }

  componentDidMount() {
    this.props.dispatch(loadTestEditor());
  }

  editViewports() {
    this.props.dispatch(editViewports());
  }

  editAddNewViewports() {
    this.props.dispatch(addNewViewport());
  }

  addNewPageUrlPair() {
    this.props.dispatch(addNewPageUrlPair());
  }

  deletePageUrlPair(index) {
    this.props.dispatch(deletePageUrlPair(index));
  }

  deleteViewport(index) {
    this.props.dispatch(deleteViewport(index));
  }

  changeValueOfPageUrlPair(index, field, e) {
    this.props.dispatch(changeValueOfPageUrlPair(e.target.value, index, field));
  }

  changeValueOfViewport(index, field, e) {
    this.props.dispatch(changeValueOfViewport(e.target.value, index, field));
  }

  changeTitle(e) {
    this.props.dispatch(changeValueOfTitle(e.target.value));
  }

  save() {
    this.props.dispatch(saveTest(this.props.settings, this.state.type));
  }

  runTest() {
    this.props.dispatch(saveAndRunTest(this.props.settings, this.state.type));
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.props.dispatch(changeValueOfColor(color.hex));
  };

  changeHideValue(i, e) {
    if (e.target.value === "" || e.target.value === null) {
      this.props.dispatch(deleteHideValue(i));
    }
    else {
      this.lastChanged = "selectorsToHide-" + i;
      this.props.dispatch(changeOrAddHideValue(i, e.target.value));
    }
  }

  changeRemoveValue(i, e) {
    if (e.target.value === "" || e.target.value === null) {
      this.props.dispatch(deleteRemoveValue(i));
    }
    else {
      this.lastChanged = "selectorsToRemove-" + i;
      this.props.dispatch(changeOrAddRemoveValue(i, e.target.value));
    }
  }

  changeTagsValue(i, e) {
    if (e.target.value === "" || e.target.value === null) {
      this.props.dispatch(deleteTagsValue(i));
    }
    else {
      this.lastChanged = "tags-" + i;
      this.props.dispatch(changeOrAddTagsValue(i, e.target.value));
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
    let pagesUrls = [];

    const { pagesItems } = this.props.settings.pages;
    const { color, testerEngine, tags, selectorsToHide, selectorsToRemove, error } = this.props.settings;

    for (let i = 0; i < pagesItems.length; i++) {
      pagesUrls.push(<div key={pagesItems[i].id}>
        <div class="compare-url-title">{i + 1}. <input type="text" placeholder="Scenario name" value={pagesItems[i].name} onChange={this.changeValueOfPageUrlPair.bind(this, i, "FIELD_NAME")}/> <a class="delete button" onClick={this.deletePageUrlPair.bind(this, i)}>Delete</a></div>
        <div class={this.state.type === "a_b" ? "urls row a-b" : "urls row before-after"}>
          {this.state.type === "a_b" ? (
          <div class="url1">
            <div class="url1-title">URL1</div>
            <div class="url1-input"><input type="text" placeholder="Reference URL" value={pagesItems[i].source} onChange={this.changeValueOfPageUrlPair.bind(this, i, "FIELD_SOURCE")}/></div>
          </div>) : ""}
          {this.state.type === "a_b" ? <div class="url-vs-text col-lg-auto"> VS </div> :""}
            <div class="url2">
            <div class="url2-title">{this.state.type === "a_b" ? "URL2" : "URL"}</div>
            <div class="url2-input"><input type="text" placeholder="Test URL" value={pagesItems[i].destination} onChange={this.changeValueOfPageUrlPair.bind(this, i, "FIELD_DESTINATION")}/></div>
          </div>
        </div>
      </div>);
    }

    return (
      <div class="create-page">
        <h2 class={this.state.type === "a_b" ? "compare a-b" : "compare before-after"}>Add {this.state.type === "a_b" ? "a 2 website" : "Before/After"} comparison name</h2>
        <div id="compare-site-title" class="compare-site-title">
          <input type="text" placeholder="Test case title" value={this.props.settings.title} onChange={this.changeTitle.bind(this)} />
        </div>
        <div id="compare-site-viewports" class="compare-site-viewports">
          {this.renderViewports()}
        </div>
        <div id="compare-site-data" class="compare-site-data">
          <div id="compare-site-data-container" class="compare-site-data-container">
            {pagesUrls}
            <div><a onClick={this.addNewPageUrlPair.bind(this)} class="btn btn-link btn-sm add-new-page-pair">+ Add new page pair</a></div>
          </div>
        </div>
        <div id="compare-site-other-data" class="compare-site-other-data">
          <div>
            <div class="input-title">Selectors to hide:</div>
            {selectorsToHide.map((toHide, i) => {
              return (<div key={"toHide" + i}>{i + 1}. <input ref={"selectorsToHide-" + i} type="text" value={toHide} onChange={this.changeHideValue.bind(this, i)}/></div>);
            })}
            {selectorsToHide.length + 1}. <input key={"toHide" + selectorsToHide.length} type="text" value="" onChange={this.changeHideValue.bind(this, selectorsToHide.length)}/>
          </div>
          <div>
            <div class="input-title">Selectors to remove</div>
            {selectorsToRemove.map((toRemove, i) => {
              return (<div key={"toRemove" + i}>{i + 1}. <input ref={"selectorsToRemove-" + i} type="text" value={toRemove} onChange={this.changeRemoveValue.bind(this, i)}/></div>);
            })}
            {selectorsToRemove.length + 1}. <input key={"toRemove" + selectorsToRemove.length} type="text" value="" onChange={this.changeRemoveValue.bind(this, selectorsToRemove.length)}/>
          </div>
          <div>
            Tester engine:&nbsp;
            <select value={testerEngine}>
              {diffEngines.map((engine) => {
                return <option key={engine.code} value={engine.code}>{engine.name}</option>
              })}
            </select>
          </div>
          <div>
            Diff color:&nbsp;
            <div class="color-picker-swatch" onClick={ this.handleClick }>
              <div class="color-picker-color" style={ {background: color} } />
            </div>
            { this.state.displayColorPicker ? <div class="color-picker-popover">
                <div class="color-picker-cover" onClick={ this.handleClose }/>
                <SketchPicker disableAlpha color={color} onChange={ this.handleChange } />
              </div> : null }
          </div>
          <div>
            <div class="input-title">Tags:</div>
            {tags.map((tags, i) => {
              return (<div key={"tags" + i}>{i + 1}. <input ref={"tags-" + i} type="text" value={tags} onChange={this.changeTagsValue.bind(this, i)}/></div>);
            })}
            {tags.length + 1}. <input key={"tags" + tags.length} type="text" value="" onChange={this.changeTagsValue.bind(this, tags.length)}/>
          </div>
        </div>
        <div class="action-btn">
          <a onClick={this.runTest.bind(this)} class="btn btn-link btn-sm save-and-run">Save & Run the test</a>
          <a onClick={this.save.bind(this)} class="btn btn-link btn-sm save">Save</a>
          <Link to="/" class="btn btn-link btn-sm cancel">Cancel</Link>
        </div>
        <Messages notGlobal errorMessage={error} /*successMessage={sMessage} infoMessage={message}*/ />
      </div>
    );
  }

  renderViewports() {
    const { viewports } = this.props.settings;
    if (viewports.editOn) {
      let viewportsItems = [];
      for (let i = 0; i < viewports.viewportsItems.length; i++) {
        viewportsItems.push(<div key={viewports.viewportsItems[i].id}>
          {i + 1}. <input type="text" class="viewport-width" placeholder="Width" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_WIDTH")} value={viewports.viewportsItems[i].width} />*
          <input type="text" class="viewport-height" placeholder="Height" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_HEIGHT")} value={viewports.viewportsItems[i].height} />
          &nbsp;(<input type="text" class="viewport-name" placeholder="Viewport name" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_NAME")} value={viewports.viewportsItems[i].name} />) <a onClick={this.deleteViewport.bind(this, i)} class="btn btn-link btn-sm">Delete</a>
        </div>);
      }

      return (
        <div class="viewports-container">
          <div>Viewports</div>
          {viewportsItems}
          <div class="buttons"><a onClick={this.editAddNewViewports.bind(this)} class="btn btn-link btn-sm">+ Add new viewport</a></div>
        </div>
      );
    }


    return (
      <div class="viewports-container">
        <div>Viewports (<button onClick={this.editViewports.bind(this)}>Edit</button>)</div>
      </div>);
  }
}
