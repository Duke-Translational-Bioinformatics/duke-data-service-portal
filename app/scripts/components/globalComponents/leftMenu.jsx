import React from 'react';
import { RouteHandler } from 'react-router';
import MainStore from '../../stores/mainStore';
import MainActions from '../../actions/mainActions';
import urlGen from '../../../util/urlGen.js';

class LeftMenu extends React.Component {

    render() {
        let home = <span>
                    <p>
                        <a href={urlGen.routes.home()}
                           className="mdl-color-text--grey-800 item-content external" onTouchTap={() => this.closeLeftNav()}>
                            <i className="material-icons" style={styles.navIcon}>home</i>Home
                        </a>
                    </p>
               </span>;
        if (this.props.routerPath === '/home' || this.props.routerPath === '/') {
            home = <span></span>
        }
        return (
            <span>
                    <div className="panel-overlay"></div>
                    <div className="panel panel-left panel-cover">
                        <div className="content-block">
                            { home }
                            <p>
                                <a href={urlGen.routes.agents()}
                                  className="mdl-color-text--grey-800 item-content external" onTouchTap={() => this.closeLeftNav()}>
                                    <i className="material-icons" style={styles.navIcon}>build</i>Software Agents
                                </a>
                            </p>
                            <p>
                                <a href={urlGen.routes.privacy()}
                                  className="mdl-color-text--grey-800 item-content external" onTouchTap={() => this.closeLeftNav()}>
                                    <i className="material-icons" style={styles.navIcon}>lock</i>Privacy Policy
                                </a>
                            </p>
                            <p>
                                <a href="#" className="mdl-color-text--grey-800 item-content external" onTouchTap={() => this.handleTouchTap()}>
                                    <i className="material-icons" style={styles.navIcon}>exit_to_app</i>Log Out
                                </a>
                            </p>
                        </div>
                    </div>
                </span>
        );
    }

    handleTouchTap() {
        this.props.appRouter.transitionTo('/login');
        MainStore.handleLogout()
    }

    closeLeftNav() {
        new Framework7().closePanel();
    }
}

var styles = {
    navIcon: {
        paddingRight: 5,
        verticalAlign: -6
    }
};

export default LeftMenu;