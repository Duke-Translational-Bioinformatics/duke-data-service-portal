import React from 'react';
import { RouteHandler } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BaseUtils from '../../../util/baseUtils.js';
import Loaders from '../globalComponents/loaders.jsx';
import SearchFilters from '../globalComponents/searchFilters.jsx';
import IconButton from 'material-ui/lib/icon-button';
import Paper from 'material-ui/lib/paper';
import {UrlGen} from '../../../util/urlEnum';

import LeftNav from 'material-ui/lib/left-nav';

class SearchResults extends React.Component {

    constructor() {
        this.state = {
            page: 0
        }
    }

    render() {
        let results = this.props.searchResults.length ? this.props.searchResults : [];
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        if (this.props.error && this.props.error.response) {
            this.props.error.response === 404 ? this.props.appRouter.transitionTo('/notFound') : null;
            this.props.error.response === 401 ? this.props.appRouter.transitionTo('/login') : null;
            this.props.error.response != 404 ? console.log(this.props.error.msg) : null;
        }
        if (results.length > 20) {
            switch (this.state.page) {
                case 0:
                    results = this.props.results.slice(0, 20);
                    break;
                case 1:
                    results = this.props.results.slice(0, 40);
                    break;
                case 2:
                    results = this.props.results.slice(0, 60);
                    break;
                case 3:
                    results = this.props.results;
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
                           className="item-content external">
                            <div className="item-media">
                                <i className="material-icons" style={styles.icon}>folder</i>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800"
                                         style={styles.title}>{results.name.length > 82 ? results.name.substring(0, 82) + '...' : results.name}</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">Created
                                    by { results.audit.created_by.full_name }</div>
                                <div className="item-subtitle mdl-color-text--grey-600">{results.audit.last_updated_on !== null ? 'Last updated on ' + new Date(results.audit.last_updated_on).toDateString() + ' by ' :
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
                            <div className="item-media"><i className="material-icons" style={styles.icon}>description</i>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800"
                                         style={styles.title}>{results.name.length > 82 ? results.name.substring(0, 82) + '...' : results.name}</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">{BaseUtils.bytesToSize(results.current_version.upload.size) + ' - '}version {results.current_version.version}</div>
                                <div className="item-subtitle mdl-color-text--grey-600">{results.audit.last_updated_on !== null ? 'Last updated on ' + new Date(results.audit.last_updated_on).toDateString() + ' by ' :
                                    <br />}
                                    { results.audit.last_updated_by !== null ? results.audit.last_updated_by.full_name : null}</div>
                            </div>
                        </a>
                    </li>
                );
            }
        });

        return (
            <div className="search-results-container" style={{marginLeft: this.props.showFilters ? '23%' : ''}}>
                 <SearchFilters {...this.props} />
                 <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    <div style={styles.searchTextWrapper}>
                        {<div style={styles.searchText}>Showing{" "+searchResults.length+" "}results</div>}
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
                { this.props.uploads || this.props.loading || this.props.childrenLoading ? <Loaders {...this.props}/> : null }
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block list-block-search searchbar-found media-list">
                        <ul>
                            {searchResults}
                        </ul>
                    </div>
                    {results.length > 25 && results.length > results.length && this.state.page < 3 ?
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
}

SearchResults.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    searchTextWrapper: {
    },
    icon: {
        fontSize: 36,
        marginTop: 20
    },
    list: {
        float: 'right',
    },
    searchText: {
        marginLeft: 17,
        marginTop: 13,
        //marginBottom: -20
        float: 'left'
    },
    title: {
        marginRight: 40
    }
};

SearchResults.propTypes = {
    loading: React.PropTypes.bool,
    results: React.PropTypes.array,
    error: React.PropTypes.object
};

export default SearchResults;