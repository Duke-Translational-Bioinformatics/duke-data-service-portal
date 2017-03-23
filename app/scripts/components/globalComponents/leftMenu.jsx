import React from 'react';
import { observer } from 'mobx-react';
import authStore from '../../stores/authStore';
import {UrlGen} from '../../util/urlEnum';

@observer
class LeftMenu extends React.Component {

    render() {
        let home = <span>
                    <p>
                        <a href={UrlGen.routes.home()}
                           className="mdl-color-text--grey-800 item-content external" onTouchTap={() => this.closeLeftNav()}>
                            <i className="material-icons" style={styles.navIcon}>home</i>Home
                        </a>
                    </p>
               </span>;
        if (this.props.location.pathname === '/home' || this.props.location.pathname === '/') {
            home = <span></span>
        }
        return (
            <span>
                    <div className="panel-overlay"></div>
                    <div className="panel panel-left panel-cover">
                        <div className="content-block">
                            { home }
                            <p>
                                <a href={UrlGen.routes.metadata()}
                                   className="mdl-color-text--grey-800 item-content external" onTouchTap={() => this.closeLeftNav()}>
                                    <i className="material-icons" style={styles.navIcon}>local_offer</i>
                                    Advanced Metadata</a>
                            </p>
                            <p>
                                <a href={UrlGen.routes.agents()}
                                   className="mdl-color-text--grey-800 item-content external" onTouchTap={() => this.closeLeftNav()}>
                                    <i className="material-icons" style={styles.navIcon}>build</i>Software Agents
                                </a>
                            </p>
                            <p>
                                <a className="mdl-color-text--grey-800 item-content external" href="https://medium.com/@dukedataservice"
                                   target="_blank" rel="noopener noreferrer"><i className="material-icons" style={styles.navIcon}>rate_review</i>
                                    Duke DS Blog</a>
                            </p>
                            <p>
                                <a href={UrlGen.routes.privacy()}
                                   className="mdl-color-text--grey-800 item-content external" onTouchTap={() => this.closeLeftNav()}>
                                    <i className="material-icons" style={styles.navIcon}>lock</i>Privacy Policy
                                </a>
                            </p>
                            <p>
                                <a href="#"
                                   className="mdl-color-text--grey-800 item-content external" onTouchTap={() => this.handleTouchTap()}>
                                    <i className="material-icons" style={styles.navIcon}>exit_to_app</i>Log Out
                                </a>
                            </p>
                        </div>
                    </div>
                </span>
        );
    }

    handleTouchTap() {
        authStore.handleLogout()
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