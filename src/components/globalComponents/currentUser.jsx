import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import authStore from '../../stores/authStore';
import BaseUtils from '../../util/baseUtils';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
const { object, bool } = PropTypes;

@observer
class CurrentUser extends React.Component {

    render() {
        const { appConfig, currentUser } = authStore;
        const { showUserInfoPanel, projectRole } = mainStore;
        if (!appConfig.apiToken) {
            return null
        }
        else if (appConfig.apiToken) {
            return (
               <span>
                   <a className="external" onTouchTap={() => this.showUserInfoPanel()} style={styles.userOptions} ref={(el)=> this.iconElement = el}>
                       <FontIcon className="material-icons" style={styles.icon}>account_box</FontIcon>
                   </a>
               <Popover
                    open={showUserInfoPanel}
                    anchorEl={this.iconElement}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    onRequestClose={() => this.showUserInfoPanel()}
                    animation={PopoverAnimationVertical}>
                    <div style={styles.popoverList}>
                        <p style={styles.userDisplay}>{currentUser.full_name}</p>
                        <Divider />
                        <p style={styles.userDisplay}>User Name: {' ' + currentUser.username}</p>
                        <Divider />
                        <p style={styles.userDisplay}>Email: {' ' + currentUser.email}</p>
                        <Divider />
                        {projectRole !== null ? <span><p style={styles.userDisplay}>{'Project Role: ' + BaseUtils.toTitleCase(projectRole)}</p>
                            <Divider /></span> : null}
                        <a className="mdl-color-text--grey-700 external" style={styles.userLogout} onTouchTap={() => this.handleLogout()}>Log Out</a>
                        <FontIcon className="material-icons" style={styles.userLogoutIcon} onTouchTap={() => this.handleLogout()}>exit_to_app</FontIcon>
                    </div>
               </Popover>
               </span>
            );
        }
    }

    handleLogout() {
        this.props.router.push('/login');
        authStore.handleLogout()
    }

    showUserInfoPanel(){
        mainStore.toggleUserInfoPanel();
    }
}

const styles = {
    icon: {
        color: "#fff",
        fontSize: 24,
        margin: '2px 10px'
    },
    popoverList: {
        padding: '0px 10px 0px 10px'
    },
    userDisplay: {
        marginTop: 13
    },
    userLogoutIcon: {
        color: "#616161",
        float: 'right',
        marginTop: 13,
        cursor: 'pointer'
    },
    userLogout: {
        float: 'right',
        margin: '14px 10px 16px 10px',
        cursor: 'pointer'
    },
    userOptions: {
        cursor:'pointer',
        color:'#FFF'
    }
};

CurrentUser.propTypes = {
    appConfig: object,
    currentUser: object,
    showUserInfoPanel: bool
};

export default CurrentUser;