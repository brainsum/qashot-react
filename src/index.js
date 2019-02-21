import React from 'react';
import { render } from 'react-dom';
import { Provider } from "react-redux"
// Use this, if you have support for sass translator. In windows it will work
// only with build >150XX (currently Preview version) Bash for Windows,
// release date 11 apr 2017, but you can download now.
import './sass/index.sass';

import store from './store';
import App from './components/App';

render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
