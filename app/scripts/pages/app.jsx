import React from 'react';
import { RouteHandler, Link } from 'react-router';
import Header from '../components/globalComponents/header.jsx';
import Footer from '../components/globalComponents/footer.jsx';
import LeftMenu from '../components/globalComponents/leftMenu.jsx';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import cookie from 'react-cookie';
import Snackbar from 'material-ui/lib/snackbar';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

import MyRawTheme from '../theme/customTheme.js';
import TextField from 'material-ui/lib/text-field';

import IconButton from 'material-ui/lib/icon-button';
import Close from 'material-ui/lib/svg-icons/navigation/close';

let zIndex = {
    zIndex: {
        popover: 5001,
        layer: 5000
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appConfig: MainStore.appConfig,
            clear: false,
            searchInput: 'search'
        };
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(MyRawTheme, zIndex)
        };
    }

    componentDidMount() {
        this.unsubscribe = MainStore.listen(state => this.setState(state));
        this.showToasts();
        new Framework7().addView('.view-main', {dynamicNavbar: true});
        if(window.performance) { // If page refreshed, clear searchText
            if(performance.navigation.type  == 1 )   {
                ProjectActions.setSearchText('');
            }
        }
        if (!!document.getElementById("searchForm")) { // Check if 'searchForm is in DOM before adding event listener'
            document.getElementById('searchForm').addEventListener('submit', (e) => {
                e.preventDefault();
            }, false);
            let textInput = document.getElementById('searchInput');
            let timeout = null;
            textInput.onkeyup = () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    let id = this.props.routerPath.split('/').pop();
                    let path = this.props.routerPath.split('/').splice([1], 1).toString() + 's/';
                    if (!textInput.value.indexOf(' ') <= 0) {
                        if (textInput.value === '') {
                            ProjectActions.setSearchText('');
                            ProjectActions.getChildren(id, path);
                        } else {
                            if (ProjectStore.entityObj !== null) id = ProjectStore.entityObj.ancestors[0].id;
                            ProjectActions.search(textInput.value, id);
                        }
                    }
                }, 500);
            };
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
        new Framework7().closePanel();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.routerPath !== this.props.routerPath) {
            // For some reason, setting state here without timeOut causes an error???
            setTimeout(()=> {
                this.setState({searchInput: 'search', clear: false});
            }, 100);
            if (!!document.getElementById("searchForm")) { // Check if 'searchForm is in DOM
                document.getElementById('searchInput').value = '';
            }
            ProjectActions.setSearchText('');
        }
        this.showToasts();
    }

    createLoginUrl() {
        return this.state.appConfig.authServiceUri + "/authenticate?client_id=" +
            this.state.appConfig.serviceId + "&state=" + this.state.appConfig.securityState;
    }

    render() {
        let route = this.props.routerPath.split('/').splice([1], 1).toString();
        let cancelSearch = this.state.clear ?
            <IconButton onTouchTap={() => this.clearSearch(route)} className="searchbar-cancel"
                        style={styles.cancelSearch}>
                <Close color={'#fff'}/>
            </IconButton> : '';
        let content = <RouteHandler {...this.props} {...this.state}/>;
        let search = '';
        let toasts = null;
        if (this.state.appConfig.apiToken) {
            if (this.props.routerPath !== '/login' && !this.state.currentUser) {
                MainActions.getCurrentUser();
            }
            if (localStorage.getItem('redirectTo') !== null) {
                setTimeout(() => {
                    localStorage.removeItem('redirectTo');
                }, 10000);
            }
        }
        if (this.state.toasts) {
            toasts = this.state.toasts.map(obj => {
                return <Snackbar key={obj.ref} ref={obj.ref} message={obj.msg} autoHideDuration={3000}
                                 onRequestClose={this.handleRequestClose.bind(this)}
                                 open={true} style={styles.toast}/>
            });
        }
        if (!this.state.appConfig.apiToken && !this.state.appConfig.isLoggedIn && this.props.routerPath !== '/login') {
            if (location.hash != '' && location.hash != '#/login') {
                let redUrl = location.href;
                if (typeof(Storage) !== 'undefined') {
                    localStorage.setItem('redirectTo', redUrl);
                } else {
                    this.props.appRouter.transitionTo('/login')
                }
            }
            this.props.appRouter.transitionTo('/login')
        }
        if (route === '' ||
            route === 'home' ||
            route === 'file' ||
            route === 'agent' ||
            route === 'agents' ||
            route === 'version') {
            search = <form className="searchbar" action="#" style={styles.themeColor}>
                <div className="searchbar-input" style={styles.themeColor}>
                    <a href="#" className="searchbar-clear"></a>
                </div>
                <a href="#" className="searchbar-cancel">Cancel</a>
            </form>
        } else {
            search = <form id="searchForm" data-search-list=".list-block-search"
                           data-search-in=".item-title" autoComplete="off"
                           className="searchbar" style={styles.themeColor}>
                <div className="searchbar-input" style={styles.searchBar.input}>
                    <TextField id='searchInput'
                               ref='search'
                               type={this.state.searchInput}
                               hintStyle={{color: '#fff', marginLeft: 20}}
                               inputStyle={{color: '#fff'}}
                               underlineFocusStyle={{borderColor: '#fff'}}
                               onFocus={() => this.onSearchFocus()}
                               onBlur={() => this.onSearchBlur(route)}
                               style={styles.searchBar}/>
                </div>
                { cancelSearch }
            </form>
        }
        return (
            <span>
                <div className="statusbar-overlay"></div>
                <div className="panel-overlay"></div>
                {!this.state.appConfig.apiToken ? '' : <LeftMenu {...this.props}/>}
                <div className="views">
                    <div className="view view-main">
                        <Header {...this.props} {...this.state}/>
                        <div className="pages navbar-through toolbar-through">
                            <div data-page="index" className="page">
                                {!this.state.appConfig.apiToken ? '' : search}
                                <div className="searchbar-overlay"></div>
                                <div className="page-content">
                                    {content}
                                    {toasts}
                                    <div className="content-block searchbar-not-found">
                                        <div className="content-block-inner">Nothing Found</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer {...this.props} {...this.state}/>
                </div>
            </span>
        );
    }

    clearSearch(route) {
        let path = route + 's/';
        let id = this.props.routerPath.split('/').pop();
        // For some reason, setting state here without timeOut causes an error???
        setTimeout(()=> {
            document.getElementById('searchInput').value = '';
            this.setState({searchInput: 'search', clear: false});
        }, 100);
        ProjectActions.getChildren(id, path);
        ProjectActions.setSearchText('');
    }

    handleRequestClose() {
        // Avoids error when toasts time out
    }

    onSearchBlur(route) {
        let path = route + 's/';
        let id = this.props.routerPath.split('/').pop();
        if (document.getElementById('searchInput').value === '') {
            this.setState({searchInput: 'search', clear: false});
            ProjectActions.getChildren(id, path);
        }
    }

    onSearchFocus() {
        this.setState({searchInput: 'text', clear: true});
    }

    showToasts() {
        if (this.state.toasts) {
            this.state.toasts.map(obj => {
                setTimeout(() => MainActions.removeToast(obj.ref), 2500);
            });
        }
    }
}

var styles = {
    cancelSearch: {
        top: 10,
        right: '23%',
        padding: 10
    },
    loginWrapper: {
        width: '90vw',
        height: 'auto',
        textAlign: 'center',
        margin: '0 auto',
        marginTop: 50,
        padding: 10
    },
    searchBar: {
        width: '50vw',
        margin: '0 auto',
        fontSize: '.9em',
        display: 'block',
        input: {
            marginBottom: 10
        }
    },
    themeColor: {
        backgroundColor: '#235F9C'
    },
    toast: {
        position: 'absolute',
        bottom: 20,
        left: 0
    }
};

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default App;