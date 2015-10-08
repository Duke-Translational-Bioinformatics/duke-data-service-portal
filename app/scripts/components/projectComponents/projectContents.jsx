import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectDetails from './projectDetails.jsx';
import FolderActions from '../../actions/folderActions';
import FolderStore from '../../stores/folderStore';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import Header from '../../components/globalComponents/header.jsx';
var mui = require('material-ui'),
    TextField = mui.TextField,
    Dialog = mui.Dialog,
    Checkbox = mui.Checkbox,
    Table = mui.Table;

class ProjectContents extends React.Component {

    constructor() {
        this.state = {
            folders: FolderStore.folders
        };
    }

    render() {

        var error = '';
        if (this.props.error)
            error = (<h4>{this.props.error}</h4>);
        let folders = this.props.folders.map((folder) => {
            return (
                <tr key={ folder.id }>
                    <td className="mdl-data-table__cell--non-numeric"><i className="material-icons" style={styles.icon}>folder</i><Link to={"/folder/" + folder.id} className="mdl-color-text--grey-800">{ folder.name }</Link>
                    </td>
                    <td style={styles.tableText}>{ folder.id }</td>
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
                    <div style={styles.addFolder}>
                        <AddFolderModal {...this.props}/>
                    </div>
                </div>
                { error }
                { loading }
                <table className="mdl-data-table mdl-data-table mdl-js-data-table mdl-shadow--2dp" style={styles.table}>
                    <thead>
                    <tr>
                        <th className="mdl-data-table__cell--non-numeric" style={styles.tableText}>Name</th>
                        <th style={styles.tableText}>ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    { folders }
                    </tbody>
                </table>
            </div>
        );
    }

    handleTouchTap() {
        this.refs.addFolder.show();
    }
}

ProjectContents.contextTypes = {
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

ProjectContents.propTypes = {
    loading: React.PropTypes.bool,
    projects: React.PropTypes.array,
    error: React.PropTypes.string,
    is_deleted: React.PropTypes.bool,
};

export default ProjectContents;

