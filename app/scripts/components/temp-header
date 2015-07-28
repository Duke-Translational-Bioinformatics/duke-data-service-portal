import React from 'react';
import { Link } from 'react-router';
import ProjectListActions from '../actions/projectListActions';

class Header extends React.Component {

    constructor(props, context) {
        super(props);

    }

    render() {
        var Child = this.props.isLoggedIn ? LogoutMenu : LoginMenu;
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <div className="mdl-layout__header-row">
                        <!-- Title -->
                        <span className="mdl-layout-title">Duke Data Services</span>
                        <!-- Add spacer, to align navigation to the right -->
                        <div className="mdl-layout-spacer"></div>
                        <!-- This should be a separate component -->
                        <SearchBar {...this.props}/>
                        <div className="mdl-layout-spacer"></div>
                        <div className="mdl-layout-spacer"></div>
                        <!--Need to add current user component here-->
                        <Child {...this.props} />
                    </div>
                </header>
                <!-- Side Nav needs to be broken into a different component -->
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
            </div>
        );
    }

}

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
        color: '#fff'
    },
}

var LoginMenu = React.createClass({

    render: function() {
        return (
            <div>
                <i className="material-icons" style={styles.icon}>account_box</i>
                <button className="mdl-button mdl-js-button" style={styles.loginButton}>
                    LOGOUT
                </button>
            </div>
        )
    }
});

var LogoutMenu = React.createClass({

    render: function() {
        return (
            <div>
            <i className="material-icons" style={styles.icon}>account_box</i>
            <button className="mdl-button mdl-js-button" style={styles.loginButton}>
                LOGOUT
            </button>
            </div>
        )
    }
});

var SearchBar = React.createClass({
    render: function() {
        return (
            <form>
                <input type="text"
                       onChange={this.props.handleChange}
                       className="searchBar"
                       placeholder="Search" />
            </form>
        )
    }
});

Header.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Header;
