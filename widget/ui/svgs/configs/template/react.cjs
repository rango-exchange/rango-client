const template = (variables, options) => {
  return options.tpl`
  import React, {createElement} from 'react';
  import type {SvgIconPropsWithChildren} from '../components/SvgIcon/index.js';
  import {SvgIcon} from '../components/SvgIcon/index.js';
  
    ${variables.imports};
  
    ${variables.interfaces};
    
    function ${variables.componentName}(props: SvgIconPropsWithChildren){
      return createElement(SvgIcon, props, ${variables.jsx})
    }
    
    ${variables.exports};
  `;
};

module.exports = template;
