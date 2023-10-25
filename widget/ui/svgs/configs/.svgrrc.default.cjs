module.exports = {
  jsx: {
    babelConfig: {
      plugins: [
        [
          '@svgr/babel-plugin-remove-jsx-attribute',
          {
            elements: ['svg'],
            attributes: ['id', 'width', 'height', 'class', 'title', 'fill'],
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
    '#010101': 'currentColor',
  },
  template: require('./template/react.cjs'),
  indexTemplate: require('./template/index.cjs'),
};
