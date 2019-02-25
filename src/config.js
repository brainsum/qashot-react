import merge from 'lodash/merge';

const config = {};

config.values = {
  api: {
    hosts: {
      base: {
        prod: {
          url: 'http://ec2-52-51-88-127.eu-west-1.compute.amazonaws.com',
        }
      }
    }
  }
}

/**
 * 
 * Set global config object
 * 
*/
config.set = function() {
  let globalValues = (typeof window.QAConfig === 'undefined') ? {} : window.QAConfig;
  let localValues = this.values;

  window.QAConfig = merge(localValues, globalValues);
}


export default config;
