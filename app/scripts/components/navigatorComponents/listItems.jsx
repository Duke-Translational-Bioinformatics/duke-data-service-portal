import React from 'react';
import PropTypes from 'prop-types';
const { array, bool, number, object, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import navigatorStore from '../../stores/navigatorStore';
import agentStore from '../../stores/agentStore';
import authStore from '../../stores/authStore';
import BaseUtils from '../../util/baseUtils.js';
import { UrlGen, Path, Kind } from '../../util/urlEnum';
import { Roles } from '../../enum';
import { Color, WindowBreak } from '../../theme/customTheme';
import BatchOps from '../../components/globalComponents/batchOps.jsx';
import AddAgentModal from '../../components/globalComponents/addAgentModal.jsx';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import AddProjectModal from '../../components/projectComponents/addProjectModal.jsx';
import FileOptionsMenu from '../../components/fileComponents/fileOptionsMenu.jsx';
import FolderOptionsMenu from '../../components/folderComponents/folderOptionsMenu.jsx';
import ProjectOptionsMenu from '../../components/projectComponents/projectOptionsMenu.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton'
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import ViewModule from 'material-ui/svg-icons/action/view-module';

@observer
class ListItems extends React.Component {

    render() {
        const {
            allItemsSelected,
            filesChecked,
            foldersChecked,
            isSafari,
            loading,
            nextPage,
            projectRole,
            projectRoles,
            projects,
            screenSize,
            tableBodyRenderKey,
            toggleListStyle,
            totalItems,
            uploads,
        } = mainStore;
        const { downloadedItems, listItems } = navigatorStore;
        const { agents } = agentStore;
        const { currentUser } = authStore;
        let items
        if (this.isListKind('Projects')) {
            items = projects;
        } else if (this.isListKind('Agents')) {
            items = agents.filter(a => a.audit.created_by.id === currentUser.id);
        } else {
            items = listItems;
        }

        let showBatchOps = this.isListKind('FoldersFiles') && !!(filesChecked.length || foldersChecked.length);
        let showUploadButton = this.isListKind('FoldersFiles') && projectRole !== null && projectRole !== Roles.project_viewer && projectRole !== Roles.file_downloader;
        let showAddAgentButton = this.isListKind('Agents');
        let showAddFolderButton = this.isListKind('FoldersFiles');
        let showAddProjectButton = this.isListKind('Projects');
        let showListItemsTable = items.length > 0;
        let showLoadMoreButton = !this.isListKind('Agents') && items.length < totalItems && totalItems > 25;
        let menuWidth = this.isListKind('Agents') ? 118 : screenSize.width > 1230 ? 35 : 28;
        let componentName = this.props.router.routes[1]['component']['name'];
        let checkboxStyle = { maxWidth: 24, float: 'left', marginRight: isSafari ? 16 : 0 };
        let showCheckboxColumn = this.isListKind('FoldersFiles') && projectRole !== null && projectRole !== Roles.project_viewer && projectRole !== Roles.file_uploader && projectRole !== Roles.file_downloader;
        let showLastUpdatedColumn = screenSize && screenSize.width >= WindowBreak.sm;
        let showProjectRoleColumn = this.isListKind('Projects');
        let showSizeColumn = this.isListKind('FoldersFiles') && screenSize && screenSize.width >= WindowBreak.md;
        let children = items && items.length ? items.map((child) => {
            if(child && !child.is_deleted) {
                let route = this.listItemRoute(child, componentName)
                return (
                    <TableRow key={child.id} selectable={false}>
                        {showCheckboxColumn && this.tableRowColumnCheckBox(child, checkboxStyle, filesChecked, foldersChecked)}
                        {this.tableRowColumnName(child, route)}
                        {showLastUpdatedColumn && this.tableRowColumnLastUpdated(child, route)}
                        {showProjectRoleColumn && this.tableRowColumnProjectRole(child, projectRoles)}
                        {showSizeColumn && this.tableRowColumnSize(child)}
                        {this.tableRowColumnMenu(child, menuWidth, projectRoles)}
                    </TableRow>
                );
            }
        }) : null;

        return (
            <div className="navigator-list-items-container">
                {this.itemsActionBar(showBatchOps, showAddAgentButton, showUploadButton, showAddFolderButton, showAddProjectButton, toggleListStyle)}
                {uploads || loading ? <Loaders {...this.props}/> : null}
                <Paper className="mdl-cell mdl-cell--12-col" style={styles.table}>
                    {showListItemsTable && <Table fixedHeader={true}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                {showCheckboxColumn && this.tableHeaderColumnCheckBox(checkboxStyle, allItemsSelected)}
                                {this.tableHeaderColumnName()}
                                {showLastUpdatedColumn && this.tableHeaderColumnLastUpdated(screenSize)}
                                {showProjectRoleColumn && this.tableHeaderColumnProjectRole()}
                                {showSizeColumn && this.tableHeaderColumnSize()}
                                {this.tableHeaderColumnMenu(menuWidth)}
                            </TableRow>
                        </TableHeader>
                        <TableBody key={tableBodyRenderKey} showRowHover={true} displayRowCheckbox={false} deselectOnClickaway={false}>
                            {children}
                        </TableBody>
                    </Table>}
                    {showLoadMoreButton && <div className="mdl-cell mdl-cell--12-col">
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
            </div>
        );
    }

    // tableHeaders
    tableHeaderColumnCheckBox(checkboxStyle, allItemsSelected) {
        return (
            <TableHeaderColumn style={styles.columns.header.checkbox}>
                <Checkbox
                    label="SELECT ALL"
                    labelStyle={{fontSize: 14, color: Color.ltPink}}
                    style={checkboxStyle}
                    onCheck={()=> this.check(!allItemsSelected, null)}
                    checked={allItemsSelected}/>
            </TableHeaderColumn>
        )  
    }
    tableHeaderColumnName() {
        return <TableHeaderColumn/>;
    }
    tableHeaderColumnLastUpdated() {
        return (
            <TableHeaderColumn style={styles.columns.header.lastUpdated}>
                LAST UPDATED
            </TableHeaderColumn>
        )
    }
    tableHeaderColumnProjectRole() {
        return (
            <TableHeaderColumn style={styles.columns.header.projectRole}>
                PROJECT ROLE
            </TableHeaderColumn>
        )
    }
    tableHeaderColumnSize() {
        return (
            <TableHeaderColumn style={styles.columns.header.size}>
                SIZE
            </TableHeaderColumn>
        )
    }
    tableHeaderColumnMenu(menuWidth) {
        return (
            <TableHeaderColumn style={{textAlign: 'right', width: menuWidth}}></TableHeaderColumn>            
        )
    }

    // tableRows
    tableRowColumnCheckBox(child, checkboxStyle, filesChecked, foldersChecked) {
        if (child.kind !== undefined) {
            let itemsChecked = child.kind === Kind.DDS_FOLDER ? foldersChecked : filesChecked;
            return (
                <TableRowColumn style={styles.columns.row.checkbox}>
                    <Checkbox
                        style={checkboxStyle}
                        onCheck={() => this.check(child.id, child.kind)}
                        checked={itemsChecked.includes(child.id)}
                    />
                </TableRowColumn>
            )  
        }
    }
    tableRowColumnName(child, route) {
        return (
            <TableRowColumn>
                <a href={route} className="external" onClick={(e) => this.checkForAllItemsSelected(e)}>
                    <div style={styles.linkColor}>
                        {this.iconPicker(child.kind)}
                        {child.name.length > 82 ? child.name.substring(0, 82) + '...' : child.name}
                        {child.kind === Kind.DDS_FILE ? ' (version '+ child.current_version.version+')' : ''}
                    </div>
                </a>
            </TableRowColumn>
        )
    }
    tableRowColumnLastUpdated(child, route) {
        let audit = child.audit
        let info = { date: audit.created_on, name: audit.created_by.full_name }
        if (audit.last_updated_on !== null && audit.last_updated_by !== null) {
            info.date = audit.last_updated_on
            info.name = audit.last_updated_by.full_name
        }
        let infoString = BaseUtils.formatDate(info.date) + ' by ' + info.name
        if (this.isListKind('FoldersFiles')) {
            return (
                <TableRowColumn onTouchTap={()=>this.check(child.id, child.kind)} style={styles.columns.row.lastUpdated}>
                    {infoString}
                </TableRowColumn>
            )
        } else {
            return (
                <TableRowColumn style={styles.columns.row.lastUpdated}>
                    {infoString}
                </TableRowColumn>
            )
        }
    }
    tableRowColumnProjectRole(child, projectRoles) {
        let role = projectRoles.get(child.id);
        return (
            <TableRowColumn style={styles.columns.row.projectRole}>
                {role}
            </TableRowColumn>)
    }
    tableRowColumnSize(child) {
        let sizeInfo = '---'
        if (child.kind === Kind.DDS_FILE && child.current_version) {
            sizeInfo = BaseUtils.bytesToSize(child.current_version.upload.size)
        }
        return (
            <TableRowColumn onTouchTap={() => this.check(child.id, child.kind)} style={styles.columns.row.size}>
                {sizeInfo}
            </TableRowColumn>
        )
    }
    tableRowColumnMenu(child, menuWidth, projectRoles) {
        let optionsMenu
        if (child.kind === Kind.DDS_FILE) {
            optionsMenu = <FileOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(child.id, Path.FILE, true)}/>
        } else if (child.kind === Kind.DDS_FOLDER) {
            optionsMenu = <FolderOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(child.id, Path.FOLDER, true)}/>
        } else if (child.kind === Kind.DDS_PROJECT) {
            let role = projectRoles.get(child.id);
            optionsMenu = role && role === 'Project Admin' && <ProjectOptionsMenu {...this.props} clickHandler={()=>mainStore.setSelectedProject(child.id)}/>
        }
        return (
            <TableRowColumn style={{textAlign: 'right', width: menuWidth}}>
                <div onClick={(e) => {e.stopPropagation()}}>
                    {optionsMenu}
                </div>
            </TableRowColumn>
        )
    }

    // HelperFunctions
    listKind() {
        let pathname = this.props.router.location.pathname
        if (pathname === UrlGen.pathname.home()) {
            return 'Projects';
        } else if (pathname === UrlGen.pathname.navigatorHome()) {
            return 'Projects';
        } else if (pathname.includes(UrlGen.pathname.agents())) {
            return 'Agents';
        } else if (pathname.includes(UrlGen.pathname.navigatorProject())) {
            return 'ProjectChildren';
        } else if (pathname.includes(UrlGen.pathname.navigatorFolder())) {
            return 'FolderChildren';
        }
    }

    isListKind(listKindQuery) {
        if (listKindQuery === 'FoldersFiles') {
            return this.listKind() === 'ProjectChildren' || this.listKind() === 'FolderChildren';
        } else {
            return listKindQuery === this.listKind();
        }
    }

    itemsActionBar(showBatchOps, showAddAgentButton, showUploadButton, showAddFolderButton, showAddProjectButton, toggleListStyle) {
        return (
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                {!showBatchOps && <div>
                    {showUploadButton && <RaisedButton
                                          label="Upload Files"
                                          labelPosition="before"
                                          labelStyle={{color: Color.blue}}
                                          style={styles.uploadFilesBtn}
                                          icon={<FileUpload color={Color.pink} />}
                                          onTouchTap={() => this.toggleUploadManager()}/>}
                    {showAddAgentButton && <AddAgentModal {...this.props}/>}
                    {showAddFolderButton && <AddFolderModal {...this.props}/>}
                    {showAddProjectButton && <AddProjectModal {...this.props}/>}
                    <div style={styles.listStyleToggle}>
                        <IconButton
                            tooltip={!toggleListStyle ? 'list view' : 'tile view'}
                            onClick={() => this.toggleListStyle()}
                            iconStyle={styles.listStyleToggle.icon}
                            style={styles.listStyleToggle.iconRoot}
                            hoveredStyle={styles.listStyleToggle.tooltipHover}
                        >
                            {toggleListStyle && <ViewModule />}
                        </IconButton>
                    </div>
                </div>}
                {showBatchOps && <BatchOps {...this.props}/>}
            </div>
        )
    }


    listItemRoute(child, componentName) {
        if (componentName === 'Navigator') {
            if (child.kind === Kind.DDS_PROJECT) {
                return UrlGen.routes.navigatorProject(child.id);
            } else if (child.kind === Kind.DDS_FOLDER) {
                return UrlGen.routes.navigatorFolder(child.id);
            }
        } else {
            if (child.kind === undefined) {
                return UrlGen.routes.agents();
            } else if (child.kind === Kind.DDS_FOLDER) {
                return UrlGen.routes.folder(child.id);
            } else if (child.kind === Kind.DDS_PROJECT) {
                return UrlGen.routes.project(child.id);
            } else {
                return UrlGen.routes.file(child.id);
            }
        };
    }

    iconPicker(kind) {
        let iconKind = '';
        switch (kind) {
            case Kind.DDS_PROJECT:
                iconKind = 'content_paste';
                break;
            case Kind.DDS_FOLDER:
                iconKind = 'folder';
                break;
            case Kind.DDS_FILE:
                iconKind = 'description';
                break;
            default:
                iconKind = 'laptop_mac';
        }
        return (
            <FontIcon className="material-icons" style={styles.icon}>
                {iconKind}
            </FontIcon>
        )
    }

    check(id, kind) {
        let files = mainStore.filesChecked;
        let folders = mainStore.foldersChecked;
        let { allItemsSelected, projectRole } = mainStore;
        if(id === true || id === false) {
            files = [];
            folders = [];
            mainStore.toggleAllItemsSelected(id);
            navigatorStore.listItems.forEach((i) => {
                i.kind === Kind.DDS_FILE ? id === true && !files.includes(i.id) ? files.push(i.id) : files = [] : id === true && !folders.includes(i.id) ? folders.push(i.id) : folders = [];
            })
        } else if (kind !== null && kind === Kind.DDS_FILE) {
            !files.includes(id) ? files = [...files, id] : files = files.filter(f => f !== id);
            allItemsSelected ? mainStore.toggleAllItemsSelected(!allItemsSelected) : null;
        } else {
            !folders.includes(id) ? folders = [...folders, id] : folders = folders.filter(f => f !== id);
            allItemsSelected ? mainStore.toggleAllItemsSelected(!allItemsSelected) : null;
        }
        if(projectRole !== Roles.project_viewer && projectRole !== Roles.file_uploader) mainStore.handleBatch(files, folders);
    }

    checkForAllItemsSelected(e) {
        const allItemsSelected = mainStore.allItemsSelected;
        allItemsSelected ? mainStore.toggleAllItemsSelected(!allItemsSelected) : null;
        e.stopPropagation();
    }

    getCredentials(id) {
        agentStore.getAgentApiToken(id)
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

    toggleListStyle() {
        mainStore.toggleListView();
    }
}

const styles = {
    batchOpsWrapper: {
        marginBottom: 0,
    },
    icon: {
        marginLeft: -4,
        marginRight: 10,
        verticalAlign: -6,
    },
    linkColor: {
        color: Color.blue,
    },
    list: {
        float: 'right',
        padding: '14px 0px',
    },
    listStyleToggle: {
        margin: '0px 22px 0px',
        float: 'right',
        icon: {
            width: 36,
            height: 36,
        },
        iconRoot: {
            width: 36,
            height: 36,
            padding: 0,
        },
        tooltipHover: {
            zIndex: 9999,
        }
    },
    uploadFilesBtn: {
        fontWeight: 200,
        float: 'right',
        margin: '0px 0px 0px 18px',
    },
    columns: {
        header: {
            checkbox: {width: 5},
            lastUpdated: {fontSize: 14},
            projectRole: {width: 100, fontSize: 14},
            size: {width: 100, fontSize: 14},      
        },
        row: {
            checkbox: {width: 5},
            lastUpdated: {},
            projectRole: {width: 100},
            size: {width: 100},      
        },
    },
    table: {
        float: 'right',
        padding: 0,
        marginTop: 0,
    },
};

ListItems.propTypes = {
    agents: array,
    allItemsSelected: bool,
    filesChecked: array,
    foldersChecked: array,
    isSafari: bool,
    listItems: array,
    loading: bool,
    nextPage: number,
    projectRole: string,
    projectRoles: object,
    projects: array,
    screenSize: object,
    tableBodyRenderKey: number,
    totalItems: number,
    uploads: object,
};

export default ListItems;