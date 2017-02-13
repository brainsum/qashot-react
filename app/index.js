import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter, Match, Link } from 'react-router';
import 'app/sass/index.sass';

import TestsPage from 'app/components/tests/TestsPage';
import CreateTwoWebsiteComparsionPage from 'app/components/two-website-comparsion/CreatePage';
import TwoWebsiteComparsionPage from 'app/components/two-website-comparsion/ItemPage';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className="container page">
          <header className="container__inner page__header header">
            <Link to="/" className="header__title">
              <h1>QA Shot</h1>
              <span>Automated Screenshot Comparisons</span>
            </Link>
          </header>
          <div className="container__inner page__content bg-white">
            <Match exactly pattern="/" component={TestsPage} />
            <Match exactly pattern="/create-two-website-comparsion" component={CreateTwoWebsiteComparsionPage} />
            <Match exactly pattern="/two-website-comparsion/:id" component={TwoWebsiteComparsionPage} />
          </div>
          <footer className="container__inner page__footer">
            QA Shot
          </footer>
        </div>
      </HashRouter>
    );
  }
}

render(<App />, document.querySelector('#root'));
