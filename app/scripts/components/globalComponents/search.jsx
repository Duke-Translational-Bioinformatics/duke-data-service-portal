import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import Close from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

@observer
class Search extends React.Component {

    componentDidMount() {
        if (this.refs.searchInput) { // Check if searchInput is in DOM and focus
            let search = this.refs.searchInput ? this.refs.searchInput : null;
            if(mainStore.showSearch && search !== null) search.focus();
        }
    }

    render() {
        const { screenSize, showSearch, searchValue } = mainStore;
        return (showSearch ? <Paper style={styles.searchBar} zDepth={2}>
            <i className="material-icons"
               style={styles.searchBar.searchIcon}
               onTouchTap={()=>this.showSearch()}>arrow_back</i>
            <TextField
                ref="searchInput"
                hintText="Search"
                defaultValue={searchValue ? searchValue : null}
                hintStyle={styles.searchBar.hintText}
                onKeyDown={(e)=>this.search(e)}
                style={{width: '90%',position: 'absolute',top: '20%', left: screenSize.width < 680 ? '11%' : '8%'}}
                underlineStyle={styles.searchBar.textFieldUnderline}
                underlineFocusStyle={styles.searchBar.textFieldUnderline} />
            <i className="material-icons"
               style={styles.searchBar.closeSearchIcon}
               onTouchTap={()=>this.showSearch()}>
                close</i>
        </Paper> : null)
    }

    search(e) {
        let includeKinds = mainStore.includeKinds;
        let includeProjects = mainStore.includeProjects;
        let searchInput = this.refs.searchInput;
        if(e.keyCode === 13) {
            let value = searchInput.getValue();
            mainStore.searchObjects(value, includeKinds, includeProjects);
            this.props.router.push('/results')
        }
    }

    showSearch() {
        if(this.props.location.pathname === '/results') this.props.router.goBack();
        if(mainStore.showFilters) mainStore.toggleSearchFilters();
        if(mainStore.includeKinds.length) mainStore.setIncludedSearchKinds([]);
        if(mainStore.includeProjects.length) mainStore.setIncludedSearchProjects([]);
        mainStore.toggleSearch();
    }
}

const styles = {
    searchBar: {
        height: 76,
        closeSearchIcon: {
            position: 'absolute',
            right: '3.66%',
            bottom: '34%',
            cursor: 'pointer'
        },
        hintText: {
            fontWeight: 100
        },
        searchIcon: {
            position: 'absolute',
            left: '4%',
            bottom: '36%',
            cursor: 'pointer'
        },
        textFieldUnderline: {
            display: 'none'
        }
    }
};

Search.childContextTypes = {
    muiTheme: React.PropTypes.object
};

Search.propTypes = {
    searchValue: string,
    showSearch: bool,
    screenSize: object
};

export default Search;