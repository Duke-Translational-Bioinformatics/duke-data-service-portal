import React from 'react';
import MainActions from '../../actions/mainActions';
import MainStore from '../../stores/mainStore';
import cookie from 'react-cookie';

class CurrentUser extends React.Component {

    constructor(props, context) {
        super(props);
    }

    render() {
        if (!this.props.appConfig.apiToken) {
            return null
        }
        else if (this.props.appConfig.apiToken) {
            let currentUser = this.props.currentUser ? this.props.currentUser.full_name : null;
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