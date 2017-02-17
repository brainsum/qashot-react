import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter, Match, Link } from 'react-router';

import TestsPage from './tests/TestsPage';
import CreateTwoWebsiteComparsionPage from './two-website-comparsion/CreatePage';
import TwoWebsiteComparsionPage from './two-website-comparsion/ItemPage';

export default class App extends Component {
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
          <div class="container__inner page__content bg-white">
            <Match exactly pattern="/" component={TestsPage} />
            <Match exactly pattern="/create-two-website-comparsion" component={CreateTwoWebsiteComparsionPage} />
            <Match exactly pattern="/two-website-comparsion/:id" component={TwoWebsiteComparsionPage} />
          </div>
          <footer class="container__inner page__footer">
            QA Shot
          </footer>
        </div>
      </HashRouter>
    );
  }
}