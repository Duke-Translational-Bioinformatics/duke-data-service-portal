import React from 'react';
import { RouteHandler } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import Close from 'material-ui/lib/svg-icons/navigation/close';
import IconButton from 'material-ui/lib/icon-button';
import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';

class Search extends React.Component {

    componentDidMount() {
        if (this.refs.searchInput) { // Check if searchInput is in DOM and focus
            let search = this.refs.searchInput ? this.refs.searchInput : null;
            if(this.props.showSearch && search !== null) search.focus();
        }
    }

    render() {
        return (this.props.showSearch ? <Paper style={styles.searchBar} zDepth={2}>
            <i className="material-icons"
               style={styles.searchBar.searchIcon}
               onTouchTap={()=>this.showSearch()}>search</i>
            <TextField
                ref="searchInput"
                hintText="Search"
                defaultValue={this.props.searchValue ? this.props.searchValue : null}
                hintStyle={styles.searchBar.hintText}
                onKeyDown={(e)=>this.search(e)}
                style={{width: '90%',position: 'absolute',top: '20%', left: this.props.screenSize.width < 680 ? '11%' : '8%'}}
                underlineStyle={styles.searchBar.textFieldUnderline}
                underlineFocusStyle={styles.searchBar.textFieldUnderline} />
            <i className="material-icons"
               style={styles.searchBar.closeSearchIcon}
               onTouchTap={()=>this.showSearch()}>
                close</i>
        </Paper> : null)
    }

    search(e) {
        let includeKinds = this.props.includeKinds;
        let includeProjects = this.props.includeProjects;
        let searchInput = this.refs.searchInput;
        if(e.keyCode === 13) {
            let value = searchInput.getValue();
            ProjectActions.searchObjects(value, includeKinds, includeProjects);
            this.props.appRouter.transitionTo('/results')
        }
    }

    showSearch() {
        if(this.props.routerPath === '/results') this.props.appRouter.goBack();
        if(this.props.showFilters) ProjectActions.toggleSearchFilters();
        if(this.props.includeKinds.length) ProjectActions.setIncludedSearchKinds([]);
        if(this.props.includeProjects.length) ProjectActions.setIncludedSearchProjects([]);
        ProjectActions.toggleSearch();
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
    searchValue: React.PropTypes.string,
    showSearch: React.PropTypes.bool
};

export default Search;