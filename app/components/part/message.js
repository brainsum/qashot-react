import React, { Component } from 'react';
import { connect } from "react-redux";
import {removeAllMessages, removeMessage} from "../../actions/messageActions"

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

  removeMessage(id, delay, message_type) {
    setTimeout(() => {
      this.props.dispatch(removeMessage(id, message_type));
    }, delay);
  }

  removeAllMessage(message_type) {
    this.props.dispatch(removeAllMessages(message_type));
  }

  render() {
    const {errorMessage, infoMessage, warningMessage, successMessage} = this.props;

    let errorMessageTags;
    if (errorMessage && errorMessage.length > 0) {
      errorMessageTags = (
        <div class="alert alert-danger alert-dismissable" key="error">
          <a class="close" aria-label="close" onClick={this.removeAllMessage.bind(this, "error")}>&times;</a>
          {errorMessage.map((item, i) => {
            if (item.autoHideDelay !== 0 && Number.isInteger(item.autoHideDelay)) {
              this.removeMessage(item.id, item.autoHideDelay, "error");
            }

            return (<span key={"error_" + i}>{item.spinner ? <span class="loading-spinner"/> : "" }<strong>ERROR!</strong> {item.fullMessage.split('\n').map((item, key) => {
              return <span key={"error_message_" + key}>{key > 0 ? <br/> : ""}{item}</span>;
            })}{i < 1 ? <br/> : ""}</span>)
          })}
        </div>
      );
    }

    let warningMessageTags;
    if (warningMessage && warningMessage.length > 0) {
      warningMessageTags = (
        <div class="alert alert-warning alert-dismissable" key="error">
          <a class="close" aria-label="close" onClick={this.removeAllMessage.bind(this, "warning")}>&times;</a>
          {warningMessage.map((item, i) => {
            if (item.autoHideDelay !== 0 && Number.isInteger(item.autoHideDelay)) {
              this.removeMessage(item.id, item.autoHideDelay, "warning");
            }

            return (<span key={"warning_" + i}>{item.spinner ? <span class="loading-spinner"/> : "" }<strong>Warning!</strong> {item.message.split('\n').map((item, key) => {
              return <span key={"warning_message_" + key}>{key > 0 ? <br/> : ""}{item}</span>;
            })}{i < 1 ? <br/> : ""}</span>)
          })}
        </div>
      );
    }

    let infoMessageTags;
    if (infoMessage && infoMessage.length > 0) {
      infoMessageTags = (
        <div class="alert alert-info alert-dismissable" key="info">
          <a class="close" aria-label="close" onClick={this.removeAllMessage.bind(this, "info")}>&times;</a>
          {infoMessage.map((item, i) => {
            if (item.autoHideDelay !== 0 && Number.isInteger(item.autoHideDelay)) {
              this.removeMessage(item.id, item.autoHideDelay, "info");
            }

            return (<span key={"info_" + i}>{item.spinner ? <span class="loading-spinner"/> : "" }{item.message.split('\n').map((item, key) => {
              return <span key={"info_message_" + key}>{key > 0 ? <br/> : ""}{item}</span>;
            })}{i < 1 ? <br/> : ""}</span>)
          })}
        </div>
      );
    }

    let successMessageTags;
    if (successMessage && successMessage.length > 0) {
      successMessageTags = (
        <div class="alert alert-success alert-dismissable" key="success">
          <a class="close" aria-label="close" onClick={this.removeAllMessage.bind(this, "success")}>&times;</a>
          {successMessage.map((item, i) => {
            if (item.autoHideDelay !== 0 && Number.isInteger(item.autoHideDelay)) {
              this.removeMessage(item.id, item.autoHideDelay, "success");
            }

            return (<span key={"success_" + i}>{item.spinner ? <span class="loading-spinner"/> : "" }{item.message.split('\n').map((item, key) => {
              return <span key={"success_message_" + key}>{key > 0 ? <br/> : ""}{item}</span>;
            })}{i < 1 ? <br/> : ""}</span>)
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
