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
                    </div>
                </header>
                <div className="mdl-layout__drawer">
                    <span className="mdl-layout-title">Duke Data Service</span>
                    <nav className="mdl-navigation">
                        <Link to="home" className="mdl-navigation__link">Home</Link>
                        <Link to="info" className="mdl-navigation__link">Info</Link>
                    </nav>
                </div>
            </div>
        );
    }

}


Header.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Header;