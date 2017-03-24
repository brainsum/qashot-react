import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router";

import { fetchTest } from '../../actions/testActions';
import {
  loadTestEditor,
  addNewPageUrlPair, addNewViewport,
  changeValueOfPageUrlPair,
  changeValueOfTitle, changeValueOfViewport, deletePageUrlPair, deleteViewport,
  editViewports,
  saveTest, saveAndRunTest
} from "../../actions/editorActions";

@connect((store) => {
  return {
    settings: store.editor,
  };
})
export default class TwoWebsiteComparsionCreatePage extends Component {
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
    this.props.dispatch(saveTest(this.props.settings));
  }

  runTest() {
    this.props.dispatch(saveAndRunTest(this.props.settings));
  }

  render() {
    let pagesUrls = [];

    const { pagesItems } = this.props.settings.pages;

    for (let i = 0; i < pagesItems.length; i++) {
      pagesUrls.push(<div key={pagesItems[i].id}>
        <div class="compare-url-title">{i + 1}. <input type="text" placeholder="Scenario name" value={pagesItems[i].name} onChange={this.changeValueOfPageUrlPair.bind(this, i, "FIELD_NAME")}/></div>
        <div class="right-buttons"><a onClick={this.deletePageUrlPair.bind(this, i)}>Delete</a></div>
        <div class="urls row">
          <div class="url1 col-lg-5">
            <div class="url1-title">URL1</div>
            <div class="url1-input"><input type="text" placeholder="Reference URL" value={pagesItems[i].source} onChange={this.changeValueOfPageUrlPair.bind(this, i, "FIELD_SOURCE")}/></div>
          </div>
          <div class="url-vs-text col-lg-auto"> VS </div>
          <div class="url2 col-lg-5">
            <div class="url2-title">URL2</div>
            <div class="url2-input"><input type="text" placeholder="Test URL" value={pagesItems[i].destination} onChange={this.changeValueOfPageUrlPair.bind(this, i, "FIELD_DESTINATION")}/></div>
          </div>
        </div>
      </div>);
    }

    return (
      <div>
        <h2>Add a 2 website comparison name</h2>
        <div id="compare-site-title">
          <input type="text" placeholder="Test case title" value={this.props.settings.title} onChange={this.changeTitle.bind(this)} />
        </div>
        <div id="compare-site-viewports">
          {this.renderViewports()}
        </div>
        <div id="compare-site-data">
          <div id="compare-site-data-container">
            {pagesUrls}
            <div><a onClick={this.addNewPageUrlPair.bind(this)} class="btn btn-link btn-sm">+ Add new page pair</a></div>
          </div>
        </div>
        <div>
          <a onClick={this.runTest.bind(this)} class="btn btn-link btn-sm">Save & Run the test</a>
          <a onClick={this.save.bind(this)} class="btn btn-link btn-sm">Save</a>
          <Link to="/" class="btn btn-link btn-sm">Cancel</Link>
        </div>
        {this.messages()}
      </div>
    );
  }

  renderViewports() {
    const { viewports } = this.props.settings;
    if (viewports.editOn) {
      let viewportsItems = [];
      for (let i = 0; i < viewports.viewportsItems.length; i++) {
        viewportsItems.push(<div key={viewports.viewportsItems[i].id}>
          {i + 1}. <input type="text" placeholder="Width" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_WIDTH")} value={viewports.viewportsItems[i].width} />*
          <input type="text" placeholder="Height" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_HEIGHT")} value={viewports.viewportsItems[i].height} />
          &nbsp;(<input type="text" placeholder="Viewport name" onChange={this.changeValueOfViewport.bind(this, i, "FIELD_NAME")} value={viewports.viewportsItems[i].name} />) <a onClick={this.deleteViewport.bind(this, i)} class="btn btn-link btn-sm">Delete</a>
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

  messages() {
    const { error, fetching, result, state } = this.props.settings;

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
    if (fetching) {
      infoMessage = (
        <div class="alert alert-info alert-dismissable" key="info">
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
          <span class="loading-spinner"/> Request sent, waiting for server response. ({state})
        </div>
      );
    }

    let successMessage;
    if (!fetching && !error && result) {
      successMessage = (
        <div class="alert alert-success alert-dismissable" key="success">
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
          Successfully saved!
        </div>
      );
    }

    return [infoMessage, errorMessage, successMessage];
  }
}
