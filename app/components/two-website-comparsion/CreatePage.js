import React, { Component } from 'react';
import axios from '../../utils/axios';

export default class TwoWebsiteComparsionCreatePage extends Component {
  componentDidMount() {
    axios.post('api/rest/v1/qa_shot_test?_format=json', {
      user_id: [ { target_id: 1 } ],
      name: [ { value: 'test' } ],
      field_scenario: [
        {
          "label": "Google",
          "referenceUrl": "http://www.google.com",
          "testUrl": "http://www.google.hu"
        }
      ],
      "field_viewport": [
        {
            "name": "Desktop",
            "width": "1366",
            "height": "768"
        }
      ]
    }).then(response => {
      console.log(response.data);
    })
  }

  render() {
    return (
      <h2>Create 2 site comparsion</h2>
    );
  }
}
