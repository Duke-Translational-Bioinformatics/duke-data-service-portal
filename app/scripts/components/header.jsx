import React from 'react';
import { Link } from 'react-router';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
var mui = require('material-ui'),
    TextField = mui.TextField,
    Dialog = mui.Dialog,
    Checkbox = mui.Checkbox;

class Header extends React.Component {

    constructor(props, context) {
        super(props);
        this.state = {
            appConfig: MainStore.appConfig
        }
    }

    render() {
        return (
            <div className="ribbon color-primary">
                <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                    <AppBar {...this.state}/>
                    <Nav {...this.state}/>
                </div>
            </div>
        );
    }
}

let CurrentUser = React.createClass({
    render() {
        return (
            <div>
                <span style={styles.currentUser}>{this.props.appConfig.currentUser}</span>
            </div>
        )
    }
});

let LoginMenu = React.createClass({

    render() {
        let content = '';
        return (
            <div>
                {content}
            </div>
        )
    }
});

let LogoutMenu = React.createClass({

    render() {
        return (
            <div>
                <i className="material-icons" style={styles.icon}>account_box</i>
                <button className="mdl-button mdl-js-button" style={styles.loginButton} onTouchTap={this.handleTouchTap}>
                    LOGOUT
                </button>
                <CurrentUser {...this.props}/>
            </div>
        )
    },
    handleTouchTap() {
        this.props.appConfig.apiToken = null;
    }
});


let SearchBar = React.createClass({
    render() {
        return (
            <form action="#">
                <input type="text"
                       className="searchBar"
                       placeholder="Search"/>
            </form>
        )
    }
});

let Nav = React.createClass({
    render() {
        return (
            <div className="mdl-layout__drawer">
                <span className="mdl-layout-title">Duke Data Service</span>
                <nav className="mdl-navigation">
                    <Link to="home" className="mdl-navigation__link"><i className="material-icons"
                                                                        style={styles.navIcon}>add_circle</i>
                        Create New Project</Link>
                    <Link to="home" className="mdl-navigation__link"><i className="material-icons"
                                                                        style={styles.navIcon}>settings</i>Settings</Link>
                    <Link to="home" className="mdl-navigation__link"><i className="material-icons"
                                                                        style={styles.navIcon}>exit_to_app</i>
                        Logout</Link>
                    <Link to="home" className="mdl-navigation__link"><i className="material-icons"
                                                                        style={styles.navIcon}>help</i>Help</Link>
                    <Link to="home" className="mdl-navigation__link">Governance</Link>
                    <Link to="home" className="mdl-navigation__link">Terms &amp; Conditions</Link>
                </nav>
            </div>
        )
    }

});

let AppBar = React.createClass({
    render() {
        console.log('apiToken: ' + this.props.appConfig.apiToken);
        var LoginButton = this.props.appConfig.apiToken ? LogoutMenu : LoginMenu;
        return (
            <header className="mdl-layout__header" style={styles.headerStyle}>
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title" style={styles.titleStyle}>Duke Data Service</span>
                    <div className="mdl-layout-spacer"></div>
                    <div className="mdl-layout-spacer"></div>
                    <SearchBar {...this.props}/>
                    <div className="mdl-layout-spacer"></div>
                    <div className="mdl-layout-spacer"></div>
                    <LoginButton {...this.props}/>
                </div>
            </header>
        )
    }
});


var styles = {
    navIcon: {
        paddingRight: 5,
        verticalAlign: -6
    },
    icon: {
        fontSize: 24,
        verticalAlign: -15,
        padding: 10
    },
    loginButton: {
        color: '#fff',
        margin: 20
    },
    headerStyle: {
        height: 210,
        zIndex: '0'
    },
    titleStyle: {
        fontSize: '1.3em'
    },
    currentUser: {
        fontSize: '.8em'
    }
}

Header.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Header;
