const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries')

const config = [
  {
    mode: 'development',
    name: 'unlogic',
    entry: {
      unlogic: ['./unlogic.js'],
    },
    output: {
      path: path.resolve('../dist/core'),
      filename: '[name].js',
      libraryTarget: 'umd',
      library: 'unlogic',
      globalObject: "typeof self !== 'undefined' ? self : this",
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'react',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'react-dom',
      },
    },
    resolve: {
      extensions: ['.js', '.json'],
    },

    module: {
      rules: [
        {
          exclude: /(node_modules)/,
          test: /\.js$/,

          use: [
            {
              loader: 'babel-loader',

              options: {
                presets: ['es2015'],
              },
            },
          ],
        },
      ],
    },
  },
  {
    mode: 'development',
    name: 'unlogic-ui',
    entry: {
      'unlogic-ui': ['./unlogic-ui.js'],
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'react',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'react-dom',
      },
    },
    output: {
      path: path.resolve('../dist/ui'),
      filename: '[name].js',
      libraryTarget: 'umd',
      library: 'unlogic-ui',
    },
    plugins: [new MiniCssExtractPlugin({ filename: '[name].css' })],
    resolve: {
      extensions: ['.js', '.json'],
    },
    module: {
      rules: [
        {
          exclude: /(node_modules)/,
          test: /\.js$/,

          use: [
            {
              loader: 'babel-loader',

              options: {
                presets: ['react', 'es2015'],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
          ],
        },
      ],
    },
  },
  {
    mode: 'development',
    name: 'unlogic-ui-styles',
    entry: {
      'list-with-selectable-items': [
        './ui/styles/list-with-selectable-items.css',
      ],
    },
    output: {
      path: path.resolve('../dist/ui/styles'),
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: '[name].css' }),
      new FixStyleOnlyEntriesPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
          ],
        },
      ],
    },
  },
]

module.exports = config
