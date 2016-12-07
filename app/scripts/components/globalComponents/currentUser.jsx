import React from 'react';

class CurrentUser extends React.Component {

    render() {
        if (!this.props.appConfig.apiToken) {
            return null
        }
        else if (this.props.appConfig.apiToken) {
            let currentUser = this.props.currentUser ? this.props.currentUser.full_name : null;
            return (
                <span>
                    <i className="material-icons" style={styles.icon}>account_box</i>
                    {/*<span style={styles.currentUser}>{currentUser !== null ? currentUser.toUpperCase() : currentUser}</span>*/}
                </span>
            );
        }
    }
}

var styles = {
    currentUser: {
        fontSize: '.6em',
        verticalAlign: -14,
        paddingRight: 10
    },
    icon: {
        fontSize: 24,
        position: 'absolute',
        bottom: 3,
        right: 10
    }
};

export default CurrentUser;