import React from 'react';
import PropTypes from 'prop-types';
const { object, bool, array, string, number } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import agentStore from '../../stores/agentStore';
import authStore from '../../stores/authStore';
import BaseUtils from '../../util/baseUtils.js';
import { UrlGen, Path, Kind } from '../../util/urlEnum';
import { Roles } from '../../enum';
import { Color } from '../../theme/customTheme';
import BatchOps from '../../components/globalComponents/batchOps.jsx';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import FileOptionsMenu from '../../components/fileComponents/fileOptionsMenu.jsx';
import FolderOptionsMenu from '../../components/folderComponents/folderOptionsMenu.jsx';
import ProjectOptionsMenu from '../../components/projectComponents/projectOptionsMenu.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton'
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

@observer
class ListItems extends React.Component {

    render() {
        const {
            allItemsSelected, filesChecked, foldersChecked, isSafari, listItems,
            loading, nextPage, projectRole, screenSize, tableBodyRenderKey,
            totalItems, uploads
        } = mainStore;
        const { agents } = agentStore;
        const { currentUser } = authStore;
        let items = this.props.router && this.props.router.location.pathname.includes('agents') ? agents.filter(a => a.audit.created_by.id === currentUser.id) : listItems;
        let showBatchOps = !!(filesChecked.length || foldersChecked.length);
        let menuWidth = this.props.router.location.pathname.includes('agents') ? 118 : screenSize.width > 1230 ? 35 : 28;
        let componentName = this.props.router.routes[1]['component']['name'];
        let checkboxStyle = { maxWidth: 24, float: 'left', marginRight: isSafari ? 16 : 0 };
        let showUploadButton = projectRole !== null && (projectRole !== Roles.project_viewer && projectRole !== Roles.file_downloader);
        let showChecks = projectRole !== null && projectRole !== Roles.project_viewer && projectRole !== Roles.file_uploader && projectRole !== Roles.file_downloader;
        let children = items && items.length ? items.map((child) => {
            if(!child.is_deleted) {
                let itemsChecked = child.kind === undefined ? null : child.kind === Kind.DDS_FOLDER ? foldersChecked : filesChecked;
                let route = this.listItemRoute(child, componentName)
                return (
                    <TableRow key={child.id} selectable={false}>
                        {this.tableRowColumnCheckBox(child, showChecks, checkboxStyle, itemsChecked)}
                        {this.tableRowColumnName(child, route)}
                        {this.tableRowColumnLastUpdated(child, route, screenSize)}
                        {this.tableRowColumnSize(child, screenSize)}
                        {this.tableRowColumnMenu(child, menuWidth)}
                    </TableRow>
                );
            }
        }) : null;

        return (
            <div className="list-items-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    {!showBatchOps && <div className="mdl-cell mdl-cell--12-col">
                        { showUploadButton ? <RaisedButton
                                                label="Upload Files"
                                                labelPosition="before"
                                                labelStyle={{color: Color.blue}}
                                                style={styles.uploadFilesBtn}
                                                icon={<FileUpload color={Color.pink} />}
                                                onTouchTap={() => this.toggleUploadManager()}/> : null }
                        <AddFolderModal {...this.props}/>
                    </div>}
                    {showBatchOps && !this.props.router.location.pathname.includes('agents') ? <BatchOps {...this.props}/> : ''}
                </div>
                {uploads || loading ? <Loaders {...this.props}/> : null}
                <Paper className="mdl-cell mdl-cell--12-col" style={styles.list}>
                    {items.length > 0 && <Table fixedHeader={true}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                {this.tableHeaderColumnCheckBox(showChecks, checkboxStyle, allItemsSelected)}
                                {this.tableHeaderColumnName()}
                                {this.tableHeaderColumnLastUpdated(screenSize)}
                                {this.tableHeaderColumnSize(screenSize)}
                                {this.tableHeaderColumnMenu(menuWidth)}
                            </TableRow>
                        </TableHeader>
                        <TableBody key={tableBodyRenderKey} showRowHover={true} displayRowCheckbox={false} deselectOnClickaway={false}>
                            {children}
                        </TableBody>
                    </Table>}
                    {items.length < totalItems && totalItems > 25 && !this.props.router.location.pathname.includes('agents') &&
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
            </div>
        );
    }

