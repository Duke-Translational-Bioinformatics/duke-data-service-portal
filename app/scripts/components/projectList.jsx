import React from 'react';
import { Link } from 'react-router';
import ProjectListActions from '../actions/projectListActions';
import AccountOverview from '../components/accountOverview.jsx';
import Header from '../components/header.jsx';
import AddProjectModal from '../components/addProjectModal.jsx';

let mui = require('material-ui'),
    Table = mui.Table,
    RaisedButton = mui.RaisedButton,
    TextField = mui.TextField,
    Dialog = mui.Dialog;

class ProjectList extends React.Component {

    constructor() {
        this.state = {
        }
    }

    render() {
        var error = '';
        if(this.props.error)
            error = (<h4>{this.props.error}</h4>);
        let projects = this.props.projects.map((project) => {
            if (!project.is_deleted){
                    return (
                        <div key={ project.id } style={styles.cardSquare} className="card col-33">
                            <div className="mdl-card__title mdl-card--expand">
                                <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>folder</i>
                                <Link to={"/project/" + project.id}><h1 className="mdl-card__title-text content mdl-color-text--grey-800" style={styles.cardHeader} >{ project.name }</h1></Link>
                            </div>
                            <div className="mdl-card__supporting-text mdl-color-text--grey-800">
                                <p>ID: {project.id}</p>
                                <p>Description: { project.description.slice(0,65) + ' ...' }</p>
                            </div>
                        </div>
                    );
                }
            });

        let loading = this.props.loading ? <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';
        let addProjectLoading = this.props.addProjectLoading ? <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';

        return (
                <div className="project-container mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800 row">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                        <div style={styles.listTitle}>
                            <h4>Projects</h4>
                        </div>
                            <AddProjectModal />
                        </div>
                    { error }
                    { loading }
                    { addProjectLoading }
                    { projects }
                    </div>
        );
    }
}

ProjectList.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    cardSquare: {
        width: 320,
        height: 260,
        margin: 20,
        textAlign: 'left',
        display: 'inline-block'
    },
    icon: {
        fontSize: 36
    },
    listTitle: {
        margin: '0px 0px -5px 0px',
        textAlign: 'left',
        float: 'left',
        paddingLeft: 20,
    }
};

ProjectList.propTypes = {
    loading: React.PropTypes.bool,
    addProjectLoading: React.PropTypes.bool,
    projects: React.PropTypes.array,
    error: React.PropTypes.string,
    is_deleted: React.PropTypes.bool,
};

export default ProjectList;