import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { debounce } from 'lodash';
import mainStore from '../../stores/mainStore';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
const { object, bool, string } = PropTypes;

@observer
class Search extends React.Component {

    componentDidMount() {
        if (this.refs.searchInput) { // Check if searchInput is in DOM and focus
            let search = this.refs.searchInput ? this.refs.searchInput : null;
            if(mainStore.showSearch && search !== null) {
                search.focus();
                search.select();
            }
        }
        this.search = debounce(this.search , 300);
    }

    render() {
        const { screenSize, searchValue, searchResults, showSearch } = mainStore;
        const { router } = this.props;
        return (showSearch ? <Paper className="navbar" style={styles.searchBar} zDepth={2}>
            <i className="material-icons"
               style={styles.searchBar.searchIcon}
               onTouchTap={()=>this.showSearch()}>close</i>
            <TextField
                ref="searchInput"
                hintText="Search"
                defaultValue={searchValue && searchResults.length && router.location.pathname.includes('search') ? searchValue : null}
                hintStyle={styles.searchBar.hintText}
                onKeyUp={() => this.search()}
                style={{width: '90%',position: 'absolute',top: 6, left: screenSize.width < 680 ? '11%' : '8%'}}
                underlineStyle={styles.searchBar.textFieldUnderline}
                underlineFocusStyle={styles.searchBar.textFieldUnderline} />
            <i className="material-icons"
               style={styles.searchBar.closeSearchIcon}
               onTouchTap={() => this.search()}>search</i>
        </Paper> : null)
    }

    search() {
        let query = this.refs.searchInput.getValue();
        if(query.length){
            mainStore.searchObjects(query, null, null, null, null);
        } else {
            mainStore.resetSearchResults();
        }
        if(!this.props.location.pathname.includes('search')) this.props.router.push('/search');
    }

    showSearch() {
        if(mainStore.prevLocation === (undefined || null) || this.props.location.pathname === '/search') {
            if(mainStore.showSearch) mainStore.toggleSearch();
            this.props.router.goBack();
        } else {
            if(mainStore.prevLocation.pathname !== '/search') {
                mainStore.resetSearchFilters();
                if(mainStore.showSearch) mainStore.toggleSearch();
            }
            if((mainStore.prevLocation === null || mainStore.prevLocation.pathname === '/search') && mainStore.showSearch) mainStore.toggleSearch();
        }
        if(mainStore.showFilters) mainStore.toggleSearchFilters();
    }
}

const styles = {
    searchBar: {
        height: 56,
        borderRadius: 0,
        closeSearchIcon: {
            position: 'absolute',
            right: '2.96%',
            top: 16,
            cursor: 'pointer'
        },
        hintText: {
            fontWeight: 100
        },
        searchIcon: {
            position: 'absolute',
            left: '2.96%',
            top: 16,
            cursor: 'pointer'
        },
        textFieldUnderline: {
            display: 'none'
        }
    }
};

Search.propTypes = {
    searchValue: string,
    showSearch: bool,
    screenSize: object
};

export default Search;