    // tableHeaders
    tableHeaderColumnCheckBox(showChecks, checkboxStyle, allItemsSelected) {
        if (this.props.router.location.pathname !== '/dashboard' ) {
            return (
                <TableHeaderColumn style={styles.checkbox}>{showChecks && <Checkbox
                    label="SELECT ALL"
                    labelStyle={{fontSize: 14, color: Color.ltPink}}
                    style={checkboxStyle}
                    onCheck={()=> this.check(!allItemsSelected, null)}
                    checked={allItemsSelected}
                />}
                </TableHeaderColumn>
            )  
        }
    }
    tableHeaderColumnName() {
        return <TableHeaderColumn/>;
    }
    tableHeaderColumnLastUpdated(screenSize) {
        if (screenSize && screenSize.width >= 680) {
            return (
                <TableHeaderColumn style={{fontSize: 14}}>
                    LAST UPDATED
                </TableHeaderColumn>
            )
        }
    }
    tableHeaderColumnSize(screenSize) {
        if (screenSize && screenSize.width >= 840 && !this.props.router.location.pathname.includes('agents')) {
            return (
                <TableHeaderColumn style={{width: 100, fontSize: 14}}>
                    SIZE
                </TableHeaderColumn>
            )
        }
    }
    tableHeaderColumnMenu(menuWidth) {
        return (
            <TableHeaderColumn style={{textAlign: 'right', width: menuWidth}}></TableHeaderColumn>            
        )
    }

    // tableRows
    tableRowColumnCheckBox(child, showChecks, checkboxStyle, itemsChecked) {
        if (child.kind !== Kind.DDS_PROJECT) {
            return (
                <TableRowColumn style={styles.checkbox}>
                    {showChecks && child.kind !== undefined ? <Checkbox
                        style={checkboxStyle}
                        onCheck={() => this.check(child.id, child.kind)}
                        checked={itemsChecked.includes(child.id)}
                    /> : ''}
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
    tableRowColumnLastUpdated(child, route, screenSize) {
        if (screenSize && screenSize.width >= 680) {
            let info = this.updatedOrCreatedInfo(child.audit)
            if (child.kind === Kind.DDS_PROJECT) {
                info = <a href={route} className="external" onClick={(e) => this.checkForAllItemsSelected(e)}>
                    {info}
                </a>
            }
            return (
                <TableRowColumn onTouchTap={()=>this.check(child.id, child.kind)}>
                    {info}
                </TableRowColumn>
            )
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

            return (
                <TableRowColumn onTouchTap={() => this.check(child.id, child.kind)} style={{width: 100}}>
                    {sizeInfo}
                </TableRowColumn>
            )
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
  
    // HelperFunctions
    listItemRoute(child, componentName) {
        if (componentName == 'Dashboard') {
            if (child.kind === Kind.DDS_PROJECT) {
                return UrlGen.routes.dashboardProject(child.id);
            } else if (child.kind === Kind.DDS_FOLDER) {
                return UrlGen.routes.dashboardFolder(child.id);
            }
        } else {
            if (child.kind === undefined) {
                return UrlGen.routes.agent(child.id);
            } else if (child.kind === Kind.DDS_FOLDER) {
                return UrlGen.routes.folder(child.id);
            } else {
                return UrlGen.routes.file(child.id);
            }
        };
    }

    iconPicker(kind) {
        let iconKind = ''
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
                iconKind = 'laptop_mac'
        }
        return (
            <FontIcon className="material-icons" style={styles.icon}>
                {iconKind}
            </FontIcon>
        )
    }

    updatedOrCreatedInfo(audit) {
        let updatedInfo = {'date': audit.created_on, 'name': audit.created_by.full_name}
        if (audit.last_updated_on !== null && audit.last_updated_by !== null) {
            updatedInfo.date = audit.last_updated_on
            updatedInfo.name = audit.last_updated_by.full_name
        }
        return `${BaseUtils.formatDate(updatedInfo.date)} by ${updatedInfo.name}`;
    }

    check(id, kind) {
        let files = mainStore.filesChecked;
        let folders = mainStore.foldersChecked;
        let { allItemsSelected, projectRole } = mainStore;
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
}

const styles = {
    batchOpsWrapper: {
        marginBottom: 0
    },
    checkbox: {
        width: 5
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
    }
};

ListItems.propTypes = {
    agents: array,
    allItemsSelected: bool,
    filesChecked: array,
    foldersChecked: array,
    listItems: array,
    entityObj: object,
    isSafari: bool,
    nextPage: number,
    projectRole: string,
    responseHeaders: object,
    screenSize: object,
    tableBodyRenderKey: number,
    totalItems: number,
    uploads: object,
    loading: bool
};

export default ListItems;