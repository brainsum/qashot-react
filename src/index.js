import React from 'react';
import { render } from 'react-dom';
import { Provider } from "react-redux"

import './sass/index.sass';

import store from './store';
import config from './config';
import App from './components/App';

config.set();

render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
