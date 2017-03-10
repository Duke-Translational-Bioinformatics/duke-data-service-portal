import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../../util/baseUtils.js';
import {UrlGen, Path, Kind} from '../../../util/urlEnum';
import BatchOps from '../../components/globalComponents/batchOps.jsx';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import FileOptionsMenu from '../../components/fileComponents/fileOptionsMenu.jsx';
import FolderOptionsMenu from '../../components/folderComponents/folderOptionsMenu.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

import Checkbox from 'material-ui/Checkbox';

@observer
class ListItems extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }

    render() {
        const {filesChecked, foldersChecked, listItems, loading, projPermissions, responseHeaders, screenSize, uploads} = mainStore;
        let showBatchOps = filesChecked.length || foldersChecked.length ? true : false;
        let headers = responseHeaders && responseHeaders !== null ? responseHeaders : null;
        let nextPage = headers !== null && !!headers['x-next-page'] ? headers['x-next-page'][0] : null;
        let totalChildren = headers !== null && !!headers['x-total'] ? headers['x-total'][0] : null;
        let newFolderModal = null;
        let showChecks = null;
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
        if (prjPrm !== null) {
            newFolderModal = prjPrm === 'viewOnly' || prjPrm === 'flDownload' ? null : <AddFolderModal {...this.props}/>;
            showChecks = !!(prjPrm !== 'viewOnly' && prjPrm !== 'flUpload');
        }
        let children = listItems && listItems.length ? listItems.map((children) => {
            let fileOptionsMenu = screenSize && screenSize.width >= 680 ? <FileOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(children.id, 'files')}/> : null;
            let folderOptionsMenu = screenSize && screenSize.width >= 680 ? <FolderOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(children.id, 'folders')}/> : null;
            if (children.kind === 'dds-folder') {
                return (
                    <li key={ children.id } className="hover">
                        {prjPrm !== 'viewOnly' ?
                            <span style={styles.menuIcon}>
                                { folderOptionsMenu }
                            </span> : null}
                        <a href={UrlGen.routes.folder(children.id)}
                           className="item-content external">
                            {showChecks ? <Checkbox  iconStyle={styles.checkIcon} style={screenSize.width > 580 ? {width: 48} : {width: 24}} onCheck={e => this.handleChange(children.id, Kind.DDS_FOLDER)}/> : null}
                            <div className="item-media">
                                <FontIcon className="material-icons" style={styles.icon}>folder</FontIcon>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800" style={styles.title}>{children.name.length > 82 ? children.name.substring(0, 82) + '...' : children.name}</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">Created by { children.audit.created_by.full_name }</div>
                                <div className="item-subtitle mdl-color-text--grey-600">{children.audit.last_updated_on !== null ? 'Last updated on '+BaseUtils.formatDate(children.audit.last_updated_on)+ ' by ': <br />}
                                    { children.audit.last_updated_by !== null ? children.audit.last_updated_by.full_name : null}</div>
                            </div>
                        </a>
                    </li>
                );
            } else {
                return (
                    <li key={ children.id } className="hover">
                        { prjPrm !== 'viewOnly' ?
                            <span style={styles.menuIcon}>
                                { fileOptionsMenu }
                            </span> : null }
                        <a href={UrlGen.routes.file(children.id)}
                           className="item-content external">
                            {showChecks ? <Checkbox iconStyle={styles.checkIcon} style={screenSize.width > 580 ? {width: 48} : {width: 24}} checked={mainStore.filesChecked.includes(children.id)} ref={children.id} onCheck={e => this.handleChange(children.id, Kind.DDS_FILE)}/> : null}
                            <div className="item-media">
                                <FontIcon className="material-icons" style={styles.icon}>description</FontIcon>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800" style={styles.title}>{children.name.length > 82 ? children.name.substring(0, 82) + '...' : children.name}</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">{BaseUtils.bytesToSize(children.current_version.upload.size)+' - '}version {children.current_version.version}</div>
                                <div className="item-subtitle mdl-color-text--grey-600">{children.audit.last_updated_on !== null ? 'Last updated on '+BaseUtils.formatDate(children.audit.last_updated_on)+ ' by ': <br />}
                                    { children.audit.last_updated_by !== null ? children.audit.last_updated_by.full_name : null}</div>
                            </div>
                        </a>
                    </li>
                );
            }
        }) : null;

        return (
            <div className="list-container" ref={(c) => this.listContainer = c}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    {!showBatchOps ? <div className="mdl-cell mdl-cell--12-col">
                        { newFolderModal }
                    </div> : null}
                    <div className="mdl-cell mdl-cell--12-col" style={styles.batchOpsWrapper}>
                        { showBatchOps ? <BatchOps {...this.props}/> : null }
                    </div>
                </div>
                { uploads || loading ? <Loaders {...this.props}/> : null }
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block list-block-search searchbar-found media-list">
                        <ul>
                            { children }
                        </ul>
                    </div>
                    {listItems.length < totalChildren && totalChildren > 25 ?
                        <div className="mdl-cell mdl-cell--12-col">
                            <RaisedButton
                                label={loading ? "Loading..." : "Load More"}
                                secondary={true}
                                disabled={loading ? true : false}
                                onTouchTap={()=>this.loadMore(nextPage)}
                                fullWidth={true}
                                style={loading ? {backgroundColor: '#69A3DD'} : {}}
                                labelStyle={loading ? {color: '#235F9C'} : {fontWeight: '100'}}/>
                        </div> : null}
                </div>
            </div>
        );
    }

    getSelectedItems(items, id) {
        if(items.includes(id)) {
            items = items.filter(val => val !== id);
        } else {
            items = [...items, id]
        }
        return items;
    }



    handleChange(id, kind) {
        let files = mainStore.filesChecked;
        let folders = mainStore.foldersChecked;
        if(kind === 'dds-file') {
            files = this.getSelectedItems(files, id);
        }
        if(kind === 'dds-folder') {
            folders = this.getSelectedItems(folders, id);
        }
        mainStore.handleBatch(files, folders);
    }

    handleDownload(id) {
        let kind = Path.FILE;
        mainStore.getDownloadUrl(id, kind);
    }

    loadMore(page) {
        let id = this.props.params.id;
        let kind = mainStore.entityObj ? Path.FOLDER : Path.PROJECT;
        mainStore.getChildren(id, kind, page);
    }

    setSelectedEntity(id, kind) {
        mainStore.setSelectedEntity(id, kind);
    }
}

ListItems.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    batchOpsWrapper: {
        marginBottom: 0
    },
    checkIcon: {
        width: 22,
        height: 22
    },
    menuIcon: {
        position: 'absolute',
        right: 0,
        top: 26,
        zIndex: 100
    },
    icon: {
        fontSize: 36,
        marginTop: 20,
        color: '#616161'
    },
    list: {
        float: 'right',
        marginTop: -10
    },
    title: {
        marginRight: 40
    }
};

ListItems.propTypes = {
    filesChecked: React.PropTypes.array,
    foldersChecked: React.PropTypes.array,
    entityObj: React.PropTypes.object,
    responseHeaders: React.PropTypes.object,
    loading: React.PropTypes.bool,
    uploading: React.PropTypes.bool,
    error: React.PropTypes.object
};

export default ListItems;
