import React from 'react';
import { RouteHandler, Link } from 'react-router';
import MainStore from '../../stores/mainStore';
import MainActions from '../../actions/mainActions';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import Close from 'material-ui/lib/svg-icons/navigation/close';
import IconButton from 'material-ui/lib/icon-button';
import TextField from 'material-ui/lib/text-field';


class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clear: false,
            inputStyle: {cursor: 'pointer'},
            timeout: null
        };
    }

    componentDidMount() {
        if (window.performance) { // If page refreshed, clear searchText
            if (performance.navigation.type == 1) {
                ProjectActions.setSearchText('');
            }
        }
        if (!!document.getElementById("searchForm")) { // Check if 'searchForm is in DOM before adding event listener'
            document.getElementById('searchForm').addEventListener('submit', (e) => {
                e.preventDefault();
            }, false);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.routerPath !== this.props.routerPath) {
            // For some reason, setting state here without timeOut causes an error???
            setTimeout(()=> {
                this.setState({clear: false});
            }, 100);
            if (!!document.getElementById("searchForm")) { // Check if 'searchForm is in DOM
                document.getElementById('searchInput').value = '';
            }
            ProjectActions.setSearchText('');
        }
    }

    render() {
        let projectName = ProjectStore.project && ProjectStore.project.name && window.innerWidth > 580 ? 'in '+ProjectStore.project.name+'...' : '...';
        let route = this.props.routerPath.split('/').splice([1], 1).toString();
        let cancelSearch = this.state.clear ?
            <IconButton onTouchTap={() => this.clearSearch(route)} className="searchbar-cancel">
                <Close color={'#fff'}/>
            </IconButton> : '';
        let search = '';
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
                           className="searchbar" style={{padding: 30, backgroundColor: '#235F9C'}}>
                <div className="searchbar-input mdl-cell mdl-cell--12-col" style={styles.searchBar.inputWrapper}>
                    <input id='searchInput' className="search" style={this.state.inputStyle}
                           type="text" name="search" placeholder={"Search "+ projectName}
                           onChange={() => this.onSearchChange()}
                           onFocus={() => this.onSearchFocus()}
                           onBlur={() => this.onSearchBlur(route)}
                        />
                    { cancelSearch }
                </div>
            </form>
        }
        return ( search )
    }

    clearSearch(route) {
        let path = route + 's/';
        let id = this.props.routerPath.split('/').pop();
        // For some reason, setting state here without timeOut causes an error???
        setTimeout(()=> {
            document.getElementById('searchInput').value = '';
            this.setState({clear: false, inputStyle: {cursor: 'pointer'}});
        }, 100);
        ProjectActions.getChildren(id, path);
        ProjectActions.setSearchText('');
    }

    onSearchBlur(route) {
        let path = route + 's/';
        let id = this.props.routerPath.split('/').pop();
        if (document.getElementById('searchInput').value === '') {
            this.setState({clear: false});
            ProjectActions.getChildren(id, path);
        } else {
            this.setState({inputStyle: {cursor: 'pointer', color: '#616161'}});
        }
    }

    onSearchChange() {
        let textInput = document.getElementById('searchInput');
        let timeout = this.state.timeout;
        textInput.onkeyup = () => {
            clearTimeout(timeout);
            this.state.timeout = setTimeout(() => {
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

    onSearchFocus() {
        this.setState({clear: true});
    }
}

var styles = {
    searchBar: {
        width: '50vw',
        margin: '0 auto',
        fontSize: '.9em',
        display: 'block',
        hintStyle: {
            color: '#eeeeee',
            marginLeft: 25
        },
        inputWrapper: {
            marginBottom: 3,
            padding: -15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        underlineStyle: {
            borderColor: '#fff'
        }
    },
    themeColor: {
        backgroundColor: '#235F9C'
    }
};

Search.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default Search;