module.exports = {
  jsx: {
    babelConfig: {
      plugins: [
        [
          '@svgr/babel-plugin-remove-jsx-attribute',
          {
            elements: ['svg'],
            attributes: ['id', 'width', 'height', 'class', 'title'],
          },
        ],
      ],
    },
  },
  icon: false,
  plugins: ['@svgr/plugin-jsx', '@svgr/plugin-prettier'],
  typescript: true,
  outDir: 'src/icons',
  expandProps: false,
  prettier: true,
  filenameCase: 'pascal',
  jsxRuntime: 'automatic',
  replaceAttrValues: {
    '#373737': 'currentColor',
    '#727272': 'currentColor',
    '#4BBA7E': 'currentColor', // checl
    '#06C270': 'currentColor', // CheckCircle
    '#565656': 'currentColor', // copy
    '#FF3B3B': 'currentColor', // error
    '#AF8EF3': 'currentColor', // infoSolid
    '#FDFDFD': 'currentColor', // trash
    '#FF8800': 'currentColor', // warning
    '#A2A2A2': 'currentColor',
  },
  template: require('./template/react.cjs'),
};
