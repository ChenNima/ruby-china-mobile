import React from 'react';
import { Provider } from 'react-redux';
import { RouteContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import createStore from '../../common/store';

const createPage = (content = '', state = {}, options) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Ruby China Mobile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>

        <!-- WARNING: See TODO in client/index.jsx -->
        <!--style type="text/css">html, body { margin: 0;}</style-->
      </head>
      <body>
        <div id="app">${content}</div>
        <script>window.__INITIAL_STATE__ = ${JSON.stringify(state)};</script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;
};

export default(renderProps, initialData) => {
  const store = createStore(initialData);
  const content = renderToString(
    <Provider store={store}>
      <RouteContext {...renderProps} />
    </Provider>
  );
  const state = store.getState();
  return (options) => createPage(content, state, options);
}