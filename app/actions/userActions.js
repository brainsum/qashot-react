import axios from '../utils/axios';

export function userLogin() {
  return {
    type: "LOGIN",
    payload: axios().post(`api/rest/v1/login`)
  };
}

export function userLogout() {
  return {
    type: "LOGOUT",
    payload: null
  };
}

export function setUserLoginData(loginname, password) {
  return {
    type: "SET_LOGIN_DATA",
    payload: {
      loginname: loginname,
      password: password
    }
  };
}