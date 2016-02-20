import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import DeleteConfirmation from '../../components/globalComponents/deleteConfirmation.jsx';
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
            numSelected: null
        }
    }

    render() {
        if (this.props.error && this.props.error.response){
            this.props.error.response === 404 ? this.props.appRouter.transitionTo('/notFound') : null;
            this.props.error.response != 404 ? console.log(this.props.error.msg) : null;
        }
        let folderChildren = this.props.children.map((children) => {
            if (children.kind === 'dds-folder') {
                return (
                    <li key={ children.id } className="hover">
                        <div style={styles.fillerDiv}>{/*temporary filler div until add dropdown menu*/}</div>
                        <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + "/folder/" + children.id}
                           className="item-content external">
                            <label className="label-checkbox item-content" style={styles.checkboxLabel} onClick={e => this.change()}>
                                <input className="folderChkBoxes" type="checkbox" name="chkboxName"
                                       value={children.id} />
                                <div className="item-media"><i className="icon icon-form-checkbox" style={styles.checkBox}></i>
                                </div>
                            </label>
                            <div className="item-media"><i className="material-icons"
                                                           style={styles.icon}>folder</i>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800" style={styles.title}>{ children.name }</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">ID: { children.id }</div>
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
                            <label className="label-checkbox item-content"  style={styles.checkboxLabel} onClick={e => this.change()}>
                                <input className="fileChkBoxes" type="checkbox" name="chkboxName"
                                       value={children.id}/>
                                <div className="item-media">
                                    <i className="icon icon-form-checkbox" style={styles.checkBox}></i>
                                </div>
                            </label>
                            <div className="item-media"><i className="material-icons"
                                                           style={styles.icon}>description</i>
                            </div>
                            <div className="item-inner" >
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800" style={styles.title}>{ children.name }</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">ID: { children.id }</div>
                            </div>
                        </a>
                    </li>
                );
            }
        });

        return (
            <div className="list-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <AddFolderModal {...this.props}/>
                    <ErrorModal {...this.props}/>
                    { this.props.showBatchOps ? <DeleteConfirmation {...this.props} {...this.state}/> : null }
                    { this.props.uploads || this.props.loading ? <Loaders {...this.props}/> : null }
                </div>
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

FolderChildren.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    checkBox: {
        width: 16,
        height: 16,
        marginBottom: 21,
        marginRight: 20
    },
    checkboxLabel: {
        borderRadius: 30
    },
    dlIcon: {
        float: 'right',
        fontSize: 18,
        color: '#EC407A',
        marginTop: 6,
        marginLeft: 15,
        padding: '08px 08px 08px 08px'
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
        paddingTop: 40
    },
    listBlock: {
        paddingTop: 16
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