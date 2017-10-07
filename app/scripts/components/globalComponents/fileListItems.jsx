// import React, { PropTypes } from 'react';
// const { object, bool, array } = PropTypes;
// import { observer } from 'mobx-react';
// import mainStore from '../../stores/mainStore';
// import BaseUtils from '../../util/baseUtils.js';
// import { UrlGen, Path, Kind } from '../../util/urlEnum';
// import { Color } from '../../theme/customTheme';
// import BatchOps from '../../components/globalComponents/batchOps.jsx';
// import FileOptionsMenu from '../../components/fileComponents/fileOptionsMenu.jsx';
// import Loaders from '../../components/globalComponents/loaders.jsx';
// import Checkbox from 'material-ui/Checkbox';
// import FontIcon from 'material-ui/FontIcon';
// import Paper from 'material-ui/Paper';
// import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
// 
// @observer
// class FileListItems extends React.Component {
// 
//     render() {
//         const { allItemsSelected, filesChecked, isSafari, fileListItems, loading, responseHeaders, screenSize, tableBodyRenderKey } = mainStore;
//         let showBatchOps = !!(filesChecked.length);
//         let menuWidth = screenSize.width > 1230 ? 35 : 28;
//         let headers = responseHeaders && responseHeaders !== null ? responseHeaders : null;
//         let checkboxStyle = { maxWidth: 24, float: 'left', marginRight: isSafari ? 16 : 0 };
//         let children = fileListItems.length ? fileListItems.map((child) => {
//             let icon = 'description';
//             let itemsChecked = filesChecked;
//             const route = UrlGen.routes.file(child.id);
//             let fileOptionsMenu = <FileOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(child.id, Path.FILE, true)}/>;
//                 return (
//                     <TableRow key={child.id} selectable={false}>
//                         <TableRowColumn>
//                             {<Checkbox
//                                 style={checkboxStyle}
//                                 onCheck={()=>this.check(child.id, child.kind)}
//                                 checked={itemsChecked.includes(child.id)}
//                             />}
//                             <a href={route} className="external" onClick={(e) => this.checkForAllItemsSelected(e)}>
//                                 <div style={styles.linkColor}>
//                                     <FontIcon className="material-icons" style={styles.icon}>{icon}</FontIcon>
//                                     {child.name.length > 82 ? child.name.substring(0, 82) + '...' : child.name}
//                                     {child.kind === Kind.DDS_FILE && ' (version '+ child.current_version.version+')'}
//                                 </div>
//                             </a>
//                         </TableRowColumn>
//                         {screenSize && screenSize.width >= 680 && <TableRowColumn onTouchTap={()=>this.check(child.id, child.kind)}>
//                             <span>{child.project.name}</span>
//                         </TableRowColumn>}
//                         {screenSize && screenSize.width >= 680 && <TableRowColumn onTouchTap={()=>this.check(child.id, child.kind)}>
//                             <span>{child.audit.last_updated_on !== null ? BaseUtils.formatDate(child.audit.last_updated_on)+' by '+child.audit.last_updated_by.full_name : BaseUtils.formatDate(child.audit.created_on)+' by '+child.audit.created_by.full_name}</span>
//                         </TableRowColumn>}
//                         {screenSize && screenSize.width >= 840 && <TableRowColumn onTouchTap={()=>this.check(child.id, child.kind)} style={{width: 100}}>
//                             {child.kind === Kind.DDS_FILE && child.current_version ? BaseUtils.bytesToSize(child.current_version.upload.size) : '---'}
//                         </TableRowColumn>}
//                     </TableRow>
// 
//                 );
//         }) : null;
// 
//         return (
//             <div className="list-items-container">
//                 <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
//                     {showBatchOps && <BatchOps {...this.props}/>}
//                 </div>
//                 {loading ? <Loaders {...this.props}/> : null}
//                 <Paper className="mdl-cell mdl-cell--12-col" style={styles.list}>
//                     {fileListItems.length > 0 && <Table fixedHeader={true}>
//                         <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
//                             <TableRow>
//                                 <TableHeaderColumn>{<Checkbox
//                                     style={checkboxStyle}
//                                     onCheck={()=> this.check(!allItemsSelected, null)}
//                                     checked={allItemsSelected}
//                                 />}
//                                 Name
//                               </TableHeaderColumn>
//                                 {screenSize && screenSize.width >= 680 ? <TableHeaderColumn>
//                                   <div onClick={() => mainStore.toggleSortFileListItems('PROJECT')}>Project</div>
//                                 </TableHeaderColumn> : null}
//                                 {screenSize && screenSize.width >= 680 ? <TableHeaderColumn>
//                                   <div onClick={() => mainStore.toggleSortFileListItems('UPDATED')}>Last Updated</div>
//                                 </TableHeaderColumn> : null}
//                                 {screenSize && screenSize.width >= 840 ? <TableHeaderColumn style={{width: 100}}>
//                                   <div onClick={() => mainStore.toggleSortFileListItems('SIZE')}>Size</div>
//                                 </TableHeaderColumn> : null}
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody key={tableBodyRenderKey} showRowHover={true} displayRowCheckbox={false} deselectOnClickaway={false}>
//                             {children}
//                         </TableBody>
//                     </Table>}
//                 </Paper>
//             </div>
//         );
//     }
// 
//     check(id, kind) {
//         let files = mainStore.filesChecked;
//         let folders = [];
//         let allItemsSelected = mainStore.allItemsSelected;
//         if(id === true || id === false) {
//             files = [];
//             mainStore.toggleAllItemsSelected(id);
//             mainStore.fileListItems.forEach((i) => {
//                 id === true && !files.includes(i.id) ? files.push(i.id) : files = []
//             })
//         } else if (kind !== null && kind === Kind.DDS_FILE) {
//             !files.includes(id) ? files = [...files, id] : files = files.filter(f => f !== id);
//             allItemsSelected ? mainStore.toggleAllItemsSelected(!allItemsSelected) : null;
//         }
//         mainStore.handleBatch(files, folders);
//     }
// 
//     checkForAllItemsSelected(e) {
//         const allItemsSelected = mainStore.allItemsSelected;
//         allItemsSelected ? mainStore.toggleAllItemsSelected(!allItemsSelected) : null;
//         e.stopPropagation();
//     }
// 
//     loadMore(page) {
//         const id = this.props.params.id;
//         const kind = this.props.router.location.pathname.includes('project') ? Path.PROJECT : Path.FOLDER;
//         mainStore.getChildren(id, kind, page);
//     }
// 
//     setSelectedEntity(id, path, isListItem) {
//         mainStore.setSelectedEntity(id, path, isListItem);
//     }
// }
// 
// FileListItems.contextTypes = {
//     muiTheme: React.PropTypes.object
// };
// 
// const styles = {
//     batchOpsWrapper: {
//         marginBottom: 0
//     },
//     icon: {
//         marginLeft: -4,
//         marginRight: 10,
//         verticalAlign: -6
//     },
//     linkColor: {
//         color: Color.blue
//     },
//     list: {
//         float: 'right',
//         marginTop: '10 auto'
//     },
//     uploadFilesBtn: {
//         fontWeight: 200,
//         float: 'right',
//         margin: '0px -8px 0px 18px'
//     }
// };
// 
// FileListItems.propTypes = {
//     filesChecked: array,
//     fileListItems: array,
//     entityObj: object,
//     responseHeaders: object,
//     screenSize: object,
//     loading: bool
// };
// 
// export default FileListItems;