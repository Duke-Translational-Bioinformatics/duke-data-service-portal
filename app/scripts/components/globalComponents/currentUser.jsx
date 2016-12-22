import React from 'react';
import MainActions from '../../actions/mainActions';
import ProjectActions from '../../actions/projectActions';
import Divider from 'material-ui/lib/divider';
import FontIcon from 'material-ui/lib/font-icon';
import Popover from 'material-ui/lib/popover/popover';
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top';

class CurrentUser extends React.Component {

    render() {
        if (!this.props.appConfig.apiToken) {
            return null
        }
        else if (this.props.appConfig.apiToken) {
            let fullName = this.props.currentUser ? this.props.currentUser.full_name : null;
            let email = this.props.currentUser ? this.props.currentUser.email : null;
            let userName = this.props.currentUser ? this.props.currentUser.username : null;
            return (
               <Popover
                    open={this.props.showUserInfoPanel}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={() => this.showUserInfoPanel()}
                    animation={PopoverAnimationFromTop}>
                    <div style={styles.popover}>
                        <p style={styles.userDisplay}>{fullName}</p>
                        <Divider />
                        <p style={styles.userDisplay}>User Name: {' ' + userName}</p>
                        <Divider />
                        <p style={styles.userDisplay}>Email: {' ' + email}</p>
                        <Divider />
                        <a href="#" className="mdl-color-text--grey-700 external" style={styles.userLogout} onTouchTap={() => this.handleLogout()}>Log Out</a>
                        <FontIcon className="material-icons" style={styles.userLogoutIcon} onTouchTap={() => this.handleLogout()}>exit_to_app</FontIcon>
                    </div>
                </Popover>
            );
        }
    }

    handleLogout() {
        this.props.appRouter.transitionTo('/login');
        MainActions.handleLogout()
    }

    showUserInfoPanel(){
        ProjectActions.toggleUserInfoPanel();
    }
}

var styles = {
    popover: {
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
        margin: '14px 10px 16px 10px'
    }
};

CurrentUser.contextTypes = {
    muiTheme: React.PropTypes.object
};

CurrentUser.propTypes = {
    currentUser: React.PropTypes.object,
    showUserInfoPanel: React.PropTypes.bool
};

export default CurrentUser;