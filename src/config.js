import merge from 'lodash/merge';

const config = {};

config.values = {
  api: {
    hosts: {
      base: {
        prod: {
          url: 'https://product-backend.qashot.com',
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
