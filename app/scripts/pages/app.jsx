import React from 'react';
import { RouteHandler } from 'react-router';
import Header from '../components/header.jsx'
let mui = require('material-ui');
let ThemeManager = new mui.Styles.ThemeManager();
let appPalette = {
    primary1Color: "#303F9F",
    primary2Color: "#3F51B5",
    primary3Color: "#C5CAE9",
    accent1Color: "#448AFF",
    accent2Color: "#ED2B2B",
    accent3Color: "#F58C8C"
};

class App extends React.Component {

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    };

    componentWillMount() {
        ThemeManager.setPalette(appPalette);
    };

    render() {
        return (
            <div>
                <Header />
                <div className="content">
                    <RouteHandler/>
                </div>
            </div>
        );
    }

}

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;