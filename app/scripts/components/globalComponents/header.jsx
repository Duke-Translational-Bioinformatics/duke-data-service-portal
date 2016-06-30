import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectStore from '../../stores/projectStore';
import MainStore from '../../stores/mainStore';
import MainActions from '../../actions/mainActions';
import CurrentUser from './currentUser.jsx';
import Divider from 'material-ui/lib/divider';
import Popover from 'material-ui/lib/popover/popover';
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top';
import RaisedButton from 'material-ui/lib/raised-button';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        let fullName = this.props.currentUser ? this.props.currentUser.full_name : null;
        let email = this.props.currentUser ? this.props.currentUser.email : null;
        let userName = this.props.currentUser ? this.props.currentUser.username : null;

        let popover = <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose.bind(this)}
            animation={PopoverAnimationFromTop}
            >
            <div style={styles.popover}>
                <p style={styles.userDisplay}>User Name: {' ' + userName}</p>
                <Divider />
                <p style={styles.userDisplay}>Email: {' ' + email}</p>
                <Divider />
                <i className="material-icons mdl-color-text--grey-700" style={styles.userLogoutIcon}>exit_to_app</i>
                <a href="#" className="mdl-color-text--grey-700 external" style={styles.userLogout} onTouchTap={() => this.handleLogout()}>Log Out</a>
            </div>
        </Popover>;

        if(!this.props.appConfig.apiToken) {
            return null;
        } else {
            return (
                <div className="navbar" style={styles.themeColor}>
                    <div className="navbar-inner" style={styles.logoDiv}>
                        <div className="left">
                            {!this.props.appConfig.apiToken ? '' :
                                <p><a href="#" className="open-panel"><i className="material-icons" style={styles.openIcon}>menu</i></a></p>}
                        </div>
                        <div className="center">
                            {!this.props.appConfig.apiToken ? '' :
                                <img src="images/dukeDSVertical.png" style={styles.logo}/>}
                        </div>
                        <div className="right">
                            <a className="external" onTouchTap={this.handleTouchTap.bind(this)} style={{cursor: 'pointer', color: '#FFFFFF'}}>
                                <CurrentUser {...this.props} />
                            </a>
                            { popover }
                        </div>
                    </div>
                </div>
            );
        }
    }

    handleTouchTap(event){
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    }

    handleRequestClose(){
        this.setState({
            open: false
        });
    }

    handleLogout() {
        MainStore.handleLogout()
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
    logoutButton: {
        margin: '13px 0px 13px 5px',
        float: 'right'
    },
    openIcon: {
        fontSize: 24,
        color: '#fff',
        verticalAlign: -34,
        paddingLeft: 10
    },
    popover: {
        padding: 10
    },
    themeColor: {
        backgroundColor: '#235F9C'
    },
    userDisplay: {
        marginTop: 13
    },
    userLogoutIcon: {
        float: 'right',
        marginTop: 13
    },
    userLogout: {
        float: 'right',
        margin: '14px 10px 16px 10px',
        fontSize: '1.2em',
        fontWeight: 100
    }
};

Header.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Header;