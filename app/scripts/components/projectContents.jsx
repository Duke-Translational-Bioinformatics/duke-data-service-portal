import React from 'react';
import ProjectListActions from '../actions/projectListActions';
import ProjectDetails from '../components/projectDetails.jsx';
import Header from '../components/header.jsx';
var mui = require('material-ui'),
    TextField = mui.TextField,
    Dialog = mui.Dialog,
    Checkbox = mui.Checkbox,
    Table = mui.Table;

class ProjectContents extends React.Component {

    constructor() {
    }

    render() {
        var error = '';
        if(this.props.error)
            error = (<h4>{this.props.error}</h4>);
        let projects = this.props.projects.map((project) => {
            return (
                <tr key={ project.id }>
                    <td className="mdl-data-table__cell--non-numeric"><i className="material-icons" style={styles.icon}>description</i>{ project.name }</td>
                    <td>{ project.id }</td>
                    <td>{ project.description }</td>
                </tr>
            );
        });

        let loading = this.props.loading ? <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';

        let standardActions = [
            { text: 'Submit' },
            { text: 'Cancel' }
        ];

        return (
                <div className="project-container mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                        <div style={styles.listTitle}>
                            <h4>Test Project 123</h4>
                        </div>
                        <div style={styles.addFolder}>
                        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
                                style={styles.addFolder}
                                onTouchTap={this.handleTouchTap.bind(this)}>
                            ADD FOLDER
                        </button>
                            <Dialog
                                style={styles.dialogStyles}
                                title="Add New Folder"
                                actions={standardActions}
                                ref="addFolder">
                                <form action="#">
                                    <TextField
                                        style={styles.textStyles}
                                        hintText="Folder Name"
                                        floatingLabelText="Folder Name"
                                        multiLine={true}/> <br/>
                                </form>
                            </Dialog>
                        </div>
                    </div>
                    { error }
                    { loading }
                    <table className="mdl-data-table" style={styles.table}>
                        <thead>
                        <tr>
                            <th className="mdl-data-table__cell--non-numeric">Name</th>
                            <th>ID</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        { projects }
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
        width: '90%',
        margin: '0 auto'
    },
    icon: {
        fontSize: 24,
        paddingRight: 5
    },
    addFolder: {
        float: 'right',
        position: 'relative',
        margin: '10px 36px 0px 0px'
    },
    listTitle: {
        margin: 20,
        marginBottom: -2,
        marginTop: -2,
        float: 'left',
        paddingLeft: 20
    },
    dialogStyles: {
        textAlign: 'center',
    },
    textStyles: {
        textAlign: 'left',
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

