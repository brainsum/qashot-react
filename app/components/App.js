import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter, Match, Link } from 'react-router';
import { connect } from "react-redux";

import TestsPage from './tests/TestsPage';
import CreateTwoWebsiteComparsionPage from './create/CreatePage';
import TwoWebsiteComparsionPage from './two-website-comparsion/ItemPage';
import {setUserLoginData, userLogin} from "../actions/userActions";
import Messages from "./part/message";
import BeforeAfterComparsionItemPage from "./before-after-comparsion/ItemPage";

@connect((store) => {
  return {
    loginname: store.user.loginname,
    password: store.user.password,
    success: store.user.success,
  };
})
export default class App extends Component {
  constructor(props) {
    super(props);

    const { loginname, password } = this.props;
    this.state = {
      loginname: loginname || "",
      password: password || "",
    };
  }

  login(e) {
    e.preventDefault();
    this.props.dispatch(setUserLoginData(this.state.loginname, this.state.password));
    this.props.dispatch(userLogin());
    return false;
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onUserChange(e) {
    this.setState({
      loginname: e.target.value,
    });
  }

  render() {
    return (
      <HashRouter>
        <div class="container page">
          <header class="container__inner page__header header">
            <Link to="/" class="header__title">
              <h1>QA Shot</h1>
              <span>Automated Screenshot Comparisons</span>
            </Link>
          </header>
          {this.renderContent()}
          <footer class="container__inner page__footer">
            QA Shot
          </footer>
        </div>
      </HashRouter>
    );
  }

  renderContent() {
    const { loginname, password, success } = this.props;

    if (loginname === null || password === null || !success) {
      return (
        <div class="container__inner page__content bg-white">
          <Messages/>
          <form action="#" onSubmit={this.login.bind(this)}>
            Username: <input type="text" value={this.state.loginname} onChange={this.onUserChange.bind(this)} /><br/>
            Password: <input type="password" value={this.state.password} onChange={this.onPasswordChange.bind(this)} /><br/>
            <input type="submit" onClick={this.login.bind(this)}/>
          </form>
        </div>
      );
    }

    return (
      <div class="container__inner page__content bg-white">
        <Messages/>
        <Match exactly pattern="/" component={TestsPage} />
        <Match exactly pattern="/create/two-website-comparsion" component={CreateTwoWebsiteComparsionPage} />
        <Match exactly pattern="/create/before-after-comparsion" component={CreateTwoWebsiteComparsionPage} />
        <Match exactly pattern="/two-website-comparsion/:id" component={TwoWebsiteComparsionPage} />
        <Match exactly pattern="/before-after-comparsion/:id" component={BeforeAfterComparsionItemPage} />
      </div>
    );
  }
}