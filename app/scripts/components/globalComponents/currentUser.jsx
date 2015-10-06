import React from 'react';
import MainActions from '../../actions/mainActions';
import MainStore from '../../stores/mainStore';
import cookie from 'react-cookie';


class CurrentUser extends React.Component {

    constructor(props, context) {
        super(props);
        this.state = {
            appConfig: MainStore.appConfig,
            currentUser: cookie.load('currentUser')
        }
    }

    render() {
        if (!this.state.appConfig.apiToken) {
            return null
        }
        else if (this.state.appConfig.apiToken) {
            let currentUser = cookie.load('currentUser').map((user) => {
                return (
                    <span style={styles.currentUser} key={user.id}>{user.username}</span>
                );
            });
            return (
                <span>
                <i className="material-icons" style={styles.icon}>account_box</i>
                    {currentUser}
            </span>
            );
        }
    }
}

var styles = {
    currentUser: {
        fontSize: '.5em',
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
