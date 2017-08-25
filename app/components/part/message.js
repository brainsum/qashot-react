import React, { Component } from 'react';
import { connect } from "react-redux";

@connect((store, props) => {
  let selector = typeof props.notGlobal !== "undefined" && props.notGlobal;
  return {
    errorMessage: selector ? (props.errorMessage || []) : store.messages.errorMessage,
    warningMessage: selector ? (props.warningMessage || []) : store.messages.warningMessage,
    successMessage: selector ? (props.successMessage || []) : store.messages.successMessage,
    infoMessage: selector ? (props.infoMessage || []) : store.messages.infoMessage,
  };
})
export default class Messages extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {errorMessage, infoMessage, warningMessage, successMessage} = this.props;

    let errorMessageTags;
    if (errorMessage && errorMessage.length > 0) {
      errorMessageTags = (
        <div class="alert alert-danger alert-dismissable" key="error">
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
          {errorMessage.map((item, i) => {
            return (<span key={"error_" + i}>{item.spinner ? <span class="loading-spinner"/> : "" }<strong>ERROR!</strong> {item.fullMessage}</span>)
          })}
        </div>
      );
    }

    let warningMessageTags;
    if (warningMessage && warningMessage.length > 0) {
      warningMessageTags = (
        <div class="alert alert-warning alert-dismissable" key="error">
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
          {warningMessage.map((item, i) => {
            return (<span key={"warning_" + i}>{item.spinner ? <span class="loading-spinner"/> : "" }<strong>Warning!</strong> {item.message}</span>)
          })}
        </div>
      );
    }

    let infoMessageTags;
    if (infoMessage && infoMessage.length > 0) {
      infoMessageTags = (
        <div class="alert alert-info alert-dismissable" key="info">
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
          {infoMessage.map((item, i) => {
            return (<span key={"info_" + i}>{item.spinner ? <span class="loading-spinner"/> : "" }{item.message}</span>)
          })}
        </div>
      );
    }

    let successMessageTags;
    if (successMessage && successMessage.length > 0) {
      successMessageTags = (
        <div class="alert alert-success alert-dismissable" key="success">
          <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
          {successMessage.map((item, i) => {
            return (<span key={"success_" + i}>{item.spinner ? <span class="loading-spinner"/> : "" }{item.message}</span>)
          })}
        </div>
      );
    }

    return (
      <div class="messages alerts">
        {errorMessageTags}
        {warningMessageTags}
        {successMessageTags}
        {infoMessageTags}
      </div>
      );
  }
}
