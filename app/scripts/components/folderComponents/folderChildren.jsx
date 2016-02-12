import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import FolderOptionsMenu from '../folderComponents/folderOptionsMenu.jsx';
import Header from '../../components/globalComponents/header.jsx';
import urlGen from '../../../util/urlGen.js';
import LinearProgress from 'material-ui/lib/linear-progress';
import Checkbox from 'material-ui/lib/checkbox';
import IconButton from 'material-ui/lib/icon-button';
import Badge from 'material-ui/lib/badge';
import FontIcon from 'material-ui/lib/font-icon';

class FolderChildren extends React.Component {

    constructor() {
        this.state = {
            numSelected: null
        }
    }

    render() {
        let uploading = null;
        if (this.props.uploads) {
            uploading = Object.keys(this.props.uploads).map(uploadId => {
                let upload = this.props.uploads[uploadId];
                return <div key={'pgrs'+uploadId}>
                    <LinearProgress mode="determinate" color={'#C2185B'} style={styles.uploader}
                                    value={upload.uploadProgress} max={100} min={0}/>

                    <div className="mdl-color-text--grey-600" style={styles.uploadText}>
                        {upload.uploadProgress.toFixed(2) + '% of ' + upload.name } uploaded...
                    </div>
                </div>;
            });
        }
        let loading = this.props.loading ?
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate loader"></div> : '';
        var error = '';
        if (this.props.error)
            error = (<h5 className='mdl-color-text--grey-600'>{this.props.error}</h5>);
        let folderChildren = this.props.children.map((children) => {
            if (children.kind === 'dds-folder') {
                return (
                    <li key={ children.id } className="hover">
                        <div style={styles.fillerDiv}>{/*temporary filler div until add dropdown menu*/}</div>
                        <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + "/folder/" + children.id}
                           className="item-content external">
                            <div className="item-media"><i className="material-icons"
                                                           style={styles.icon}>folder</i>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800" style={styles.title}>{ children.name }</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">ID: { children.id }</div>
                                <div className="item-after" style={styles.check}>
                                    <label className="label-checkbox item-content" style={styles.checkboxLabel}>
                                        <input className="folderChkBoxes" type="checkbox" name="chkboxName"
                                               value={children.id} onChange={this.handleChange.bind(this)}/>

                                        <div className="item-media"><i className="icon icon-form-checkbox"></i>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </a>
                    </li>
                );
            } else {
                return (
                    <li key={ children.id } className="hover">
                        <a className="mdl-button mdl-js-button mdl-button--icon external" style={styles.dlIcon}
                           onTouchTap={() => this.handleDownload(children.id)}>
                            <i className="material-icons">get_app</i>
                        </a>
                        <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + "/file/" + children.id}
                           className="item-content external">
                            <div className="item-media"><i className="material-icons"
                                                           style={styles.icon}>description</i>
                            </div>
                            <div className="item-inner" >
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800" style={styles.title}>{ children.name }</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">ID: { children.id }</div>
                                <div className="item-after"  style={styles.check}>
                                    <label className="label-checkbox item-content"  style={styles.checkboxLabel}>
                                        <input className="fileChkBoxes" type="checkbox" name="chkboxName"
                                               value={children.id} onChange={this.handleChange.bind(this)}/>

                                        <div className="item-media">
                                            <i className="icon icon-form-checkbox"></i>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </a>
                    </li>
                );
            }
        });

        return (
            <div className="list-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div>
                        <AddFolderModal {...this.props}/>
                        { this.props.showBatchOps ? <BatchOps {...this.props} {...this.state}/> : null }
                    </div>
                    { loading }
                    { uploading }
                </div>
                { error }
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block list-block-search searchbar-found media-list" style={styles.listBlock}>
                        <ul>
                            {folderChildren}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }


    handleChange() {
        let checked = null;
        let checkedBoxes = document.querySelectorAll('input[name=chkboxName]:checked');
        let filesChecked = [];
        let foldersChecked = [];
        let fileInput = document.getElementsByClassName('fileChkBoxes');
        let folderInput = document.getElementsByClassName('folderChkBoxes');
        for (let i = 0; fileInput[i]; ++i) {
            if (fileInput[i].checked) {
                filesChecked.push(fileInput[i].value);
            }
        }
        for (let i = 0; folderInput[i]; ++i) {
            if (folderInput[i].checked) {
                foldersChecked.push(folderInput[i].value);
            }
        }

        ProjectActions.batchDelete(filesChecked, foldersChecked);

        if (!checkedBoxes.length) ProjectActions.showBatchOptions();

        this.setState({
            numSelected: checkedBoxes.length
        });
    }

    handleDownload(id) {
        ProjectActions.getDownloadUrl(id);
    }
}

var BatchOps = React.createClass({
    render() {
        let files = this.props.filesChecked ? this.props.filesChecked : null;
        let folders = this.props.foldersChecked ? this.props.foldersChecked : null;
        return (
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800 project-container">
                <Badge
                    badgeContent={this.props.numSelected}
                    secondary={true}
                    badgeStyle={{top: 12, right: 12 }}
                    style={{float:'right'}}>
                    <IconButton tooltip="Delete Selected" onTouchTap={() => this.handleBatchDelete(files, folders)}>
                        <FontIcon className="material-icons" color={'#ef5350'}>delete</FontIcon>
                    </IconButton>
                </Badge>
            </div>
        )
    },
    handleBatchDelete(files, folders){
        let parentId = this.props.entityObj ? this.props.entityObj.id : null;
        let parentKind = 'dds-folder';
        for (let i = 0; i < files.length; i++) {
            ProjectActions.deleteFile(files[i], parentId, parentKind);
        }
        for (let i = 0; i < folders.length; i++) {
            ProjectActions.deleteFolder(folders[i], parentId, parentKind);
        }
    }
});


FolderChildren.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    batchOpsButtons: {
        float: 'right'
    },
    check: {
        float: 'right',
        marginTop: -60
    },
    checkboxLabel: {
        borderRadius: 25
    },
    dlIcon: {
        float: 'right',
        fontSize: 18,
        color: '#EC407A',
        marginTop: 6,
        marginLeft: 35,
        padding: '08px 08px 08px 08px'
    },
    fillerDiv: {
        height: 24,
        width:32,
        float: 'right',
        marginLeft: 51,
        padding: '08px 08px 08px 08px'
    },
    icon: {
        fontSize: 36
    },
    list: {
        paddingTop: 40
    },
    listBlock: {
        paddingTop: 16
    },
    title: {
        marginRight: 40
    },
    uploader: {
        width: '95%',
        margin: '0 auto'
    },
    uploadText: {
        textAlign: 'left',
        marginLeft: 31,
        fontSize: 13
    }
};

FolderChildren.propTypes = {
    loading: React.PropTypes.bool,
    children: React.PropTypes.array,
    error: React.PropTypes.string
};

export default FolderChildren;