import React from 'react';
import { RouteHandler, Link } from 'react-router';
import MainStore from '../../stores/mainStore';
import MainActions from '../../actions/mainActions';
import CurrentUser from './currentUser.jsx';
import cookie from 'react-cookie';
var mui = require('material-ui'),
    TextField = mui.TextField,
    Dialog = mui.Dialog,
    Checkbox = mui.Checkbox;

class Header extends React.Component {

    constructor(props, context) {
        super(props);

    }

    render() {
        return (
            <div className="navbar">
                <div className="navbar-inner">
                    <div className="left">
                        {!this.props.appConfig.apiToken ? '' : <p><a href="#" className="open-panel"><i className="material-icons" style={styles.openIcon}>menu</i></a></p>}
                    </div>
                    <div className="center">
                    </div>
                    <div className="right">
                        <CurrentUser {...this.state} {...this.props}/>
                    </div>
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
        fontSize: 24,
        verticalAlign: -15,
        padding: 10
    },
    loginButton: {
        color: '#fff',
        margin: 20,
    },
    headerStyle: {
        height: 210,
        zIndex: '0'
    },
    titleStyle: {
        fontSize: '1.3em'
    },
    currentUser: {
        fontSize: '.5em',
        verticalAlign: -12
    },
    openIcon: {
        fontSize: 24,
        color: '#fff',
        verticalAlign: -30,
        paddingLeft: 10
    }
}

Header.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Header;
