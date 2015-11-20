import React from 'react';
import MainActions from '../../actions/mainActions';
import MainStore from '../../stores/mainStore';
import cookie from 'react-cookie';


class CurrentUser extends React.Component {

    constructor(props, context) {
        super(props);
        this.state = {
            appConfig: MainStore.appConfig,
            currentUser: MainStore.currentUser
        }
    }

    render() {
        if (!this.state.appConfig.apiToken) {
            return null
        }
        else if (this.state.appConfig.apiToken) {
            let user = cookie.load('currentUser');
            let currentUser = user;
            return (
                <span>
                    <span style={styles.currentUser}>{currentUser}</span>
                    <i className="material-icons" style={styles.icon}>account_box</i>
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
        verticalAlign: -18,
        paddingRight: 10
    }
};

export default CurrentUser;