module.exports = function(api) {
  const es6 = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            safari: 10,
          },
          modules: 'commonjs',
          useBuiltIns: 'entry',
          debug: false,
        },
      ],
    ],
    plugins: [
      '@babel/plugin-transform-block-scoped-functions',
    ],
  };

  const es5 = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            ie: 9,
          },
          modules: 'commonjs',
          useBuiltIns: 'entry',
          debug: false,
        },
      ],
    ],
    plugins: [],
  };

  return (api.env() === 'es6')
    ? es6
    : es5;
};
