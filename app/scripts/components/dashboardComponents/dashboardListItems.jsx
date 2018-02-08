import React, { PropTypes } from 'react';
const { object, bool, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import dashboardStore from '../../stores/dashboardStore';
import BaseUtils from '../../util/baseUtils.js';
import { UrlGen, Path, Kind } from '../../util/urlEnum';
import { Color } from '../../theme/customTheme';
import BatchOps from '../../components/globalComponents/batchOps.jsx';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import AddProjectModal from '../../components/projectComponents/addProjectModal.jsx';
import FileOptionsMenu from '../../components/fileComponents/fileOptionsMenu.jsx';
import FolderOptionsMenu from '../../components/folderComponents/folderOptionsMenu.jsx';
import ProjectOptionsMenu from '../../components/projectComponents/projectOptionsMenu.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import Checkbox from 'material-ui/Checkbox';
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

@observer
class DashboardListItems extends React.Component {

    render() {
        const { allItemsSelected, filesChecked, foldersChecked, isSafari, 
            listItems, loading, projPermissions, projectRoles, responseHeaders,
            screenSize, tableBodyRenderKey, uploads, projects, project
        } = mainStore;
        const { drawer, selectedItem } = dashboardStore;
        const contentStyle = drawer.get('contentStyle')
        const displayingProjects = !!(selectedItem)

        let showBatchOps = !!(filesChecked.length || foldersChecked.length);
        let menuWidth = screenSize.width > 1230 ? 35 : 28;
        let headers = responseHeaders && responseHeaders !== null ? responseHeaders : null;
        let nextPage = headers !== null && !!headers['x-next-page'] ? headers['x-next-page'][0] : null;
        let totalChildren = headers !== null && !!headers['x-total'] ? headers['x-total'][0] : null;
        let newFolderModal = null;
        let uploadManager = null;
        let addProject = null;
        let projectRole = projectRoles.get(project.id);
        let showChecks = (projectRole && projectRole !== 'View Only' && projectRole !== 'File Uploader');
        let checkboxStyle = { maxWidth: 24, float: 'left', marginRight: isSafari ? 16 : 0 };
        if (this.props.params.id && projectRole !== null) {
            newFolderModal = projectRole === 'Project Viewer' || projectRole === 'File Downloader' ? null : <AddFolderModal {...this.props}/>;
            uploadManager = projectRole === 'Project Viewer' || projectRole === 'File Downloader' ? null : <RaisedButton label="Upload Files"
                                                                                                    labelPosition="before"
                                                                                                    labelStyle={{color: Color.blue}}
                                                                                                    style={styles.uploadFilesBtn}
                                                                                                    icon={<FileUpload color={Color.pink} />}
                                                                                                    onTouchTap={() => this.toggleUploadManager()}/>;
            showChecks = (projectRole !== 'Project Viewer' && projectRole !== 'File Uploader');
        } else {
            addProject = <AddProjectModal {...this.props} />
        }
        let children = listItems && listItems.length ? listItems.map((child) => {
            return (
                <TableRow key={child.id} selectable={false}>
                    {this.tableRowColumnCheckBox(child, showChecks, checkboxStyle)}
                    {this.tableRowColumnName(child, showChecks)}
                    {this.tableRowColumnLastUpdated(child, screenSize)}
                    {this.tableRowColumnSize(child, screenSize)}
                    {this.tableRowColumnMenu(child, menuWidth)}
                </TableRow>
            );
        }) : null;

        return (
            <div style={contentStyle} className="list-items-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    {!showBatchOps && <div className="mdl-cell mdl-cell--12-col">
                        {addProject}
                        {uploadManager}
                        {newFolderModal}
                    </div>}
                    {showBatchOps && <BatchOps {...this.props}/>}
                </div>
                {uploads || loading ? <Loaders {...this.props}/> : null}
                <Paper className="mdl-cell mdl-cell--12-col" style={styles.list}>
                    {listItems.length > 0 && <Table fixedHeader={true}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                {selectedItem && <TableHeaderColumn style={styles.checkbox}>
                                    {showChecks && <Checkbox
                                        style={checkboxStyle}
                                        onCheck={()=> this.check(!allItemsSelected, null)}
                                        checked={allItemsSelected}
                                    />}
                                </TableHeaderColumn>}
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                {screenSize && screenSize.width >= 680 ? <TableHeaderColumn>Last Updated</TableHeaderColumn> : null}
                                {screenSize && screenSize.width >= 840 ? <TableHeaderColumn style={{width: 100}}>Size</TableHeaderColumn> : null}
                                <TableHeaderColumn style={{textAlign: 'right', width: menuWidth}}></TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody key={tableBodyRenderKey} showRowHover={true} displayRowCheckbox={false} deselectOnClickaway={false}>
                            {children}
                        </TableBody>
                    </Table>}
                    {listItems.length < totalChildren && totalChildren > 25 &&
                    <div className="mdl-cell mdl-cell--12-col">
                        <RaisedButton
                            label={loading ? "Loading..." : "Load More"}
                            secondary={true}
                            disabled={!!loading}
                            onTouchTap={()=>this.loadMore(nextPage)}
                            fullWidth={true}
                            style={loading ? {backgroundColor: Color.ltBlue2} : {}}
                            labelStyle={loading ? {color: Color.blue} : {fontWeight: '100'}}/>
                    </div>}
                </Paper>
                {this.emptyList(loading, selectedItem, listItems, projects)}
            </div>
        );
    }
    
    emptyList(loading, selectedItem, listItems, projects) {
        if (listItems.length === 0 && !loading) {
            // let noProjects = "New Projects are only a click away"
            let noProjects = "New Projects are only a click away... well a few clicks and some typing"
            let noFilesFolders = 'Create a new Folder or upload a Files'
            let message = selectedItem ? noFilesFolders : projects.length === 0 ? noProjects : null
            return (
                <div>
                    <h4 style={{textAlign: 'center'}}>{message}</h4>
                    <img src="/images/blackArrowCurved.png" style={styles.arrow}/>
                </div>
            )
        }
    }
    
    tableRowColumnCheckBox(child, showChecks, checkboxStyle) {
        const { filesChecked, foldersChecked } = mainStore;
        if (child.kind === Kind.DDS_FILE || child.kind === Kind.DDS_FOLDER) {
            let itemsChecked = child.kind === Kind.DDS_FOLDER ? foldersChecked : filesChecked;
            return (
                <TableRowColumn style={styles.checkbox} onTouchTap={()=>this.check(child.id, child.kind)}>
                    {showChecks && <Checkbox
                        style={checkboxStyle}
                        checked={itemsChecked.includes(child.id)}
                    />}
                </TableRowColumn>
            )
        // } else {
        //     return (
        //         <TableRowColumn style={styles.checkbox} onTouchTap={() => dashboardStore.selectItem(child.id, this.props.router)}/>
        //     )
        }
    }

    tableRowColumnName(child, showChecks) {
        let nameInfo = <div style={styles.linkColor}>
            {this.iconPicker(child.kind)}
            {child.name.length > 82 ? child.name.substring(0, 82) + '...' : child.name}
            {child.kind === Kind.DDS_FILE && ' (version '+ child.current_version.version+')'}
        </div>
        if (child.kind === Kind.DDS_FILE) {
            return (
                <TableRowColumn onTouchTap={() => this.check(child.id, child.kind)}>
                    {nameInfo}
                </TableRowColumn>
            )
        } else {
            return (
                <TableRowColumn onTouchTap={() => dashboardStore.selectItem(child.id, this.props.router)}>
                    {nameInfo}
                </TableRowColumn>
            )
        }
    }
    
    tableRowColumnLastUpdated(child, screenSize) {
        if (screenSize && screenSize.width >= 680) {
            let updatedInfo
            if (child.audit.last_updated_on !== null && child.audit.last_updated_by !== null) {
                updatedInfo = BaseUtils.formatDate(child.audit.last_updated_on)+' by '+child.audit.last_updated_by.full_name
            } else {
                updatedInfo = BaseUtils.formatDate(child.audit.created_on)+' by '+child.audit.created_by.full_name
            }
            if (child.kind === Kind.DDS_FILE) {
                return (
                    <TableRowColumn onTouchTap={()=>this.check(child.id, child.kind)}>
                      <span>{updatedInfo}</span>
                    </TableRowColumn>
                )
            } else {
                return (
                    <TableRowColumn onTouchTap={() => dashboardStore.selectItem(child.id, this.props.router)}>
                      <span>{updatedInfo}</span>
                    </TableRowColumn>
                )
            }
        }
    }
    
    tableRowColumnSize(child, screenSize) {
        if (screenSize && screenSize.width >= 840) {
            let sizeInfo
            if (child.kind === Kind.DDS_FILE && child.current_version) {
                sizeInfo = BaseUtils.bytesToSize(child.current_version.upload.size)
            } else {
                sizeInfo = '---'
            }
            
            if (child.kind === Kind.DDS_FILE) {
                return (
                    <TableRowColumn onTouchTap={()=>this.check(child.id, child.kind)} style={{width: 100}}>
                        {sizeInfo}
                    </TableRowColumn>
                )
            } else {
                return (
                    <TableRowColumn onTouchTap={() => dashboardStore.selectItem(child.id, this.props.router)} style={{width: 100}}>
                        {sizeInfo}
                    </TableRowColumn>
                )
            }
        }
    }
    
    tableRowColumnMenu(child, menuWidth) {
        let optionsMenu
        if (child.kind === Kind.DDS_FILE) {
            optionsMenu = <FileOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(child.id, Path.FILE, true)}/>
        } else if (child.kind === Kind.DDS_FOLDER) {
            optionsMenu = <FolderOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(child.id, Path.FOLDER, true)}/>
        } else if (child.kind === Kind.DDS_PROJECT) {
            optionsMenu = <ProjectOptionsMenu {...this.props} clickHandler={()=>mainStore.setSelectedProject(child.id)}/>
        }
        return (
            <TableRowColumn style={{textAlign: 'right', width: menuWidth}}>
                <div onClick={(e) => {e.stopPropagation()}}>
                    {optionsMenu}
                </div>
            </TableRowColumn>
        )
    }

    check(id, kind) {
        let files = mainStore.filesChecked;
        let folders = mainStore.foldersChecked;
        let allItemsSelected = mainStore.allItemsSelected;
        let projectRole = mainStore.projectRoles.get(mainStore.project.id);
        if(id === true || id === false) {
            files = [];
            folders = [];
            mainStore.toggleAllItemsSelected(id);
            mainStore.listItems.forEach((i) => {
                i.kind === Kind.DDS_FILE ? id === true && !files.includes(i.id) ? files.push(i.id) : files = [] : id === true && !folders.includes(i.id) ? folders.push(i.id) : folders = [];
            })
        } else if (kind !== null && kind === Kind.DDS_FILE) {
            !files.includes(id) ? files = [...files, id] : files = files.filter(f => f !== id);
            allItemsSelected ? mainStore.toggleAllItemsSelected(!allItemsSelected) : null;
        } else {
            !folders.includes(id) ? folders = [...folders, id] : folders = folders.filter(f => f !== id);
            allItemsSelected ? mainStore.toggleAllItemsSelected(!allItemsSelected) : null;
        }
        if(projectRole !== 'Project Viewer' && projectRole !== 'File Uploader') mainStore.handleBatch(files, folders);
    }
    
    checkForAllItemsSelected(e) {
        const allItemsSelected = mainStore.allItemsSelected;
        allItemsSelected ? mainStore.toggleAllItemsSelected(!allItemsSelected) : null;
        e.stopPropagation();
    }
    
    iconPicker(kind) {
        let kinds = {
            'dds-project': 'content_paste',
            'dds-folder': 'folder',
            'dds-file': 'description'
        }

        return (
            <FontIcon className="material-icons" style={styles.icon}>
                {kinds[kind]}
            </FontIcon>
        )
    }

    loadMore(page) {
        const id = this.props.params.id;
        const kind = this.props.router.location.pathname.includes('project') ? Path.PROJECT : Path.FOLDER;
        mainStore.getChildren(id, kind, page);
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

DashboardListItems.contextTypes = {
    muiTheme: React.PropTypes.object
};

const styles = {
    arrow: {
        width: '400px',
        float: 'right',
        paddingRight: '200px'
    },
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
    uploadFilesBtn: {
        fontWeight: 200,
        float: 'right',
        margin: '0px -8px 0px 18px'
    },
    checkbox: {
        width: 5
    }
};

DashboardListItems.propTypes = {
    filesChecked: array,
    foldersChecked: array,
    listItems: array,
    entityObj: object,
    projPermissions: object,
    responseHeaders: object,
    screenSize: object,
    uploads: object,
    loading: bool
};

export default DashboardListItems;