import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Login from './components/login'
import store from './store'

// Webpack will take this css file and include it in the build
// style-related loaders were defined in webpack.config.js
import '../public/index.css'

// Provider is needed to wrap the rest of the application and give access to Redux Store
ReactDOM.render(
  <Provider store={store}>
    <div>Placeholder for initial content</div>
    <Login />
  </Provider>,
  document.getElementById('app')
);