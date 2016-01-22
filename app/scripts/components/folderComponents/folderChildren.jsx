import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddFolderModal from '../folderComponents/addFolderModal.jsx';
import urlGen from '../../../util/urlGen.js';
const LinearProgress = require('material-ui/lib/linear-progress');
var mui = require('material-ui'),
    TextField = mui.TextField,
    Dialog = mui.Dialog,
    Checkbox = mui.Checkbox,
    Table = mui.Table;

class FolderChildren extends React.Component {

    render() {
        let uploading = this.props.uploading ? <div><LinearProgress color={"#2196f3"} mode="indeterminate" style={styles.uploader}/><div className="mdl-color-text--grey-600" style={styles.uploadText}>uploading...</div></div> : '';
        let loading = this.props.loading ? <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate loader"></div> : '';
        var error = '';
        if (this.props.error)
            error = (<h4>{this.props.error}</h4>);
        if (!this.props.children) {
            return false
        } else {
            let folderChildren = this.props.children.map((children) => {
                if (children.kind === 'dds-folder') {
                    return (
                        <li key={ children.id } className="hover">
                            <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + "/folder/" + children.id}
                               className="item-content external">
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
                            <a className="mdl-button mdl-js-button mdl-button--icon external" style={styles.dlIcon} onTouchTap={() => this.handleTouchTap(children.id)}>
                                <i className="material-icons">get_app</i>
                            </a>
                            <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + "/file/" + children.id}
                               className="item-content external">
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

            return (
                <div className="list-container">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                        <div style={styles.addFolder}>
                            <AddFolderModal {...this.props} {...this.state}/>
                        </div>
                    </div>
                    { error }
                    { loading }
                    { uploading }
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

    handleTouchTap(id){
        ProjectActions.getDownloadUrl(id);
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
    dlIcon: {
        float: 'right',
        fontSize: 18,
        color: '#EC407A',
        marginTop: 22
    },
    uploader: {
        width: '80%',
        marginTop: 10,
        margin: '0 auto'
    },
    uploadText: {
        textAlign: 'center',
        fontSize: '.8em'
    }
};

FolderChildren.propTypes = {
    loading: React.PropTypes.bool,
    uploading: React.PropTypes.bool,
    children: React.PropTypes.array,
    error: React.PropTypes.string
};

export default FolderChildren;

