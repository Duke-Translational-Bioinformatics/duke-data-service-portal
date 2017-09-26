import React, { PropTypes } from 'react';
const { object, bool, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import { UrlGen, Path, Kind } from '../../util/urlEnum';
import { Color } from '../../theme/customTheme';
import Loaders from '../../components/globalComponents/loaders.jsx';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

@observer
class SearchResults extends React.Component {

    render() {
        const { loading, nextPage, screenSize, searchResults, searchResultsProjects, searchResultsTags, searchValue, showFilters, tableBodyRenderKey, totalItems, uploads } = mainStore;
        let menuWidth = screenSize.width > 1230 ? 35 : 28;
        let srchValue = searchValue !== null ? 'for ' +'"'+searchValue+'"' : '';
        // let containerClass = showFilters ? ' show-filters-transition' : ' hide-filters-transition';
        let pageResults = searchResults.length > searchResults.length ? searchResults.length+' out of '+searchResults.length : searchResults.length;
        let results = searchResults && searchResults.length ? searchResults.map((child) => {
            let icon = child.kind === Kind.DDS_FOLDER ? 'folder' : 'description';
            const route = child.kind === Kind.DDS_FOLDER ? UrlGen.routes.folder(child.id) : UrlGen.routes.file(child.id);

            return (
                !child.is_deleted && <TableRow key={child.id} selectable={false}>
                    <TableRowColumn>
                        {/*{showChecks && <Checkbox*/}
                            {/*style={checkboxStyle}*/}
                            {/*onCheck={()=>this.check(child.id, child.kind)}*/}
                            {/*checked={itemsChecked.includes(child.id)}*/}
                        {/*/>}*/}
                        <a href={route} className="external" onClick={(e) => this.checkForAllItemsSelected(e)}>
                            <div style={styles.linkColor}>
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
                    <TableRowColumn style={{textAlign: 'right', width: menuWidth}}>
                        <div onClick={(e) => {e.stopPropagation()}}>
                            {/*{child.kind === Kind.DDS_FILE ? fileOptionsMenu : folderOptionsMenu }*/}
                        </div>
                    </TableRowColumn>
                </TableRow>
            );
        }) : null;

        return (
            <div className="list-items-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    {<div style={styles.searchText}>Showing{" "+pageResults+" "}results{' '+srchValue}</div>}
                    {searchResults.length || showFilters ? <IconButton
                             iconClassName="material-icons"
                             tooltip="filter results"
                             style={{float: 'right'}}
                             onTouchTap={()=>this.toggleFilters()}
                             >
                             tune
                        </IconButton> : null}
                </div>
                {uploads || loading ? <Loaders {...this.props}/> : null}
                <Paper className="mdl-cell mdl-cell--12-col" style={styles.list}>
                    {searchResults.length > 0 && <Table fixedHeader={true}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>
                                    {/*{showChecks && <Checkbox*/}
                                    {/*style={checkboxStyle}*/}
                                    {/*onCheck={()=> this.check(!allItemsSelected, null)}*/}
                                    {/*checked={allItemsSelected}*/}
                                {/*/>}*/}
                                </TableHeaderColumn>
                                {screenSize && screenSize.width >= 680 ? <TableHeaderColumn>Last Updated</TableHeaderColumn> : null}
                                {screenSize && screenSize.width >= 840 ? <TableHeaderColumn style={{width: 100}}>Size</TableHeaderColumn> : null}
                                <TableHeaderColumn style={{textAlign: 'right', width: menuWidth}}></TableHeaderColumn>
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
                                onTouchTap={()=>this.loadMore(nextPage)}
                                fullWidth={true}
                                style={loading ? {backgroundColor: Color.ltBlue2} : {}}
                                labelStyle={loading ? {color: Color.blue} : {fontWeight: '100'}}/>
                        </div>
                    }
                </Paper>
            </div>
        );
    }

    check(id, kind) {
        let files = mainStore.filesChecked;
        let folders = mainStore.foldersChecked;
        let allItemsSelected = mainStore.allItemsSelected;
        let prjPrm = mainStore.projPermissions;
        if(id === true || id === false) {
            files = [];
            folders = [];
            mainStore.toggleAllItemsSelected(id);
            mainStore.searchResults.forEach((i) => {
                i.kind === Kind.DDS_FILE ? id === true && !files.includes(i.id) ? files.push(i.id) : files = [] : id === true && !folders.includes(i.id) ? folders.push(i.id) : folders = [];
            })
        } else if (kind !== null && kind === Kind.DDS_FILE) {
            !files.includes(id) ? files = [...files, id] : files = files.filter(f => f !== id);
            allItemsSelected ? mainStore.toggleAllItemsSelected(!allItemsSelected) : null;
        } else {
            !folders.includes(id) ? folders = [...folders, id] : folders = folders.filter(f => f !== id);
            allItemsSelected ? mainStore.toggleAllItemsSelected(!allItemsSelected) : null;
        }
        if(prjPrm !== 'viewOnly' && prjPrm !== 'flUpload') mainStore.handleBatch(files, folders);
    }

    checkForAllItemsSelected(e) {
        const allItemsSelected = mainStore.allItemsSelected;
        allItemsSelected ? mainStore.toggleAllItemsSelected(!allItemsSelected) : null;
        e.stopPropagation();
    }

    loadMore(page) {
        const id = this.props.params.id;
        const kind = this.props.router.location.pathname.includes('project') ? Path.PROJECT : Path.FOLDER;
        mainStore.getChildren(id, kind, page);
    }

    toggleFilters() {
        mainStore.toggleSearchFilters();
    }

    toggleSearch() {
        if(mainStore.showSearch) mainStore.toggleSearch();
    }

    setSelectedEntity(id, path, isListItem) {
        mainStore.setSelectedEntity(id, path, isListItem);
    }

    toggleUploadManager() {
        mainStore.toggleUploadManager();
        mainStore.defineTagsToAdd([]);
        mainStore.processFilesToUpload([], []);
    }
}

SearchResults.contextTypes = {
    muiTheme: React.PropTypes.object
};

const styles = {
    batchOpsWrapper: {
        marginBottom: 0
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
    },
    uploadFilesBtn: {
        fontWeight: 200,
        float: 'right',
        margin: '0px -8px 0px 18px'
    }
};

SearchResults.propTypes = {
    filesChecked: array,
    foldersChecked: array,
    searchResults: array,
    entityObj: object,
    projPermissions: object,
    responseHeaders: object,
    screenSize: object,
    uploads: object,
    loading: bool
};

export default SearchResults;
// import React, { PropTypes } from 'react';
// const { object, bool, array, string } = PropTypes;
// import { observer } from 'mobx-react';
// import mainStore from '../../stores/mainStore';
// import { Color } from '../../theme/customTheme';
// import { UrlGen } from '../../util/urlEnum';
// import BaseUtils from '../../util/baseUtils.js';
// import Loaders from '../globalComponents/loaders.jsx';
// import SearchFilters from '../globalComponents/searchFilters.jsx';
// import FontIcon from 'material-ui/FontIcon';
// import IconButton from 'material-ui/IconButton';
// import RaisedButton from 'material-ui/RaisedButton';
//
// @observer
// class SearchResults extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.state = { // Temporary pagination until the services get properly updated to return paginated results
//             page: 0
//         }
//     }
//
//     render() {
//         const { projPermissions, searchResults, searchValue, searchResultsFolders, searchResultsFiles, searchResultsProjects, showFilters, uploads, loading } = mainStore;
//         let results = searchResults.length ? searchResults : [];
//         let srchValue = searchValue !== null ? 'for ' +'"'+searchValue+'"' : '';
//         let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
//         if (results.length > 20) {
//             switch (this.state.page) {
//                 case 0:
//                     results = searchResults.slice(0, 20);
//                     break;
//                 case 1:
//                     results = searchResults.slice(0, 40);
//                     break;
//                 case 2:
//                     results = searchResults.slice(0, 60);
//                     break;
//                 case 3:
//                     results = searchResults;
//                     break;
//             }
//         } else {
//             results = searchResults;
//         }
//         let srchResults = results.map((results) => {
//             if (results.kind === 'dds-folder') {
//                 return (
//                     <li key={ results.id } className="hover">
//                         <a href={UrlGen.routes.folder(results.id)}
//                            className="item-content external" onTouchTap={() => this.toggleSearch()}>
//                             <div className="item-media">
//                                 <FontIcon className="material-icons" style={styles.icon}>folder</FontIcon>
//                             </div>
//                             <div className="item-inner">
//                                 <div className="item-title-row">
//                                     <div className="item-title mdl-color-text--grey-800"
//                                          style={styles.title}>{results.name.length > 82 ? results.name.substring(0, 82) + '...' : results.name}</div>
//                                 </div>
//                                 <div className="item-subtitle mdl-color-text--grey-600">Created
//                                     by { results.audit.created_by.full_name }</div>
//                                 <div className="item-subtitle mdl-color-text--grey-600">{results.audit.last_updated_on !== null ? 'Last updated on ' +BaseUtils.formatDate(results.audit.last_updated_on)+ ' by ' :
//                                     <br />}
//                                     { results.audit.last_updated_by !== null ? results.audit.last_updated_by.full_name : null}</div>
//                             </div>
//                         </a>
//                     </li>
//                 );
//             } else {
//                 return (
//                     <li key={ results.id } className="hover">
//                         <a href={UrlGen.routes.file(results.id)}
//                            className="item-content external">
//                             <div className="item-media"><FontIcon className="material-icons" style={styles.icon}>description</FontIcon>
//                             </div>
//                             <div className="item-inner">
//                                 <div className="item-title-row">
//                                     <div className="item-title mdl-color-text--grey-800"
//                                          style={styles.title}>{results.name.length > 82 ? results.name.substring(0, 82) + '...' : results.name}</div>
//                                 </div>
//                                 <div className="item-subtitle mdl-color-text--grey-600">{BaseUtils.bytesToSize(results.current_version.upload.size) + ' - '}version {results.current_version.version}</div>
//                                 <div className="item-subtitle mdl-color-text--grey-600">{results.audit.last_updated_on !== null ? 'Last updated on ' +BaseUtils.formatDate(results.audit.last_updated_on)+ ' by ' :
//                                     <br />}
//                                     { results.audit.last_updated_by !== null ? results.audit.last_updated_by.full_name : null}</div>
//                             </div>
//                         </a>
//                     </li>
//                 );
//             }
//         });
//         let pageResults = searchResults.length > searchResults.length ? searchResults.length+' out of '+searchResults.length : searchResults.length;
//         return (
//             <div className="search-results-container" style={{marginLeft: showFilters ? '23%' : ''}}>
//                  <SearchFilters {...this.props} />
//                  <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
//                     <div style={styles.searchTextWrapper}>
//                         {<div style={styles.searchText}>Showing{" "+pageResults+" "}results{' '+srchValue}</div>}
//                         {searchResultsFolders.length && searchResultsFiles.length || searchResultsProjects.length ? <IconButton
//                             iconClassName="material-icons"
//                             tooltip="filter results"
//                             style={{float: 'right'}}
//                             onTouchTap={()=>this.toggleFilters()}
//                             >
//                             tune
//                         </IconButton> : null}
//                     </div>
//                 </div>
//                 { uploads || loading ? <Loaders {...this.props}/> : null }
//                 <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
//                     <div className="list-block list-block-search searchbar-found media-list">
//                         <ul>
//                             {srchResults}
//                         </ul>
//                     </div>
//                     {searchResults.length > 25 && searchResults.length > results.length && this.state.page < 3 ?
//                         <div className="mdl-cell mdl-cell--12-col">
//                             <RaisedButton
//                                 label="Load More"
//                                 secondary={true}
//                                 onTouchTap={this.loadMore.bind(this)}
//                                 fullWidth={true}
//                                 labelStyle={{fontWeight: '100'}}/>
//                         </div> : null}
//                 </div>
//             </div>
//         );
//     }
//
//     loadMore() {
//         this.setState({page: this.state.page + 1});
//     }
//
//     toggleFilters() {
//         mainStore.toggleSearchFilters();
//     }
//
//     toggleSearch() {
//         if(mainStore.showSearch) mainStore.toggleSearch();
//     }
// }
//
// const styles = {
//     searchTextWrapper: {
//     },
//     icon: {
//         fontSize: 36,
//         marginTop: 20,
//         color: Color.dkGrey
//     },
//     list: {
//         float: 'right'
//     },
//     searchText: {
//         marginLeft: 17,
//         marginTop: 13,
//         float: 'left',
//     },
//     title: {
//         marginRight: 40
//     }
// };
//
// SearchResults.contextTypes = {
//     muiTheme: object
// };
//
// SearchResults.propTypes = {
//     uploads: object,
//     loading: bool,
//     results: array,
//     searchResults: array,
//     searchResultsFolders: array,
//     searchResultsFiles: array,
//     searchResultsProjects: array,
//     searchValue: string,
//     projPermissions: string,
//     showFilters: bool
// };
//
// export default SearchResults;