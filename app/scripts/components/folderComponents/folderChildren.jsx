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

    }

    render() {

        var error = '';
        if (this.props.error)
            error = (<h4>{this.props.error}</h4>);
        if (!this.props.children) {
            return false
        } else {
            let kind = this.props.children.map((children) => {
                if (children.kind === 'dds-folder') {
                    return true;
                } else {
                    return false
                }
            });

            let folderChildren = this.props.children.map((children) => {
                return (
                    <tr key={ children.id }>
                        <td className="mdl-data-table__cell--non-numeric"><i
                            className="material-icons mdl-color-text--grey-800"
                            style={styles.icon}>{!kind ? 'description' : 'folder'}</i>
                            <a href={!kind ? urlGen.routes.baseUrl + "file/" + children.id : urlGen.routes.baseUrl + "folder/" + children.id}
                               className="mdl-color-text--grey-800 external"
                               onTouchTap={this.handleTouchTap.bind(this, kind, children.id)}>{ children.name }</a>
                        </td>
                        <td style={styles.tableText}>{ children.id }</td>
                    </tr>
                );
            });
            let loading = this.props.loading ?
                <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';
            let standardActions = [
                {text: 'Submit'},
                {text: 'Cancel'}
            ];

            return (
                <div className="project-container">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                        <div style={styles.addFile}>
                            <UploadFileModal {...this.props} {...this.state} />
                        </div>
                        <div style={styles.addFolder}>
                            <AddFolderModal {...this.props} {...this.state}/>
                        </div>
                    </div>
                    { error }
                    { loading }
                    <table className="mdl-data-table" style={styles.table}>
                        <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric" style={styles.tableText}>Name</th>
                            <th style={styles.tableText}>ID</th>
                        </tr>
                        </thead>
                        <tbody>
                        {folderChildren}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    handleTouchTap(kind, id) {
        if (!kind) {
            return null;
        } else {
            ProjectActions.loadFolderChildren(id, ProjectActions.getParent(id));
        }
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
        fontSize: 24,
        paddingRight: 5,
        verticalAlign: -5
    },
    addFile: {
        float: 'right',
        position: 'relative',
        margin: '0px 10px 10px 0px'
    },
    addFolder: {
        float: 'right',
        position: 'relative',
        margin: '0px 10px 10px 0px'
    },
    listTitle: {
        margin: 20,
        marginBottom: -2,
        marginTop: -2,
        float: 'left',
        paddingLeft: 20
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

