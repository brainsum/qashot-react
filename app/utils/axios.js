import axios from 'axios';

export default axios.create({
  baseURL: 'http://ec2-52-51-88-127.eu-west-1.compute.amazonaws.com',
  auth: {
    username: 'restapi',
    password: 'tester'
  }
});
