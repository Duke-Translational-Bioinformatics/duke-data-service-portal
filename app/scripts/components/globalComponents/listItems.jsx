import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BaseUtils from '../../../util/baseUtils.js';
import {UrlGen, Path} from '../../../util/urlEnum';
import BatchOps from '../../components/globalComponents/batchOps.jsx';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import FileOptionsMenu from '../../components/fileComponents/fileOptionsMenu.jsx';
import FolderOptionsMenu from '../../components/folderComponents/folderOptionsMenu.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

class ListItems extends React.Component {

    render() {
        if(!this.props.showBatchOps) this.uncheck();
        let chkBx = <div className="item-media"></div>;
        let headers = this.props.responseHeaders && this.props.responseHeaders !== null ? this.props.responseHeaders : null;
        let nextPage = headers !== null && !!headers['x-next-page'] ? headers['x-next-page'][0] : null;
        let totalChildren = headers !== null && !!headers['x-total'] ? headers['x-total'][0] : null;
        let type = 'hidden';
        let newFolderModal = null;
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        if (prjPrm !== null) {
            newFolderModal = prjPrm === 'viewOnly' || prjPrm === 'flDownload' ? null : <AddFolderModal {...this.props}/>;
            if (prjPrm !== 'viewOnly' && prjPrm !== 'flUpload') {
                type = 'checkbox';
                chkBx = <div className="item-media">
                    <i className="icon icon-form-checkbox" style={styles.checkBox}></i>
                </div>
            }
        }
        let children = this.props.listItems ? this.props.listItems.map((children) => {
            let fileOptionsMenu = this.props.screenSize && this.props.screenSize.width >= 680 ? <FileOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(children.id, 'files')}/> : null;
            let folderOptionsMenu = this.props.screenSize && this.props.screenSize.width >= 680 ? <FolderOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity(children.id, 'folders')}/> : null;
            if (children.kind === 'dds-folder') {
                return (
                    <li key={ children.id } className="hover">
                        { prjPrm !== 'viewOnly' ?
                            <span style={styles.menuIcon}>
                                { folderOptionsMenu }
                            </span> : null}
                        <a href={UrlGen.routes.folder(children.id)}
                           className="item-content external">
                            <label className="label-checkbox item-content" style={styles.checkboxLabel}
                                   onClick={e => this.change()}>
                                <input className="folderChkBoxes" type="checkbox" name="chkboxName" value={children.id}
                                       ref={children.id}/>
                                { chkBx }
                            </label>
                            <div className="item-media">
                                <FontIcon className="material-icons" style={styles.icon}>folder</FontIcon>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800"
                                         style={styles.title}>{children.name.length > 82 ? children.name.substring(0, 82) + '...' : children.name}</div>
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
                            <label className="label-checkbox item-content" style={styles.checkboxLabel}
                                   onClick={e => this.change()}>
                                <input className="fileChkBoxes" type="checkbox" name="chkboxName" value={children.id}
                                       ref={children.id}/>
                                { chkBx }
                            </label>
                            <div className="item-media">
                                <FontIcon className="material-icons" style={styles.icon}>description</FontIcon>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800"
                                         style={styles.title}>{children.name.length > 82 ? children.name.substring(0, 82) + '...' : children.name}</div>
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
                    {!this.props.showBatchOps ? <div className="mdl-cell mdl-cell--12-col">
                        { newFolderModal }
                    </div> : null}
                    <div className="mdl-cell mdl-cell--12-col" style={styles.batchOpsWrapper}>
                        { this.props.showBatchOps ? <BatchOps {...this.props} {...this.state}/> : null }
                    </div>
                </div>
                { this.props.uploads || this.props.loading ? <Loaders {...this.props}/> : null }
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block list-block-search searchbar-found media-list">
                        <ul>
                            { children }
                        </ul>
                    </div>
                    {this.props.listItems.length < totalChildren && totalChildren > 25 ?
                        <div className="mdl-cell mdl-cell--12-col">
                            <RaisedButton
                                label={this.props.loading ? "Loading..." : "Load More"}
                                secondary={true}
                                disabled={this.props.loading ? true : false}
                                onTouchTap={()=>this.loadMore(nextPage)}
                                fullWidth={true}
                                style={this.props.loading ? {backgroundColor: '#69A3DD'} : {}}
                                labelStyle={this.props.loading ? {color: '#235F9C'} : {fontWeight: '100'}}/>
                        </div> : null}
                </div>
            </div>
        );
    }

    change() {
        // clicking on F7 input[checkbox] does not fire onChange in iOS or Android. Instead, set onClick to label
        // and wait for F7 to change the form before getting the form values. sheesh
        setTimeout(() => {
            this.handleChange()
        }, 100);
    }

    handleChange() {
        let checkedBoxes = document.querySelectorAll('input[name=chkboxName]:checked');
        let filesChecked = [];
        let foldersChecked = [];
        let fileInput = document.getElementsByClassName('fileChkBoxes');
        let folderInput = document.getElementsByClassName('folderChkBoxes');
        for (let i = 0; fileInput[i]; ++i) {
            if (fileInput[i].checked) filesChecked.push(fileInput[i].value);
        }
        for (let i = 0; folderInput[i]; ++i) {
            if (folderInput[i].checked) foldersChecked.push(folderInput[i].value);
        }
        ProjectActions.handleBatch(filesChecked, foldersChecked);
        if (!checkedBoxes.length) ProjectActions.showBatchOptions();
    }

    handleDownload(id) {
        let kind = Path.FILE;
        ProjectActions.getDownloadUrl(id, kind);
    }

    loadMore(page) {
        let id = this.props.params.id;
        let kind = this.props.entityObj ? Path.FOLDER : Path.PROJECT;
        ProjectActions.getChildren(id, kind, page);
    }

    setSelectedEntity(id, kind) {
        ProjectActions.setSelectedEntity(id, kind);
    }

    uncheck() {
        let files = this.props.filesChecked ? this.props.filesChecked : null;
        let folders = this.props.foldersChecked ? this.props.foldersChecked : null;
        if(folders !== null) {
            for (let i = 0; i < folders.length; i++) {
                if(!!this.refs[folders[i]]) this.refs[folders[i]].checked = false;
            }
        }
        if(files !== null) {
            for (let i = 0; i < files.length; i++) {
                if(!!this.refs[files[i]]) this.refs[files[i]].checked = false;
            }
        }
    }
}

ListItems.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    batchOpsWrapper: {
        marginBottom: 0
    },
    checkBox: {
        width: 16,
        height: 16
    },
    checkboxLabel: {
        borderRadius: 35,
        paddingRight: 20
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
