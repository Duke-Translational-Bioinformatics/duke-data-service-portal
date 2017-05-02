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
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import FileUpload from 'material-ui/svg-icons/file/file-upload'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

@observer
class ListItems extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.rows !== this.state.rows) {
            let files = [];
            let folders = [];
            if (this.state.rows !== 'all' && this.state.rows !== 'none' && this.state.rows.length) {
                for (let i = 0; i < this.state.rows.length; i++) {
                    if (mainStore.listItems[this.state.rows[i]].kind === Kind.DDS_FILE && !BaseUtils.objectPropInArray(files, 'id', mainStore.listItems[this.state.rows[i]].id)) {
                        files = [...files, mainStore.listItems[this.state.rows[i]].id]
                    } else {
                        if(!BaseUtils.objectPropInArray(folders, 'id', mainStore.listItems[this.state.rows[i]].id)) folders = [...folders, mainStore.listItems[this.state.rows[i]].id]
                    }
                }
            }
            if(this.state.rows === 'all') mainStore.listItems.map((obj)=> {obj.kind === Kind.DDS_FILE ? files = [...files, obj.id] : folders = [...folders, obj.id]})
            if(this.state.rows === 'none') { files = []; folders = []; }
            mainStore.handleBatch(files, folders);
        }
    }

    render() {
        const { filesChecked, foldersChecked, listItems, loading, projPermissions, responseHeaders, screenSize, tableBodyRenderKey, uploads } = mainStore;
        let showBatchOps = filesChecked.length || foldersChecked.length ? true : false;
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
            showChecks = !!(prjPrm !== 'viewOnly' && prjPrm !== 'flUpload');
        }
        let children = listItems && listItems.length ? listItems.map((children) => {
            let fileOptionsMenu = <FileOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(children.id, Path.FILE)}/>;
            let folderOptionsMenu = <FolderOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(children.id, Path.FOLDER)}/>;
            if (children.kind === 'dds-folder') {
                return (
                    <TableRow key={children.id} selected={mainStore.foldersChecked.includes(children.id)}>
                        <TableRowColumn>
                            <a onClick={(e)=>this.goTo(e, children.id, children.kind)} href={UrlGen.routes.folder(children.id)} className="external">
                                <div style={{color: Color.blue}}>
                                    <FontIcon className="material-icons" style={styles.icon}>folder</FontIcon>
                                    {children.name.length > 82 ? children.name.substring(0, 82) + '...' : children.name}
                                </div>
                            </a>
                        </TableRowColumn>
                        {screenSize && screenSize.width >= 680 ? <TableRowColumn>
                            {children.audit.last_updated_on !== null ? BaseUtils.formatDate(children.audit.last_updated_on)+' by '+children.audit.last_updated_by.full_name : BaseUtils.formatDate(children.audit.created_on)+' by '+children.audit.created_by.full_name}
                        </TableRowColumn> : null}
                        {screenSize && screenSize.width >= 840 ? <TableRowColumn style={{width: 100}}>
                            {'---'}
                        </TableRowColumn> : null}
                        <TableRowColumn style={{textAlign: 'right', width: menuWidth}}>
                            <div onClick={(e) => {e.stopPropagation()}}>
                                { folderOptionsMenu }
                            </div>
                        </TableRowColumn>
                    </TableRow>

                );
            } else {
                return (
                    <TableRow key={children.id} selected={mainStore.filesChecked.includes(children.id)}>
                        <TableRowColumn>
                            <a onClick={(e)=>this.goTo(e, children.id, children.kind)} href={UrlGen.routes.file(children.id)} className="external">
                                <div style={{color: Color.blue}}>
                                    <FontIcon className="material-icons" style={styles.icon}>description</FontIcon>
                                    {children.name.length > 82 ? children.name.substring(0, 82) + '...' : children.name+' '}
                                    {' (version '+ children.current_version.version+')'}
                                </div>
                            </a>
                        </TableRowColumn>
                        {screenSize && screenSize.width >= 680 ? <TableRowColumn>
                            {children.audit.last_updated_on !== null ? BaseUtils.formatDate(children.audit.last_updated_on)+' by '+children.audit.last_updated_by.full_name : BaseUtils.formatDate(children.audit.created_on)+' by '+children.audit.created_by.full_name}
                        </TableRowColumn> : null}
                        {screenSize && screenSize.width >= 840 ? <TableRowColumn style={{width: 100}}>
                            {children.current_version ? BaseUtils.bytesToSize(children.current_version.upload.size) : '---'}
                        </TableRowColumn> : null}
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
            <div className="list-items-container" ref={(c) => this.listContainer = c}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    {!showBatchOps ? <div className="mdl-cell mdl-cell--12-col">
                        { uploadManager }
                        { newFolderModal }
                    </div> : null}
                    { showBatchOps ? <BatchOps {...this.props}/> : null }
                </div>
                { uploads || loading ? <Loaders {...this.props}/> : null }
                <Paper className="mdl-cell mdl-cell--12-col" style={styles.list}>
                    {listItems.length ? <Table multiSelectable={true} fixedHeader={true} onRowSelection={(rows) => this.selectTableRow(rows)}>
                        <TableHeader displaySelectAll={showChecks} adjustForCheckbox={showChecks}>
                            <TableRow>
                                <TableHeaderColumn></TableHeaderColumn>
                                {screenSize && screenSize.width >= 680 ? <TableHeaderColumn>Last Updated</TableHeaderColumn> : null}
                                {screenSize && screenSize.width >= 840 ? <TableHeaderColumn style={{width: 100}}>Size</TableHeaderColumn> : null}
                                <TableHeaderColumn style={{textAlign: 'right', width: menuWidth}}></TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody key={tableBodyRenderKey} showRowHover={true} displayRowCheckbox={showChecks} deselectOnClickaway={false}>
                            {children}
                        </TableBody>
                    </Table> : null}
                    {listItems.length < totalChildren && totalChildren > 25 ?
                        <div className="mdl-cell mdl-cell--12-col">
                            <RaisedButton
                                label={loading ? "Loading..." : "Load More"}
                                secondary={true}
                                disabled={loading ? true : false}
                                onTouchTap={()=>this.loadMore(nextPage)}
                                fullWidth={true}
                                style={loading ? {backgroundColor: Color.ltBlue2} : {}}
                                labelStyle={loading ? {color: Color.blue} : {fontWeight: '100'}}/>
                        </div> : null}
                </Paper>
            </div>
        );
    }

    goTo(e, id, path) {
        e.stopPropagation()
        let route = path === Kind.DDS_FILE ? Path.FILE : Path.FOLDER;
        this.props.router.push(route+id);
    }

    selectTableRow(rows) {
        // Local state is used here to fix a bug that exists in the Material-UI data table component. This bug
        // is slated to be fixed on the 'next' MUI branch (>0.17). See issue here
        // Once fixed this setState call can be removed and the logic from componentDidUpdate can be moved to this method.
        this.setState((prevState) => ({ rows: prevState.rows === 'all' && rows !== 'all' ? 'none' : rows }))
    }

    loadMore(page) {
        let id = this.props.params.id;
        let kind = this.props.router.location.pathname.includes('project') ? Path.PROJECT : Path.FOLDER;
        mainStore.getChildren(id, kind, page);
    }

    setSelectedEntity(id, path) {
        mainStore.setSelectedEntity(id, path);
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
        margin: '0px -8px 0px  18px'
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
