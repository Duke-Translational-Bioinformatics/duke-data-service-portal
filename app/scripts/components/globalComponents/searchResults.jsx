import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../../util/baseUtils.js';
import Loaders from '../globalComponents/loaders.jsx';
import SearchFilters from '../globalComponents/searchFilters.jsx';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {UrlGen} from '../../../util/urlEnum';

@observer
class SearchResults extends React.Component {

    constructor(props) {
        super(props);
        this.state = { // Temporary pagination until the services get properly updated to return paginated results
            page: 0
        }
    }

    render() {
        const { projPermissions, searchResults, searchValue, searchResultsFolders, searchResultsFiles, searchResultsProjects, showFilters, uploads, loading } = mainStore;
        let results = searchResults.length ? searchResults : [];
        let srchValue = searchValue !== null ? 'for ' +'"'+searchValue+'"' : '';
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
        if (results.length > 20) {
            switch (this.state.page) {
                case 0:
                    results = searchResults.slice(0, 20);
                    break;
                case 1:
                    results = searchResults.slice(0, 40);
                    break;
                case 2:
                    results = searchResults.slice(0, 60);
                    break;
                case 3:
                    results = searchResults;
                    break;
            }
        } else {
            results = searchResults;
        }
        let srchResults = results.map((results) => {
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
        let pageResults = searchResults.length > searchResults.length ? searchResults.length+' out of '+searchResults.length : searchResults.length;
        return (
            <div className="search-results-container" style={{marginLeft: showFilters ? '23%' : ''}}>
                 <SearchFilters {...this.props} />
                 <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    <div style={styles.searchTextWrapper}>
                        {<div style={styles.searchText}>Showing{" "+pageResults+" "}results{' '+srchValue}</div>}
                        {searchResultsFolders.length && searchResultsFiles.length || searchResultsProjects.length ? <IconButton
                            iconClassName="material-icons"
                            tooltip="filter results"
                            style={{float: 'right'}}
                            onTouchTap={()=>this.toggleFilters()}
                            >
                            tune
                        </IconButton> : null}
                    </div>
                </div>
                { uploads || loading ? <Loaders {...this.props}/> : null }
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block list-block-search searchbar-found media-list">
                        <ul>
                            {srchResults}
                        </ul>
                    </div>
                    {searchResults.length > 25 && searchResults.length > results.length && this.state.page < 3 ?
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
        mainStore.toggleSearchFilters();
    }

    toggleSearch() {
        if(mainStore.showSearch) mainStore.toggleSearch();
    }
}

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

SearchResults.contextTypes = {
    muiTheme: object
};

SearchResults.propTypes = {
    uploads: object,
    loading: bool,
    results: array,
    searchResults: array,
    searchResultsFolders: array,
    searchResultsFiles: array,
    searchResultsProjects: array,
    searchValue: string,
    projPermissions: string,
    showFilters: bool
};

export default SearchResults;