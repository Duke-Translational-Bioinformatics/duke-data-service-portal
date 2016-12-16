import React from 'react';
import { RouteHandler } from 'react-router';
import ProjectStore from '../../stores/projectStore';
import MainStore from '../../stores/mainStore';
import MainActions from '../../actions/mainActions';
import ProjectActions from '../../actions/projectActions';
import CurrentUser from './currentUser.jsx';
import Divider from 'material-ui/lib/divider';
import Popover from 'material-ui/lib/popover/popover';
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top';
import Search from '../globalComponents/search.jsx';
import TextField from 'material-ui/lib/text-field';

import Paper from 'material-ui/lib/paper';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showSearch: ProjectStore.showSearch
        };
    }

    componentDidMount() {
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        let fullName = this.props.currentUser ? this.props.currentUser.full_name : null;
        let email = this.props.currentUser ? this.props.currentUser.email : null;
        let userName = this.props.currentUser ? this.props.currentUser.username : null;
        let popover = <Popover
                        open={this.state.open}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        onRequestClose={this.handleRequestClose.bind(this)}
                        animation={PopoverAnimationFromTop}>
            <div style={styles.popover}>
                <p style={styles.userDisplay}>{fullName}</p>
                <Divider />
                <p style={styles.userDisplay}>User Name: {' ' + userName}</p>
                <Divider />
                <p style={styles.userDisplay}>Email: {' ' + email}</p>
                <Divider />
                <a href="#" className="mdl-color-text--grey-700 external" style={styles.userLogout} onTouchTap={() => this.handleLogout()}>Log Out</a>
                <i className="material-icons mdl-color-text--grey-700" style={styles.userLogoutIcon} onTouchTap={() => this.handleLogout()}>exit_to_app</i>
            </div>
        </Popover>;
        let header = <div className="navbar " style={{height: 76, backgroundColor: '#235F9C'}}>
            <div className="navbar-inner" style={{display: this.state.showSearch ? 'none' : '', height: 106}}>
                <div className="left" style={{maxWidth: 130, marginBottom: 10,display: 'flex',flexDirection: 'row',alignItems: 'flex-start',justifyContent: 'center'}}>
                    {!this.props.appConfig.apiToken ? '' :
                        <a href="#" className="open-panel"><i className="material-icons" style={styles.openIcon}>menu</i></a>}
                    {!this.props.appConfig.apiToken ? '' :
                        <img src="images/dukeDSVertical.png" style={styles.logo}/>}
                </div>
                <div className="center" style={{width: '100%'}}>
                </div>
                <div className="right">
                    <a className="external" onTouchTap={this.handleTouchTap.bind(this)} style={styles.userOptions}>
                        <CurrentUser {...this.props} />
                    </a>
                    <i className="material-icons"
                       style={{position: 'absolute', bottom: 3, right: 50, cursor: 'pointer'}}
                       onTouchTap={()=>this.showSearch()}>
                        search</i>
                    { popover }
                </div>
            </div>
            {this.state.showSearch ? <Search {...this.props} {...this.state}/> : null}
        </div>;

        if(!this.props.appConfig.apiToken) {
            return null;
        } else {
            return header
        }
    }

    //search(e) {
    //    let searchInput = this.refs.searchInput;
    //    if(e.keyCode === 13) {
    //        let value = searchInput.getValue();
    //        ProjectActions.searchObjects(value);
    //        this.props.appRouter.transitionTo('/results')
    //    }
    //}

    showSearch() {
        setTimeout(()=>{
            let search = this.refs.searchInput ? this.refs.searchInput : null;
            if(this.props.showSearch && search !== null) search.focus();
        },500);
        ProjectActions.toggleSearch();
        if(this.props.routerPath === '/results') this.props.appRouter.goBack();
    }

    handleTouchTap(event){
        this.setState({
            open: true
        });
    }

    handleRequestClose(){
        this.setState({
            open: false
        });
    }

    handleLogout() {
        this.props.appRouter.transitionTo('/login');
        MainStore.handleLogout()
    }
}

var styles = {
    blogLink: {
        color: '#fff',
        fontSize: '.6em',
        position: 'absolute',
        top: 42,
        right: 13
    },
    logo: {
        width: '20%',
        maxWidth: '20%',
        minWidth: 58,
        minHeight: 46,
        position: 'absolute',
        left: 50,
        bottom: -11
    },
    logoDiv: {
        height: 86
    },
    logoutButton: {
        margin: '13px 0px 13px 5px',
        float: 'left'
    },
    openIcon: {
        fontSize: 24,
        color: '#fff',
        position: 'absolute',
        left: 10,
        bottom: -2
    },
    popover: {
        padding: '0px 10px 0px 10px'
    },
    //searchInput: {
    //    width: '90%',
    //    position: 'absolute',
    //    top: '20%',
    //    left: '8%'
    //},
    //textField: {color: "#fff",
    //    underline: {
    //        display: 'none'
    //    }
    //},
    themeColor: {
        backgroundColor: '#235F9C',
        height: 86
    },
    userDisplay: {
        marginTop: 13
    },
    userLogoutIcon: {
        float: 'right',
        marginTop: 13,
        cursor: 'pointer'
    },
    userLogout: {
        float: 'right',
        margin: '14px 10px 16px 10px'
        //fontSize: '1.2em',
        //fontWeight: 100
    },
    userOptions: {
        cursor:'pointer',
        color:'#FFF',
        position: 'absolute',
        right: 0,
        width: 200
    }
};

//margin-right:20px;margin-bottom:0px;
Header.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Header;