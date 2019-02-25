import store from "../store";
import axios from 'axios';
import axiosRetry from 'axios-retry';

export default () => {
  let state = store.getState();
  let loginname = state.user.loginname;
  let password = state.user.password;

  let exactAxio = axios.create({
    baseURL: window.QAConfig.api.hosts.base.prod.url,
    auth: {
      username: loginname,
      password: password
    },
    xsrfCookieName: "CSRF-Token",
    xsrfHeaderName: "X-CSRF-Token",
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // If there's a network or 5XX error, retry it 3 times.
  axiosRetry(exactAxio, { retries: 3 });

  return exactAxio;
}
