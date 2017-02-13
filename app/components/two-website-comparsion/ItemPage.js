import React, { Component } from 'react';
import axios from 'app/utils/axios';

export default class TwoWebsiteComparsionItemPage extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      data: null
    };
  }

  componentDidMount() {
    const { id } = this.props.params;

    axios.get(`api/rest/v1/qa_shot_test/${id}?_format=json`).then(response => {
      this.setState({
        isLoading: false,
        data: response.data
      });
    });
  }

  render() {
    const { isLoading, data } = this.state;

    if (isLoading) {
      return (
        <div className="text-center">
          <span className="loading-spinner"></span>
        </div>
      );
    }
    else {
      return <span>{data.name[0].value}</span>
    }
  }
}
