import React, { Component } from 'react';
import { HashRouter, Link, Route } from 'react-router-dom'
import { connect } from "react-redux";

import TestsPage from './tests/TestsPage';
import CreateTwoWebsiteComparsionPage from './create/CreatePage';
import TwoWebsiteComparsionPage from './two-website-comparsion/ItemPage';
import {setUserLoginData, userLogin, userLogout} from "../actions/userActions";
import Messages from "./part/message";
import BeforeAfterComparsionItemPage from "./before-after-comparsion/ItemPage";


class App extends Component {
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
  
  logout() {
    this.props.dispatch(userLogout());
    return false;
  }
  
  render() {
    const { loginname, password, success } = this.props;
    
    let logout = null;
    if (loginname !== null && password !== null && success) {
      logout = <li className="nav-item"><a className="nav-link" onClick={this.logout.bind(this)} href="#">Logout</a></li>;
    }
    
    return (
      <HashRouter>
        <div className="container page">
          <header className="container__inner page__header header">
            <Link to="/" className="header__title">
            <h1>QA Shot</h1>
            <span>Automated Screenshot Comparisons</span>
            </Link>
            {logout === null ? "" :
            <nav className="navbar navbar-expand-lg navbar-light bg-light rounded">
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  {logout}
                </ul>
              </div>
            </nav>}
          </header>
          {this.renderContent()}
          <footer className="container__inner page__footer">QA Shot</footer>
        </div>
      </HashRouter>
    );
  }
  
  renderContent() {
    const { loginname, password, success } = this.props;

    if (loginname === null || password === null || !success) {
      return (
        <div className="container__inner page__content bg-white">
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
      <div className="container__inner page__content bg-white">
        <Messages/>
        <Route exactly pattern="/" component={TestsPage} />
        <Route exactly pattern="/create/two-website-comparsion" component={CreateTwoWebsiteComparsionPage} />
        <Route exactly pattern="/create/before-after-comparsion" component={CreateTwoWebsiteComparsionPage} />
        <Route exactly pattern="/two-website-comparsion/:id" component={TwoWebsiteComparsionPage} />
        {/* <Route exactly pattern="/before-after-comparsion/:id" component={BeforeAfterComparsionItemPage} /> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loginname: state.user.loginname,
    password: state.user.password,
    success: state.user.success,
  };
};

const AppContainer = connect(mapStateToProps)(App);
  
export default AppContainer;
      