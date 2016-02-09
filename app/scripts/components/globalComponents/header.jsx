import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectStore from '../../stores/projectStore';
import MainStore from '../../stores/mainStore';
import MainActions from '../../actions/mainActions';
import CurrentUser from './currentUser.jsx';

class Header extends React.Component {

    constructor(props, context) {
        super(props);
    }

    render() {
        if(!this.props.appConfig.apiToken) {
            return null;
        } else {
            return (
                <div className="navbar" style={styles.themeColor}>
                    <div className="navbar-inner" style={styles.logoDiv}>
                        <div className="left">
                            {!this.props.appConfig.apiToken ? '' :
                                <p><a href="#" className="open-panel"><i className="material-icons"
                                                                         style={styles.openIcon}>menu</i></a></p>}
                        </div>
                        <div className="center">
                            {!this.props.appConfig.apiToken ? '' :
                                <img src="images/dukeDSVertical.png" style={styles.logo}/>}
                        </div>
                        <div className="right">
                            <CurrentUser {...this.props}/>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

var styles = {
    logo: {
        width: '40%',
        maxWidth: '40%',
        minWidth: 58,
        minHeight: 46,
        marginTop: 12,
        marginLeft: 22
    },
    logoDiv: {
        height: 86
    },
    openIcon: {
        fontSize: 24,
        color: '#fff',
        verticalAlign: -34,
        paddingLeft: 10
    },
    themeColor: {
        backgroundColor: '#235F9C'
    }
};

Header.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Header;