import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BaseUtils from '../../../util/baseUtils.js';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import BatchOps from '../../components/globalComponents/batchOps.jsx';
import ErrorModal from '../../components/globalComponents/errorModal.jsx';
import FolderOptionsMenu from '../folderComponents/folderOptionsMenu.jsx';
import Header from '../../components/globalComponents/header.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import urlGen from '../../../util/urlGen.js';
import Badge from 'material-ui/lib/badge';
import LinearProgress from 'material-ui/lib/linear-progress';
import RaisedButton from 'material-ui/lib/raised-button';

class FolderChildren extends React.Component {

    constructor() {
        this.state = {
            page: 0
        }
    }

    render() {
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        let download = <div style={styles.fillerDiv}>{/*temporary filler div until add dropdown menu*/}</div>;
        let chkBx = <div className="item-media"></div>;
        let type = 'hidden';
        let newFolderModal = null;
        if (prjPrm !== null) {
            newFolderModal = prjPrm === 'viewOnly' || prjPrm === 'flDownload' ? null : <AddFolderModal {...this.props}/>;
            if (prjPrm !== 'viewOnly' && prjPrm !== 'flUpload') {
                type = 'checkbox';
                chkBx = <div className="item-media">
                    <i className="icon icon-form-checkbox" style={styles.checkBox}></i>
                </div>
            }
        }
        let children = [];
        if (this.props.error && this.props.error.response){
            this.props.error.response === 404 ? this.props.appRouter.transitionTo('/notFound') : null;
            this.props.error.response != 404 ? console.log(this.props.error.msg) : null;
        }
        if (this.props.children.length > 20) {
            switch (this.state.page) {
                case 0:
                    children = this.props.children.slice(0, 20);
                    break;
                case 1:
                    children = this.props.children.slice(0, 40);
                    break;
                case 2:
                    children = this.props.children.slice(0, 60);
                    break;
                case 3:
                    children = this.props.children;
                    break;
            }
        } else {
            children = this.props.children;
        }
        let folderChildren = children.map((children) => {
            if (children.kind === 'dds-folder') {
                return (
                    <li key={ children.id } className="hover">
                        <div style={styles.fillerDiv}>{/*temporary filler div until add dropdown menu*/}</div>
                        <a href={urlGen.routes.folder(children.id)}
                           className="item-content external">
                            <label className="label-checkbox item-content" style={styles.checkboxLabel} onClick={e => this.change()}>
                                <input className="folderChkBoxes" type={type} name="chkboxName"
                                       value={children.id} />
                                { chkBx }
                            </label>
                            <div className="item-media">
                                <i className="material-icons" style={styles.icon}>folder</i>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800"
                                         style={styles.title}>{children.name.length > 82 ? children.name.substring(0, 82) + '...' : children.name}</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">created by: { children.audit.created_by.full_name }</div>
                                <div className="item-subtitle mdl-color-text--grey-600">last updated: {children.audit.last_updated_on ? new Date(children.audit.last_updated_on).toString() : 'n/a'}</div>
                            </div>
                        </a>
                    </li>
                );
            } else {
                return (
                    <li key={ children.id } className="hover">
                        { prjPrm === 'viewOnly' || prjPrm === 'flUpload' ? <div style={styles.fillerDiv}></div> :
                            <a className="mdl-button mdl-js-button mdl-button--icon external" style={styles.dlIcon}
                               onTouchTap={() => this.handleDownload(children.id)}>
                                <i className="material-icons">get_app</i>
                            </a> }
                        <a href={urlGen.routes.file(children.id)}
                           className="item-content external">
                            <label className="label-checkbox item-content"  style={styles.checkboxLabel} onClick={e => this.change()}>
                                <input className="fileChkBoxes" type={type} name="chkboxName"
                                       value={children.id}/>
                                { chkBx }
                            </label>
                            <div className="item-media"><i className="material-icons"
                                                           style={styles.icon}>description</i>
                            </div>
                            <div className="item-inner" >
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800"
                                         style={styles.title}>{children.name.length > 82 ? children.name.substring(0, 82) + '...' : children.name}</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">version: {children.current_version.version}</div>
                                <div className="item-subtitle mdl-color-text--grey-600">size: {BaseUtils.bytesToSize(children.current_version.upload.size)}</div>
                            </div>
                        </a>
                    </li>
                );
            }
        });

        return (
            <div className="list-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    <div className="mdl-cell mdl-cell--12-col">
                        { newFolderModal }
                    </div>
                    <div className="mdl-cell mdl-cell--12-col" style={{marginBottom: -20}}>
                        { this.props.showBatchOps ? <BatchOps {...this.props} {...this.state}/> : null }
                    </div>
                    <ErrorModal {...this.props}/>
                </div>
                { this.props.uploads || this.props.loading ? <Loaders {...this.props}/> : null }
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block list-block-search searchbar-found media-list">
                        <ul>
                            {folderChildren}
                        </ul>
                    </div>
                    {this.props.children.length > 25 && this.props.children.length > children.length && this.state.page < 3 ?
                        <div className="mdl-cell mdl-cell--12-col">
                            <RaisedButton
                                label="Load More"
                                secondary={true}
                                onTouchTap={this.loadMore.bind(this)}
                                fullWidth={true}
                                labelStyle={{fontWeight: '100'}}/>
                        </div> : null}
                </div>
            </div>
        );
    }

    change() {
        // clicking on F7 input[checkbox] does not fire onChange in iOS or Android. Instead, set onClick to label
        // and wait for F7 to change the form or checkbox before getting the values. sheesh
        setTimeout( () => {
            this.handleChange()
        }, 100);
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
        ProjectActions.handleBatch(filesChecked, foldersChecked);
        if (!checkedBoxes.length) ProjectActions.showBatchOptions();
    }

    handleDownload(id) {
        let kind = 'files/';
        ProjectActions.getDownloadUrl(id, kind);
    }

    loadMore() {
        this.setState({page: this.state.page + 1});
    }
}

FolderChildren.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    checkBox: {
        width: 16,
        height: 16
    },
    checkboxLabel: {
        borderRadius: 35,
        paddingRight: 20
    },
    dlIcon: {
        float: 'right',
        fontSize: 18,
        color: '#EC407A',
        marginTop: 28,
        marginLeft: 15,
        padding: '08px 08px 08px 08px',
        zIndex: 100
    },
    fillerDiv: {
        height: 24,
        width: 32,
        float: 'right',
        marginLeft: 32,
        padding: '08px 08px 08px 08px'
    },
    icon: {
        fontSize: 36,
        marginTop: 20
    },
    list: {
        float:'right',
        marginTop: -10
    },
    title: {
        marginRight: 40
    }
};

FolderChildren.propTypes = {
    loading: React.PropTypes.bool,
    children: React.PropTypes.array,
    error: React.PropTypes.object
};

export default FolderChildren;