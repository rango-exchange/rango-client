const template = (variables, options) => {
  return options.tpl`
  import React, {createElement} from 'react';
  import type {SvgIconProps} from '../components/SvgIcon';
  import {SvgIcon} from '../components/SvgIcon';
  
    ${variables.imports};
  
    ${variables.interfaces};
    
    function ${variables.componentName}(props: Omit<SvgIconProps, 'type'>){
      return createElement(SvgIcon, props, ${variables.jsx})
    }
    
    ${variables.exports};
  `;
};

module.exports = template;
