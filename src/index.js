import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import * as serviceWorker from './serviceWorker';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {compose, createStore, applyMiddleware,} from "redux";
import rootReducer from "./Components/Reducers/rootReducer";
//require('typeface-open-sans')

import CssBaseline from "@material-ui/core/CssBaseline";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer,composeEnhancers(
     applyMiddleware(thunk)
));

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#1F3F49',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
    },
    typography: {
        font: '15px/15px \'Open Sans\', sans-serif',
        fontFamily: [
            'Open Sans',
        ].join(','),
    },
});



ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <App/>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
