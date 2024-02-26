const childProcess = require('child_process');
const path = require('path');

const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// Execute Git command to get the current commit ID
const commitHash = childProcess.execSync('git rev-parse --short HEAD').toString().trim();

module.exports = (env, argv) => {
  console.log(`Mode: ${argv.mode}`);
  return {
    entry:  './src/index.tsx',
    output: {
      filename:   'main.js',
      path:       path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer:  ['buffer', 'Buffer']
      }),
      new webpack.EnvironmentPlugin({
        DEBUG:                                true,
        REACT_APP_BASE_PATH:                  'fastauth',
        // NETWORK_ID:                           'testnet',
        // RELAYER_URL:                          'http://18.141.153.225/relayer',
        // FIREBASE_API_KEY:                     'AIzaSyDuH9KIRTgYIvdD9fIvT9nchBpgHcdPgGA',
        // FIREBASE_AUTH_DOMAIN:                 'popula-8848e.firebaseapp.com',
        // FIREBASE_PROJECT_ID:                  'popula-8848e',
        // FIREBASE_STORAGE_BUCKET:              'popula-8848e.appspot.com',
        // FIREBASE_MESSAGING_SENDER_ID:         '1054630653822',
        // FIREBASE_APP_ID:                      '1:1054630653822:web:56ccf196688c8b5dcf0d2f',
        // FIREBASE_MEASUREMENT_ID:              'G-NMH0CYTV90',
        // RELAYER_URL_TESTNET:                  'http://18.141.153.225/relayer',
        // FIREBASE_API_KEY_TESTNET:                     'AIzaSyDuH9KIRTgYIvdD9fIvT9nchBpgHcdPgGA',
        // FIREBASE_AUTH_DOMAIN_TESTNET:                 'popula-8848e.firebaseapp.com',
        // FIREBASE_PROJECT_ID_TESTNET:                  'popula-8848e',
        // FIREBASE_STORAGE_BUCKET_TESTNET:              'popula-8848e.appspot.com',
        // FIREBASE_MESSAGING_SENDER_ID_TESTNET:         '1054630653822',
        // FIREBASE_APP_ID_TESTNET:                      '1:1054630653822:web:56ccf196688c8b5dcf0d2f',
        // FIREBASE_MEASUREMENT_ID_TESTNET:              'G-NMH0CYTV90',
        // SENTRY_DSN:                           'https://1049553ebca8337848160ca53a49ff2a@o398573.ingest.sentry.io/4506148066164736',
        // SENTRY_DSN_TESTNET:                   'https://1049553ebca8337848160ca53a49ff2a@o398573.ingest.sentry.io/4506148066164736',
        // DEBUG:                                true,
        // REACT_APP_BASE_PATH:                  '',
        NETWORK_ID:                           'testnet',
        RELAYER_URL:                          'http://13.228.213.110/relayer',
        FIREBASE_API_KEY:                     'AIzaSyDhxTQVeoWdnbpYTocBAABbLULGf6H5khQ',
        FIREBASE_AUTH_DOMAIN:                 'near-fastauth-prod.firebaseapp.com',
        FIREBASE_PROJECT_ID:                  'near-fastauth-prod',
        FIREBASE_STORAGE_BUCKET:              'near-fastauth-prod.appspot.com',
        FIREBASE_MESSAGING_SENDER_ID:         '829449955812',
        FIREBASE_APP_ID:                      '1:829449955812:web:532436aa35572be60abff1',
        FIREBASE_MEASUREMENT_ID:              'G-T2PPJ8QRYY',
        RELAYER_URL_TESTNET:                  'http://13.228.213.110/relayer',
        FIREBASE_API_KEY_TESTNET:             'AIzaSyDAh6lSSkEbpRekkGYdDM5jazV6IQnIZFU',
        FIREBASE_AUTH_DOMAIN_TESTNET:         'pagoda-oboarding-dev.firebaseapp.com',
        FIREBASE_PROJECT_ID_TESTNET:          'pagoda-oboarding-dev',
        FIREBASE_STORAGE_BUCKET_TESTNET:      'pagoda-oboarding-dev.appspot.com',
        FIREBASE_MESSAGING_SENDER_ID_TESTNET: '116526963563',
        FIREBASE_APP_ID_TESTNET:              '1:116526963563:web:053cb0c425bf514007ca2e',
        FIREBASE_MEASUREMENT_ID_TESTNET:      'G-HF2NBGE60S',
        SENTRY_DSN:                           'https://1049553ebca8337848160ca53a49ff2a@o398573.ingest.sentry.io/4506148066164736',
        SENTRY_DSN_TESTNET:                   'https://ce94b1ec626e971719c20fa7979158f3@o398573.ingest.sentry.io/4506702275411968',
        GIT_COMMIT_HASH:                      commitHash,
      }),
      ...(process.env.SENTRY_AUTH_TOKEN
        ? [sentryWebpackPlugin({
          org:        'near-protocol',
          project:    process.env.NETWORK_ID === 'mainnet' ? 'fast-auth-signer' : 'fast-auth-signer-testnet',
          authToken:  process.env.SENTRY_AUTH_TOKEN,
          release:    { name: commitHash },
          sourcemaps: { assets: ['./dist/main.js', './dist/main.js.map'] },
          telemetry:  false,
          urlPrefix:  '~/',
        })]
        : []
      )],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: 3000,
    },
    devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',
    module:  {
      // exclude node_modules
      rules: [
        {
          test:    /\.(js|ts|tsx)$/,
          exclude: /node_modules/,
          use:     ['ts-loader'],
        },
        {
          test: /\.css$/i,
          use:  ['style-loader', 'css-loader'],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
        },
      ],
    },
    // pass all js files through Babel
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.css'],
      fallback:   {
        https:             require.resolve('https-browserify'),
        http:              require.resolve('stream-http'),
        // crypto:   require.resolve('crypto-browserify'),
        crypto:            false,
        stream:            require.resolve('stream-browserify'),
        process:           require.resolve('process/browser'),
        'process/browser': require.resolve('process/browser'),
        url:               require.resolve('url/')
      }
    }
  };
};
