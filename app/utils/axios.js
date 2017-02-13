import axios from 'axios';

export default axios.create({
  baseURL: 'http://ec2-52-210-227-219.eu-west-1.compute.amazonaws.com',
  auth: {
    username: 'restapi',
    password: 'tester'
  }
});
