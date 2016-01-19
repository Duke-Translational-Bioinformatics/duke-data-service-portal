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
        return (
            <div className="navbar">
                <div className="navbar-inner" style={styles.logoDiv}>
                    <div className="left">
                        {!this.props.appConfig.apiToken ? '' : <p><a href="#" className="open-panel"><i className="material-icons" style={styles.openIcon}>menu</i></a></p>}
                    </div>
                    <div className="center">
                        {!this.props.appConfig.apiToken ? '' : <img src="../images/dukeDSLogo.png" style={styles.logo}/>}
                    </div>
                    <div className="right">
                        <CurrentUser {...this.props}/>
                    </div>
                </div>
            </div>
        );
    }
}

var styles = {
    logo: {
        width: '13%',
        maxWidth: '13%',
        minWidth: 58,
        height: 'auto',
        marginTop: 39,
        marginLeft: 22
    },
    logoDiv: {
        height: 86
    },
    openIcon: {
        fontSize: 24,
        color: '#fff',
        verticalAlign: -30,
        paddingLeft: 10
    }
};

Header.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Header;
