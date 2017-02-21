import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BaseUtils from '../../../util/baseUtils.js';
import Loaders from '../globalComponents/loaders.jsx';
import SearchFilters from '../globalComponents/searchFilters.jsx';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {UrlGen} from '../../../util/urlEnum';

class SearchResults extends React.Component {

    constructor() {
        this.state = { // Temporary pagination until the services get properly updated to return paginated results
            page: 0
        }
    }

    render() {
        let results = this.props.searchResults.length ? this.props.searchResults : [];
        let searchValue = this.props.searchValue !== null ? 'for ' +'"'+this.props.searchValue+'"' : '';
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        if (results.length > 20) {
            switch (this.state.page) {
                case 0:
                    results = this.props.searchResults.slice(0, 20);
                    break;
                case 1:
                    results = this.props.searchResults.slice(0, 40);
                    break;
                case 2:
                    results = this.props.searchResults.slice(0, 60);
                    break;
                case 3:
                    results = this.props.searchResults;
                    break;
            }
        } else {
            results = this.props.searchResults;
        }
        let searchResults = results.map((results) => {
            if (results.kind === 'dds-folder') {
                return (
                    <li key={ results.id } className="hover">
                        <a href={UrlGen.routes.folder(results.id)}
                           className="item-content external" onTouchTap={() => this.toggleSearch()}>
                            <div className="item-media">
                                <FontIcon className="material-icons" style={styles.icon}>folder</FontIcon>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800"
                                         style={styles.title}>{results.name.length > 82 ? results.name.substring(0, 82) + '...' : results.name}</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">Created
                                    by { results.audit.created_by.full_name }</div>
                                <div className="item-subtitle mdl-color-text--grey-600">{results.audit.last_updated_on !== null ? 'Last updated on ' +BaseUtils.formatDate(results.audit.last_updated_on)+ ' by ' :
                                    <br />}
                                    { results.audit.last_updated_by !== null ? results.audit.last_updated_by.full_name : null}</div>
                            </div>
                        </a>
                    </li>
                );
            } else {
                return (
                    <li key={ results.id } className="hover">
                        <a href={UrlGen.routes.file(results.id)}
                           className="item-content external">
                            <div className="item-media"><FontIcon className="material-icons" style={styles.icon}>description</FontIcon>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800"
                                         style={styles.title}>{results.name.length > 82 ? results.name.substring(0, 82) + '...' : results.name}</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">{BaseUtils.bytesToSize(results.current_version.upload.size) + ' - '}version {results.current_version.version}</div>
                                <div className="item-subtitle mdl-color-text--grey-600">{results.audit.last_updated_on !== null ? 'Last updated on ' +BaseUtils.formatDate(results.audit.last_updated_on)+ ' by ' :
                                    <br />}
                                    { results.audit.last_updated_by !== null ? results.audit.last_updated_by.full_name : null}</div>
                            </div>
                        </a>
                    </li>
                );
            }
        });
        let pageResults = this.props.searchResults.length > searchResults.length ? searchResults.length+' out of '+this.props.searchResults.length : searchResults.length;
        return (
            <div className="search-results-container" style={{marginLeft: this.props.showFilters ? '23%' : ''}}>
                 <SearchFilters {...this.props} />
                 <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    <div style={styles.searchTextWrapper}>
                        {<div style={styles.searchText}>Showing{" "+pageResults+" "}results{' '+searchValue}</div>}
                        {this.props.searchResultsFolders.length && this.props.searchResultsFiles.length || this.props.searchResultsProjects.length ? <IconButton
                            iconClassName="material-icons"
                            tooltip="filter results"
                            style={{float: 'right'}}
                            onTouchTap={()=>this.toggleFilters()}
                            >
                            tune
                        </IconButton> : null}
                    </div>
                </div>
                { this.props.uploads || this.props.loading ? <Loaders {...this.props}/> : null }
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block list-block-search searchbar-found media-list">
                        <ul>
                            {searchResults}
                        </ul>
                    </div>
                    {this.props.searchResults.length > 25 && this.props.searchResults.length > results.length && this.state.page < 3 ?
                        <div className="mdl-cell mdl-cell--12-col">
                            <RaisedButton
                                label="Load More"
                                secondary={true}
                                onTouchTap={this.loadMore.bind(this)}
                                fullWidth={true}
                                labelStyle={{fontWeight: '100'}}/>
                        </div> : null}
                </div>
            </div>
        );
    }

    loadMore() {
        this.setState({page: this.state.page + 1});
    }

    toggleFilters() {
        ProjectActions.toggleSearchFilters();
    }

    toggleSearch() {
        if(this.props.showSearch) ProjectActions.toggleSearch();
    }
}

SearchResults.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    searchTextWrapper: {
    },
    icon: {
        fontSize: 36,
        marginTop: 20,
        color: '#616161'
    },
    list: {
        float: 'right'
    },
    searchText: {
        marginLeft: 17,
        marginTop: 13,
        float: 'left'
    },
    title: {
        marginRight: 40
    }
};

SearchResults.propTypes = {
    error: React.PropTypes.object,
    loading: React.PropTypes.bool,
    results: React.PropTypes.array,
    searchResults: React.PropTypes.array,
    searchResultsFolders: React.PropTypes.array,
    searchResultsFiles: React.PropTypes.array,
    searchResultsProjects: React.PropTypes.array,
    searchValue: React.PropTypes.string,
    showFilters: React.PropTypes.bool
};

export default SearchResults;