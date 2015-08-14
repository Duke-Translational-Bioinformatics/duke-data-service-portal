import React from 'react';
import { Link } from 'react-router';
var mui = require('material-ui'),
    TextField = mui.TextField,
    Dialog = mui.Dialog,
    Checkbox = mui.Checkbox;

class Header extends React.Component {

    constructor(props, context) {
        super(props);
    }

    render() {
        return (
            <div className="ribbon color-primary">
                <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                    <AppBar />
                    <Nav />
                </div>
            </div>
        );
    }
}

let LoginMenu = React.createClass({

    render() {
        return (
            <div>
                <i className="material-icons" style={styles.icon}>account_box</i>
                <a href="#/login"><!--temporary-->
                    <button className="mdl-button mdl-js-button"
                        style={styles.loginButton}>
                    LOGIN
                    </button>
                </a>
            </div>
        )
    }
});

let LogoutMenu = React.createClass({

    render() {
        return (
            <div>
            <i className="material-icons" style={styles.icon}>account_box</i>
            <button className="mdl-button mdl-js-button"
                    style={styles.loginButton}>
                    LOGOUT
            </button>
            </div>
        )
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
                    <Link to="home" className="mdl-navigation__link"><i className="material-icons" style={styles.navIcon}>add_circle</i>Create New Project</Link>
                    <Link to="home" className="mdl-navigation__link"><i className="material-icons" style={styles.navIcon}>settings</i>Settings</Link>
                    <Link to="home" className="mdl-navigation__link"><i className="material-icons" style={styles.navIcon}>exit_to_app</i>Log Out</Link>
                    <Link to="home" className="mdl-navigation__link"><i className="material-icons" style={styles.navIcon}>help</i>Help</Link>
                    <Link to="home" className="mdl-navigation__link">Governance</Link>
                    <Link to="home" className="mdl-navigation__link">Terms &amp; Conditions</Link>
                </nav>
            </div>
        )
    }

});

let AppBar = React.createClass({
    render() {
        var Child = this.props.isLoggedIn ? LogoutMenu : LoginMenu;
        return (
            <header className="mdl-layout__header" style={styles.headerStyle}>
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title" style={styles.titleStyle}>Duke Data Service</span>
                    <div className="mdl-layout-spacer"></div>
                    <div className="mdl-layout-spacer"></div>
                    <SearchBar {...this.props}/>
                    <div className="mdl-layout-spacer"></div>
                    <div className="mdl-layout-spacer"></div>
                    <Child {...this.props} />
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
        fontSize: 36,
        verticalAlign: -15,
        padding: 10
    },
    loginButton: {
        color: '#fff',
        margin: 10
    },
    headerStyle: {
        height: 210,
        zIndex: '0'
    },
    titleStyle: {
        fontSize: '1.3em'
    }
}

Header.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Header;
