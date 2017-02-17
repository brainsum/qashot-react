import React, { Component } from 'react';
import { connect } from "react-redux";

import { fetchTest } from '../../actions/testActions';

@connect((store) => {
  return {
    isLoading: store.test.fetching,
    loaded: store.test.fetched,
    data: store.test.test.data,
  };
})
export default class TwoWebsiteComparsionItemPage extends Component {
  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(fetchTest(id));
  }

  render() {
    const { isLoading, loaded, data } = this.props;

    if (loaded) {
      return <span>{data.name[0].value}</span>
    }
    else {
      return (
        <div class="text-center">
          <span class="loading-spinner"></span>
        </div>
      );
    }
  }
}
