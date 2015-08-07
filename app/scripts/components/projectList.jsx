import React from 'react';
import { Link } from 'react-router';
import ProjectListActions from '../actions/projectListActions';
import AccountOverview from '../components/accountOverview.jsx';
import Header from '../components/header.jsx';
let mui = require('material-ui'),
    Table = mui.Table,
    RaisedButton = mui.RaisedButton,
    TextField = mui.TextField,
    Dialog = mui.Dialog;

class ProjectList extends React.Component {

    constructor() {
        //this.state = {floatingErrorText: 'This field is required.'}
    }

    render() {
        var error = '';
        if(this.props.error)
            error = (<h4>{this.props.error}</h4>);
        let projects = this.props.projects.map((project) => {
                return (
                    <div key={ project.id } style={styles.cardSquare}
                         className="mdl-card mdl-shadow--3dp mdl-cell mdl-cell--4-col">
                        <div className="title mdl-card__title mdl-card--expand">
                            <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>folder</i>
                            <Link to="project"><h1 className="mdl-card__title-text content mdl-color-text--grey-800" style={styles.cardHeader} >{ project.name }</h1></Link>
                        </div>
                        <div className="mdl-card__supporting-text mdl-color-text--grey-800">
                            <p>ID: {project.id}</p>
                            <p>Description: { project.description }</p>
                        </div>
                    </div>
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
                            <h4>Projects</h4>
                        </div>
                        <div style={styles.addProject}>
                        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
                                style={styles.addProject}
                                onTouchTap={this.handleTouchTap.bind(this)}>
                            ADD PROJECT
                        </button>
                            <Dialog
                                style={styles.dialogStyles}
                                title="Add New Project"
                                actions={standardActions}
                                ref="addProject2">
                                <form action="#">
                                    <TextField
                                        style={styles.textStyles}
                                        hintText="Project Name"
                                        floatingLabelText="Project Name"
                                        multiLine={true}/> <br/>
                                    <TextField
                                        style={styles.textStyles}
                                        hintText="Principle Investigator"
                                        floatingLabelText="Principle Investigator"
                                        multiLine={true}/> <br/>
                                    <TextField
                                        style={styles.textStyles}
                                        hintText="Project Description"
                                        floatingLabelText="Project Description"
                                        multiLine={true} />
                                </form>
                            </Dialog>
                            <Dialog
                                style={styles.dialogStyles}
                                title="Add New Project"
                                actions={standardActions}
                                ref="addProject">
                                <form action="#">
                                <TextField
                                    style={styles.textStyles}
                                    hintText="Project Name"
                                    floatingLabelText="Project Name"
                                    multiLine={true}/> <br/>
                                <TextField
                                    style={styles.textStyles}
                                    hintText="Principle Investigator"
                                    floatingLabelText="Principle Investigator"
                                    multiLine={true}/> <br/>
                                <TextField
                                    style={styles.textStyles}
                                    hintText="Project Description"
                                    floatingLabelText="Project Description"
                                    multiLine={true} />
                                </form>
                            </Dialog>
                        </div>
                    </div>
                    { error }
                    { loading }
                    { projects }
                    </div>
        );
    }
    handleTouchTap() {
        this.refs.addProject.show();
    }

    //handleFloatingErrorInputChange(e) {
    //    this.setState({
    //        floatingErrorText: e.target.value ? '' : 'This field is required.'
    //    });
    //}
}

ProjectList.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    cardSquare: {
        width: 320,
        height: 220,
        margin: 20,
        textAlign: 'left',
        display: 'inline-block'
    },
    icon: {
        fontSize: 36
    },
    addProject: {
        float: 'right',
        position: 'relative',
        margin: '20px 36px 0px 0px'
    },
    listTitle: {
        margin: 20,
        marginBottom: -5,
        textAlign: 'left',
        overflow: 'auto',
        float: 'left',
        paddingLeft: 20
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    }
};

ProjectList.propTypes = {
    loading: React.PropTypes.bool,
    projects: React.PropTypes.array,
    error: React.PropTypes.string,
    is_deleted: React.PropTypes.bool,
};

export default ProjectList;

