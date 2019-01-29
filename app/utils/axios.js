import store from "../store";
import axios from 'axios';
import axiosRetry from 'axios-retry';

export default () => {
  let state = store.getState();
  let loginname = state.user.loginname;
  let password = state.user.password;

  let exactAxio = axios.create({
    // baseURL: 'http://ec2-52-51-88-127.eu-west-1.compute.amazonaws.com',
    baseURL: 'http://qashot.docker.localhost:8000',
    //baseURL: 'http://qashot.dd:8083',
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
