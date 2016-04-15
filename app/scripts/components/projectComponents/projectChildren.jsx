import React from 'react';
import { RouteHandler, Link } from 'react-router';
import MainActions from '../../actions/mainActions';
import ProjectDetails from './projectDetails.jsx';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BatchOps from '../../components/globalComponents/batchOps.jsx';
import ErrorModal from '../../components/globalComponents/errorModal.jsx';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import FolderOptionsMenu from '../folderComponents/folderOptionsMenu.jsx';
import Header from '../../components/globalComponents/header.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import urlGen from '../../../util/urlGen.js';
import Card from 'material-ui/lib/card';
import LinearProgress from 'material-ui/lib/linear-progress';
import RaisedButton from 'material-ui/lib/raised-button';

class ProjectChildren extends React.Component {

    constructor() {
        this.state = {
            page: 0
        }
    }

    render() {
        let children = [];
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        let download = <div style={styles.fillerDiv}>{/*temporary filler div until add dropdown menu*/}</div>;
        let chkBx = <div className="item-media"></div>;
        let type = 'hidden';
        let newFolderModal = null;
        if (prjPrm !== null) {
            download = prjPrm === 'viewOnly' || prjPrm === 'flUpload' ? <div style={styles.fillerDiv}></div> :
                <a className="mdl-button mdl-js-button mdl-button--icon external" style={styles.dlIcon}
                   onTouchTap={() => this.handleDownload(children.id)}>
                    <i className="material-icons">get_app</i>
                </a>;
            newFolderModal = prjPrm === 'viewOnly' || prjPrm === 'flDownload' ? null : <AddFolderModal {...this.props}/>;
            if (prjPrm !== 'viewOnly' && prjPrm !== 'flUpload') {
                type = 'checkbox';
                chkBx = <div className="item-media">
                    <i className="icon icon-form-checkbox" style={styles.checkBox}></i>
                </div>
            }
        }
        if (this.props.error && this.props.error.response) {
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
        let projectChildren = children.map((children) => {
            if (children.kind === 'dds-folder') {
                return (
                    <li key={ children.id } className="hover">
                        <div style={styles.fillerDiv}>{/*temporary filler div until add dropdown menu*/}</div>
                        <a href={urlGen.routes.folder(children.id)}
                           className="item-content external">
                            <label className="label-checkbox item-content" style={styles.checkboxLabel}
                                   onClick={e => this.change()}>
                                <input className="folderChkBoxes" type={type} name="chkboxName" value={children.id}
                                       id={children.id}/>
                                { chkBx }
                            </label>

                            <div className="item-media">
                                <i className="material-icons" style={styles.icon}>folder</i>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800"
                                         style={styles.title}>{ children.name }</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">ID: { children.id }</div>
                                <div className="item-after" style={styles.check}>

                                </div>
                            </div>
                        </a>
                    </li>
                );
            } else {
                return (
                    <li key={ children.id } className="hover">
                        { download }
                        <a href={urlGen.routes.file(children.id)}
                           className="item-content external">
                            <label className="label-checkbox item-content" style={styles.checkboxLabel}
                                   onClick={e => this.change()}>
                                <input className="fileChkBoxes" type={type} name="chkboxName" value={children.id}
                                       id={children.id}/>
                                { chkBx }
                            </label>

                            <div className="item-media">
                                <i className="material-icons" style={styles.icon}>description</i>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800"
                                         style={styles.title}>{children.name.length > 22 ? children.name.substring(0, 22) + '...' : children.name}</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">ID: {children.id}</div>
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
                            {projectChildren}
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
        // and wait for F7 to change the form before getting the form values. sheesh
        setTimeout(() => {
            this.handleChange()
        }, 100);
    }

    handleChange() {
        let checked = null;
        // See if checkboxes are selected
        let checkedBoxes = document.querySelectorAll('input[name=chkboxName]:checked');
        let filesChecked = [];
        let foldersChecked = [];
        // Create arrays of checked boxes
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
        // Process files/folders
        ProjectActions.handleBatch(filesChecked, foldersChecked);
        // If nothing is selected, change state and hide options
        if (!checkedBoxes.length) ProjectActions.showBatchOptions();
    }

    handleDownload(id) {
        ProjectActions.getDownloadUrl(id);
    }

    loadMore() {
        this.setState({page: this.state.page + 1});
    }
}

ProjectChildren.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    checkBox: {
        width: 16,
        height: 16,
        marginBottom: 21
    },
    checkboxLabel: {
        borderRadius: 35,
        paddingRight: 20
    },
    dlIcon: {
        float: 'right',
        fontSize: 18,
        color: '#EC407A',
        marginTop: 6,
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
        marginTop: 4

    },
    list: {
        float: 'right',
        marginTop: -10
    },
    title: {
        marginRight: 40
    }
};

ProjectChildren.propTypes = {
    loading: React.PropTypes.bool,
    uploading: React.PropTypes.bool,
    error: React.PropTypes.object
};

export default ProjectChildren;