import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddFolderModal from '../folderComponents/addFolderModal.jsx';
import UploadFileModal from '../fileComponents/uploadFileModal.jsx';
import urlGen from '../../../util/urlGen.js';
var mui = require('material-ui'),
    TextField = mui.TextField,
    Dialog = mui.Dialog,
    Checkbox = mui.Checkbox,
    Table = mui.Table;

class FolderChildren extends React.Component {

    constructor() {
        this.state = {
            objName: ProjectStore.objName
        }
    }

    render() {
        var error = '';
        if (this.props.error)
            error = (<h4>{this.props.error}</h4>);
        if (!this.props.children) {
            return false
        } else {
            let folderChildren = this.props.children.map((children) => {
                if(children.kind === 'dds-folder') {
                    return (
                        <li key={ children.id } className="hover">
                            <a href={urlGen.routes.baseUrl + "folder/" + children.id}
                               className="item-content external"
                               onTouchTap={this.handleTouchTap.bind(this, children.kind, children.id)}>
                                <div className="item-media"><i className="material-icons"
                                                               style={styles.icon}>folder</i>
                                </div>
                                <div className="item-inner">
                                    <div className="item-title-row">
                                        <div className="item-title mdl-color-text--grey-800">{ children.name }</div>
                                    </div>
                                    <div className="item-subtitle mdl-color-text--grey-600">ID: { children.id }</div>
                                </div>
                            </a>
                        </li>
                    );
                } else {
                    return (
                        <li key={ children.id } className="hover">
                            <a href={urlGen.routes.baseUrl + "file/" + children.id}
                               className="item-content external"
                               onTouchTap={this.handleTouchTapFile.bind(this, children.kind, children.id)}>
                                <div className="item-media"><i className="material-icons"
                                                               style={styles.icon}>description</i>
                                </div>
                                <div className="item-inner">
                                    <div className="item-title-row">
                                        <div className="item-title mdl-color-text--grey-800">{ children.name }</div>
                                    </div>
                                    <div className="item-subtitle mdl-color-text--grey-600">ID: { children.id }</div>
                                </div>
                            </a>
                        </li>
                    );
                }
            });
            let loading = this.props.loading ?
                <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';
            let standardActions = [
                {text: 'Submit'},
                {text: 'Cancel'}
            ];

            return (
                <div className="list-container">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                        <div style={styles.addFolder}>
                            <AddFolderModal {...this.props} {...this.state}/>
                        </div>
                    </div>
                    { error }
                    { loading }
                    <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                        <div className="list-block list-block-search searchbar-found media-list">
                            <ul>
                                {folderChildren}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
    }
    handleTouchTap(kind, id) {
        if (kind === 'project') {
            return null;
        } else {
            ProjectActions.loadFolderChildren(id, ProjectActions.getParent(id));
        }
    }

    handleTouchTapFile(kind, id) {
        ProjectActions.getFileParent(id);
    }
}


FolderChildren.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    table: {
        width: '100%',
        margin: '0 auto'
    },
    tableText: {
        textAlign: 'left'
    },
    icon: {
        fontSize: 36
    },
    list: {
        paddingTop: 40
    },
    dialogStyles: {
        textAlign: 'center'
    },
    textStyles: {
        textAlign: 'left'
    },
    upLoadBox: {
        textAlign: 'center',
        height: 200,
        border: '1px solid grey',
        margin: '0px 20px 20px 20px'
    }
};

FolderChildren.propTypes = {
    loading: React.PropTypes.bool,
    projects: React.PropTypes.array,
    error: React.PropTypes.string,
    is_deleted: React.PropTypes.bool,
};

export default FolderChildren;

