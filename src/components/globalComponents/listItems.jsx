import React from 'react';
import PropTypes from 'prop-types';
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
import Loaders from '../../components/globalComponents/loaders.jsx';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton'
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
const { object, bool, array, string, number } = PropTypes;

@observer
class ListItems extends React.Component {

    render() {
        const { allItemsSelected, filesChecked, foldersChecked, isSafari, listItems, loading, nextPage, projectRole, screenSize, tableBodyRenderKey, totalItems, uploads } = mainStore;
        const { agents } = agentStore;
        const { currentUser } = authStore;
        const pathname = this.props.router.location.pathname;
        let items = pathname.includes('agents') ? agents.filter(a => a.audit.created_by.id === currentUser.id) : listItems;
        let showBatchOps = !!(filesChecked.length || foldersChecked.length);
        let menuWidth = pathname.includes('agents') ? 118 : screenSize.width > 1230 ? 35 : 28;
        let checkboxStyle = { maxWidth: 24, float: 'left', marginRight: isSafari ? 16 : 0 };
        let showUploadButton = projectRole !== null && (projectRole !== Roles.project_viewer && projectRole !== Roles.file_downloader);
        let showChecks = projectRole !== null && projectRole !== Roles.project_viewer && projectRole !== Roles.file_uploader && projectRole !== Roles.file_downloader;
        let children = items && items.length && !items.some(i => i.kind === Kind.DDS_PROJECT) ? items.map((child) => {
            let icon = child.kind === undefined ? 'laptop_mac' : child.kind === Kind.DDS_FOLDER ? 'folder' : 'description';
            let itemsChecked = child.kind === undefined ? null : child.kind === Kind.DDS_FOLDER ? foldersChecked : filesChecked;
            const route = child.kind === undefined ? UrlGen.routes.agent(child.id) : child.kind === Kind.DDS_FOLDER ? UrlGen.routes.folder(child.id) : UrlGen.routes.file(child.id);
            let fileOptionsMenu = <FileOptionsMenu {...this.props} clickHandler={() => this.setSelectedEntity(child.id, Path.FILE, true)}/>;
            let folderOptionsMenu = showChecks && <FolderOptionsMenu {...this.props} clickHandler={() => this.setSelectedEntity(child.id, Path.FOLDER, true)}/>;
            return (
                <TableRow key={child.id} selectable={false}>
                    <TableRowColumn>
                        {showChecks && child.kind !== undefined ? <Checkbox
                            style={checkboxStyle}
                            onCheck={() => this.check(child.id, child.kind)}
                            checked={itemsChecked.includes(child.id)}
                        /> : ''}
                        <a href={route} className="external" onClick={(e) => this.checkForAllItemsSelected(e)}>
                            <div style={styles.linkColor}>
                                <FontIcon className="material-icons" style={styles.icon}>{icon}</FontIcon>
                                {child.name.length > 82 ? child.name.substring(0, 82) + '...' : child.name}
                                {child.kind !== undefined && child.kind === Kind.DDS_FILE ? ' (version ' + child.current_version.version + ')' : ''}
                            </div>
                        </a>
                    </TableRowColumn>
                    {screenSize && screenSize.width >= 680 &&
                    <TableRowColumn onTouchTap={() => this.check(child.id, child.kind)}>
                        <span>{child.audit.last_updated_on !== null ? BaseUtils.formatDate(child.audit.last_updated_on) + ' by ' + child.audit.last_updated_by.full_name : BaseUtils.formatDate(child.audit.created_on) + ' by ' + child.audit.created_by.full_name}</span>
                    </TableRowColumn>}
                    {screenSize && screenSize.width >= 840 && child.kind !== undefined ?
                        <TableRowColumn onTouchTap={() => this.check(child.id, child.kind)} style={{width: 100}}>
                            {child.kind === Kind.DDS_FILE && child.current_version ? BaseUtils.bytesToSize(child.current_version.upload.size) : '---'}
                        </TableRowColumn> : null}
                    <TableRowColumn style={{textAlign: 'right', width: menuWidth}}>
                        <div onClick={(e) => e.stopPropagation()}>
                            {child.kind === undefined ? <FlatButton label="credentials" primary={true} onTouchTap={() => this.getCredentials(child.id)}/> : child.kind === Kind.DDS_FILE ? fileOptionsMenu : folderOptionsMenu }
                        </div>
                    </TableRowColumn>
                </TableRow>

            );
        }) : null;

        return (
            <div className="list-items-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    {!showBatchOps && !pathname.includes('agents')
                        ? <div className="mdl-cell mdl-cell--12-col">
                            { showUploadButton ? <RaisedButton
                                                    label="Upload Files"
                                                    labelPosition="before"
                                                    labelStyle={{color: Color.blue}}
                                                    style={styles.uploadFilesBtn}
                                                    icon={<FileUpload color={Color.pink} />}
                                                    onTouchTap={() => this.toggleUploadManager()}/> : null }
                            <AddFolderModal {...this.props}/>
                    </div> : null}
                    {showBatchOps && !pathname.includes('agents') ? <BatchOps {...this.props}/> : ''}
                </div>
                {uploads || loading ? <Loaders {...this.props}/> : null}
                {children && children.length ? <Paper className="mdl-cell mdl-cell--12-col" style={styles.list}>
                    {items.length > 0 && <Table fixedHeader={true}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>{showChecks && <Checkbox
                                    label="SELECT ALL"
                                    labelStyle={{fontSize: 14, color: Color.ltPink}}
                                    style={checkboxStyle}
                                    onCheck={()=> this.check(!allItemsSelected, null)}
                                    checked={allItemsSelected}
                                />}
                                </TableHeaderColumn>
                                {screenSize && screenSize.width >= 680 ? <TableHeaderColumn style={{fontSize: 14}}>LAST UPDATED</TableHeaderColumn> : null}
                                {screenSize && screenSize.width >= 840 && !pathname.includes('agents') ? <TableHeaderColumn style={{width: 100, fontSize: 14}}>SIZE</TableHeaderColumn> : null}
                                <TableHeaderColumn style={{textAlign: 'right', width: menuWidth}}></TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody key={tableBodyRenderKey} showRowHover={true} displayRowCheckbox={false} deselectOnClickaway={false}>
                            {children}
                        </TableBody>
                    </Table>}
                    {items.length < totalItems && totalItems > 25 && !pathname.includes('agents') &&
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
                </Paper> : null}
            </div>
        );
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
            if(allItemsSelected) mainStore.toggleAllItemsSelected(!allItemsSelected);
        } else {
            !folders.includes(id) ? folders = [...folders, id] : folders = folders.filter(f => f !== id);
            if(allItemsSelected) mainStore.toggleAllItemsSelected(!allItemsSelected);
        }
        if(projectRole !== Roles.project_viewer && projectRole !== Roles.file_uploader) mainStore.handleBatch(files, folders);
    }

    checkForAllItemsSelected(e) {
        const allItemsSelected = mainStore.allItemsSelected;
        if(allItemsSelected) mainStore.toggleAllItemsSelected(!allItemsSelected);
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
        marginTop: 0,
        padding: '8px 0px'
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