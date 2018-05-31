import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import { UrlGen, Kind } from '../../util/urlEnum';
import { Color } from '../../theme/customTheme';
import Loaders from '../../components/globalComponents/loaders.jsx';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
const { object, bool, array, string } = PropTypes;

@observer
class SearchResults extends React.Component {

    componentDidMount() {
        if(mainStore.leftMenuDrawer.get('open')) mainStore.toggleLeftMenuDrawer();
    }

    render() {
        const { loading, nextPage, screenSize, searchFilters, searchResults, searchProjectsPostFilters, searchTagsPostFilters, searchValue, showFilters, tableBodyRenderKey, totalItems, uploads } = mainStore;
        const renderChips = () => {
            let projectFilters = searchProjectsPostFilters['project.name'].map(filter => {
                return <Chip key={BaseUtils.generateUniqueKey()} style={styles.chip} onRequestDelete={() => mainStore.searchObjects(searchValue, null, filter, null, null)}>
                    {filter}
                </Chip>
            });
            let tagFilters = searchTagsPostFilters['tags.label'].map(filter => {
                return <Chip key={BaseUtils.generateUniqueKey()} style={styles.chip} onRequestDelete={() => mainStore.searchObjects(searchValue, null, null, filter, null)}>
                    {filter}
                </Chip>
            });
            let kindFilters = searchFilters.map(filter => {
                let kind = filter === 'dds-file' ? 'files' : 'folders';
                return <Chip key={BaseUtils.generateUniqueKey()} style={styles.chip} onRequestDelete={() => mainStore.searchObjects(searchValue, filter, null, null, null)}>
                    {kind}
                </Chip>
            });
            return [...projectFilters, ...tagFilters, ...kindFilters].map(f => f);
        };
        const filters = renderChips();
        let srchValue = searchValue !== null ? `for "${searchValue}"` : ``;
        let pageResults = totalItems && totalItems.length > searchResults.length ? `${searchResults.length} out of ${totalItems.length}` : searchResults.length;
        let results = searchResults && searchResults.length ? searchResults.map((child) => {
            let icon = child.kind === Kind.DDS_FOLDER ? 'folder' : 'description';
            const route = child.kind === Kind.DDS_FOLDER ? UrlGen.routes.folder(child.id) : UrlGen.routes.file(child.id);
            return (
                <TableRow key={child.id} selectable={false}>
                    <TableRowColumn>
                        <a href={route} className="external">
                            <div style={styles.linkColor} onClick={() => this.toggleFiltersBeforeTransition()}>
                                <FontIcon className="material-icons" style={styles.icon}>{icon}</FontIcon>
                                {child.name.length > 82 ? child.name.substring(0, 82) + '...' : child.name}
                                {child.kind === Kind.DDS_FILE && ' (version '+ child.current_version.version+')'}
                            </div>
                        </a>
                    </TableRowColumn>
                    {screenSize && screenSize.width >= 680 && <TableRowColumn onTouchTap={()=>this.check(child.id, child.kind)}>
                        <span>{child.audit.last_updated_on !== null ? BaseUtils.formatDate(child.audit.last_updated_on)+' by '+child.audit.last_updated_by.full_name : BaseUtils.formatDate(child.audit.created_on)+' by '+child.audit.created_by.full_name}</span>
                    </TableRowColumn>}
                    {screenSize && screenSize.width >= 840 && <TableRowColumn onTouchTap={()=>this.check(child.id, child.kind)} style={{width: 100}}>
                        {child.kind === Kind.DDS_FILE && child.current_version ? BaseUtils.bytesToSize(child.current_version.upload.size) : '---'}
                    </TableRowColumn>}
                </TableRow>
            );
        }) : null;
        return (
            <div className="list-items-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    {<div style={styles.searchText}>Showing{' '+pageResults+' '}{totalItems !== null && totalItems > searchResults.length ? 'of '+totalItems+' total ' : ''} results{' '+srchValue}</div>}
                    {searchResults.length || showFilters ? <IconButton
                             iconClassName="material-icons"
                             tooltip="filter results"
                             style={{float: 'right'}}
                             onTouchTap={()=>this.toggleFilters()}>
                             tune
                        </IconButton> : null}
                </div>
                <div className="mdl-cell mdl-cell--12-col" style={styles.chip.wrapper}>
                    {filters}
                    {filters.length ? <a className="external" style={{cursor: 'pointer'}} onTouchTap={() => this.clearFilters(searchValue)}>Clear all filters</a> : null}
                </div>
                {uploads || loading ? <Loaders {...this.props}/> : null}
                <Paper className="mdl-cell mdl-cell--12-col" style={styles.list}>
                    {searchResults.length > 0 && <Table fixedHeader={true}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>
                                </TableHeaderColumn>
                                {screenSize && screenSize.width >= 680 ? <TableHeaderColumn style={{fontSize: 14}}>LAST UPDATED</TableHeaderColumn> : null}
                                {screenSize && screenSize.width >= 840 ? <TableHeaderColumn style={{width: 100, fontSize: 14}}>SIZE</TableHeaderColumn> : null}
                            </TableRow>
                        </TableHeader>
                        <TableBody key={tableBodyRenderKey} showRowHover={true} displayRowCheckbox={false} deselectOnClickaway={false}>
                            {results}
                        </TableBody>
                    </Table>}
                    {searchResults.length < totalItems && totalItems > 25 &&
                        <div className="mdl-cell mdl-cell--12-col">
                            <RaisedButton
                                label={loading ? "Loading..." : "Load More"}
                                secondary={true}
                                disabled={!!loading}
                                onTouchTap={()=>this.loadMore(searchValue, nextPage)}
                                fullWidth={true}
                                style={loading ? {backgroundColor: Color.ltBlue2} : {}}
                                labelStyle={loading ? {color: Color.blue} : {fontWeight: '100'}}/>
                        </div>
                    }
                </Paper>
            </div>
        );
    }

    clearFilters(searchValue) {
        mainStore.resetSearchFilters();
        mainStore.searchObjects(searchValue, null, null, null, null);
    }

    toggleFiltersBeforeTransition() {
        const {showFilters} = mainStore;
        if(showFilters) this.toggleFilters();
        mainStore.resetSearchFilters();
        mainStore.toggleSearch();
    }

    loadMore(searchValue, page) {
        mainStore.searchObjects(searchValue, null, null, null, page);
    }

    toggleFilters() {
        mainStore.toggleSearchFilters();
    }

    toggleSearch() {
        if(mainStore.showSearch) mainStore.toggleSearch();
    }
}

const styles = {
    chip: {
        margin: 4,
        backgroundColor: Color.ltGreen2,
        wrapper: {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center'
        }
    },
    icon: {
        marginLeft: -4,
        marginRight: 10,
        verticalAlign: -6
    },
    linkColor: {
        color: Color.blue
    },
    list: {
        float: 'right',
        marginTop: '10 auto'
    },
    searchText: {
        float: 'left',
        color: Color.ltPink,
        margin: '14px 0px'
    }
};

SearchResults.propTypes = {
    searchResults: array,
    screenSize: object,
    loading: bool,
    searchFilters: array,
    searchProjectsPostFilters: object,
    searchTagsPostFilters: object,
    searchValue: string,
    showFilters: bool,
    uploads: object
};

export default SearchResults;