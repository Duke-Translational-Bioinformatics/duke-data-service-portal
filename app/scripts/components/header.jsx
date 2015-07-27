import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {

    constructor(props, context) {
        super(props);
    }

    render() {
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <div className="mdl-layout__header-row">
                        <!-- Title -->
                        <span className="mdl-layout-title">Duke Data Service</span>
                        <!-- Add spacer, to align navigation to the right -->
                        <div className="mdl-layout-spacer"></div>
<<<<<<< HEAD
                        <!-- This should be a separate component -->
                        <form action="#">
                            <input className="searchBar" type="search" placeholder="Search"/>
                        </form>
                        <div className="mdl-layout-spacer"></div>
                        <div className="mdl-layout-spacer"></div>
                        <!--Should be broken into a current user component here-->
                        <i className="material-icons" style={styles.icon}>account_box</i>
=======
                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable textfield-demo">
                            <label className="mdl-button mdl-js-button mdl-button--icon" for="sample6">
                                <i className="material-icons">search</i>
                            </label>
                            <div className="mdl-textfield__expandable-holder">
                                <input className="mdl-textfield__input" type="text" id="sample6" />
                                <label className="mdl-textfield__label" for="sample-expandable">Search</label>
                            </div>
                        </div>
                        <i className="material-icons">account_box</i>
                        <!--Need to add current user component here-->
>>>>>>> upstream/develop
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
        fontSize: 36
    },
}
Header.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Header;