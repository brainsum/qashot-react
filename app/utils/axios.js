import store from "../store";
import axios from 'axios';

export default () => {
  let state = store.getState();
  let loginname = state.user.loginname;
  let password = state.user.password;

  return axios.create({
    baseURL: 'http://ec2-52-51-88-127.eu-west-1.compute.amazonaws.com',
    //baseURL: 'http://qashot.dd:8083',
    auth: {
      username: loginname,
      password: password
    }
  });
}
