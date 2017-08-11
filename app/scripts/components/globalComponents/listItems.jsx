import React, { PropTypes } from 'react';
const { object, bool, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import { UrlGen, Path, Kind } from '../../util/urlEnum';
import { Color } from '../../theme/customTheme';
import BatchOps from '../../components/globalComponents/batchOps.jsx';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import FileOptionsMenu from '../../components/fileComponents/fileOptionsMenu.jsx';
import FolderOptionsMenu from '../../components/folderComponents/folderOptionsMenu.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import Checkbox from 'material-ui/Checkbox';
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

@observer
class ListItems extends React.Component {

    render() {
        const { allItemsSelected, filesChecked, foldersChecked, listItems, loading, projPermissions, responseHeaders, screenSize, tableBodyRenderKey, uploads } = mainStore;
        let showBatchOps = !!(filesChecked.length || foldersChecked.length);
        let menuWidth = screenSize.width > 1230 ? 35 : 28;
        let headers = responseHeaders && responseHeaders !== null ? responseHeaders : null;
        let nextPage = headers !== null && !!headers['x-next-page'] ? headers['x-next-page'][0] : null;
        let totalChildren = headers !== null && !!headers['x-total'] ? headers['x-total'][0] : null;
        let newFolderModal = null;
        let uploadManager = null;
        let showChecks = null;
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
        if (prjPrm !== null) {
            newFolderModal = prjPrm === 'viewOnly' || prjPrm === 'flDownload' ? null : <AddFolderModal {...this.props}/>;
            uploadManager = prjPrm === 'viewOnly' || prjPrm === 'flDownload' ? null : <RaisedButton label="Upload Files"
                                                                                                    labelPosition="before"
                                                                                                    labelStyle={{color: Color.blue}}
                                                                                                    style={styles.uploadFilesBtn}
                                                                                                    icon={<FileUpload color={Color.pink} />}
                                                                                                    onTouchTap={() => this.toggleUploadManager()}/>;
            showChecks = (prjPrm !== 'viewOnly' && prjPrm !== 'flUpload');
        }
        let children = listItems && listItems.length ? listItems.map((children) => {
            let fileOptionsMenu = showChecks && <FileOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(children.id, Path.FILE, true)}/>;
            let folderOptionsMenu = showChecks && <FolderOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(children.id, Path.FOLDER, true)}/>;
            if (children.kind === 'dds-folder') {
                return (
                    <TableRow key={children.id} selectable={false}>
                        <TableRowColumn onTouchTap={()=>this.check(children.id, children.kind)}>
                            {showChecks && <Checkbox
                                style={styles.checkbox}
                                checked={mainStore.foldersChecked.includes(children.id)}
                            />}
                            <a onClick={(e) => {e.stopPropagation()}} href={UrlGen.routes.folder(children.id)} className="external">
                                <span style={{color: Color.blue}}>
                                    <FontIcon className="material-icons" style={styles.icon}>folder</FontIcon>
                                    {children.name.length > 82 ? children.name.substring(0, 82) + '...' : children.name}
                                </span>
                            </a>
                        </TableRowColumn>
                        {screenSize && screenSize.width >= 680 && <TableRowColumn onTouchTap={()=>this.check(children.id, children.kind)}>
                            <span>{children.audit.last_updated_on !== null ? BaseUtils.formatDate(children.audit.last_updated_on)+' by '+children.audit.last_updated_by.full_name : BaseUtils.formatDate(children.audit.created_on)+' by '+children.audit.created_by.full_name}</span>
                        </TableRowColumn>}
                        {screenSize && screenSize.width >= 840 && <TableRowColumn onTouchTap={()=>this.check(children.id, children.kind)} style={{width: 100}}>
                            {'---'}
                        </TableRowColumn>}
                        <TableRowColumn style={{textAlign: 'right', width: menuWidth}}>
                            <div onClick={(e) => {e.stopPropagation()}}>
                                { folderOptionsMenu }
                            </div>
                        </TableRowColumn>
                    </TableRow>

                );
            } else {
                return (
                    <TableRow key={children.id} selectable={false}>
                        <TableRowColumn onTouchTap={()=>this.check(children.id, children.kind)}>
                            {showChecks && <Checkbox
                                style={styles.checkbox}
                                checked={mainStore.filesChecked.includes(children.id)}
                            />}
                            <a onClick={(e) => {e.stopPropagation()}} href={UrlGen.routes.file(children.id)} className="external">
                                <span style={{color: Color.blue}}>
                                    <FontIcon className="material-icons" style={styles.icon}>description</FontIcon>
                                    {children.name.length > 82 ? children.name.substring(0, 82) + '...' : children.name+' '}
                                    {' (version '+ children.current_version.version+')'}
                                </span>
                            </a>
                        </TableRowColumn>
                        {screenSize && screenSize.width >= 680 && <TableRowColumn onTouchTap={()=>this.check(children.id, children.kind)}>
                            {children.audit.last_updated_on !== null ? BaseUtils.formatDate(children.audit.last_updated_on)+' by '+children.audit.last_updated_by.full_name : BaseUtils.formatDate(children.audit.created_on)+' by '+children.audit.created_by.full_name}
                        </TableRowColumn>}
                        {screenSize && screenSize.width >= 840 && <TableRowColumn onTouchTap={()=>this.check(children.id, children.kind)} style={{width: 100}}>
                            {children.current_version ? BaseUtils.bytesToSize(children.current_version.upload.size) : '---'}
                        </TableRowColumn>}
                        <TableRowColumn style={{textAlign: 'right', width: menuWidth}}>
                            <div onClick={(e) => {e.stopPropagation()}}>
                                { fileOptionsMenu }
                            </div>
                        </TableRowColumn>
                    </TableRow>
                );
            }
        }) : null;

        return (
            <div className="list-items-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    {!showBatchOps && <div className="mdl-cell mdl-cell--12-col">
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
                                <TableHeaderColumn>{showChecks && <Checkbox
                                    style={styles.checkbox}
                                    onCheck={()=> this.check(!allItemsSelected, null)}
                                    checked={allItemsSelected}
                                />}
                                </TableHeaderColumn>
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
            </div>
        );
    }

    check(id, kind) {
        let files = mainStore.filesChecked;
        let folders = mainStore.foldersChecked;
        let allItemsSelected = mainStore.allItemsSelected;
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
        mainStore.handleBatch(files, folders);
    }

    loadMore(page) {
        let id = this.props.params.id;
        let kind = this.props.router.location.pathname.includes('project') ? Path.PROJECT : Path.FOLDER;
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

ListItems.contextTypes = {
    muiTheme: React.PropTypes.object
};

const styles = {
    batchOpsWrapper: {
        marginBottom: 0
    },
    checkbox: {
        maxWidth: 24,
        float: 'left'
    },
    icon: {
        marginLeft: -4,
        marginRight: 10,
        verticalAlign: -6
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

export default ListItems;