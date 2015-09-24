import React from 'react';
import ProjectListActions from '../actions/projectListActions';
import ProjectStore from '../stores/projectStore';
import MainActions from '../actions/mainActions';
import MainStore from '../stores/mainStore';
import FolderActions from '../actions/folderActions';
import FolderStore from '../stores/folderStore';
import AddFolderModal from './addFolderModal.jsx';
import ProjectOptionsMenu from './projectOptionsMenu.jsx';
import CurrentUser from './currentUser.jsx';
import cookie from 'react-cookie';

var mui = require('material-ui'),
    TextField = mui.TextField,
    IconMenu = mui.IconMenu,
    Dialog = mui.Dialog;


class ProjectDetails extends React.Component {

    constructor() {
        this.state = {
            showDetails: false,
            currentUser: cookie.load('currentUser'),
            projects: []
        }
    }

    render() {
        let standardActions = [
            {text: 'Submit'},
            {text: 'Cancel'}
        ];

        let currentUser = cookie.load('currentUser').map((user)=> {
            return <span>{user.first_name + " " + user.last_name}</span>
        });

        let details = this.props.projects.map((project) => {
            if (project.id == id) {
                return <div key={project.id}>
                    <h4>{project.name}</h4>
                </div>
            } else {
                return null
            }
        });

        let error = '';

        let addProjectLoading = this.props.addProjectLoading ?
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';

        return (
            <div
                className="project-container account-overview-container mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800"
                style={styles.container}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div style={styles.menuIcon}>
                        <ProjectOptionsMenu {...this.props} />
                    </div>
                    <div className="mdl-cell mdl-cell--4-col" style={styles.detailsTitle}>
                        <h4>Test Project</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col" style={styles.details}>
                        <p><span style={styles.span}>Created By:</span> {currentUser}</p>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col" style={styles.details}>
                        <p><span style={styles.span}>Created On:</span> 7/30/2015</p>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.details}>
                        <!--<p style={styles.summary}><span style={styles.span}>Summary:</span> Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary vFake project summary Fake project summary Fake project summary </p>-->
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.detailsButton}>
                        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
                                onClick={this.handleTouchTapDetails.bind(this)}>
                            {!this.state.showDetails ? 'MORE DETAILS' : 'LESS DETAILS'}
                        </button>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                        { this.state.showDetails ? <Details /> : null }
                    </div>
                </div>
                { addProjectLoading }
                { error }
            </div>
        );
    }

    handleTouchTap() {
        this.refs.addFolder.show();
    }

    handleTouchTapDetails() {
        if (!this.state.showDetails) {
            this.setState({showDetails: true})
        } else {
            this.setState({showDetails: false})
        }
    }
}

var Details = React.createClass({
    getInitialState(){
        return {}
    },
    render() {
        return (
            <div style={styles.moreDetails}>
                <h5>Project Members</h5>
                <ul>
                    <li>Jon</li>
                    <li>Darin</li>
                    <li>Darrin</li>
                    <li>Casey</li>
                </ul>
                <p>Placeholder for additional project details. Placeholder for additional project details. Placeholder
                    for additional project details and other things.</p>

                <p>Placeholder for additional project details. Placeholder for additional project details. Placeholder
                    for additional project details and other things.</p>
            </div>
        )
    }
});


var styles = {
    container: {
        marginTop: 50,
        position: 'relative',
        overflow: 'visible'
    },
    detailsTitle: {
        textAlign: 'left',
        marginTop: -20,
        float: 'left'
    },
    details: {
        float: 'left',
        marginLeft: -4
    },
    summary: {
        float: 'left',
        textAlign: 'left'
    },
    detailsButton: {
        align: 'center',
        clear: 'both'
    },
    textStyles: {
        textAlign: 'left'
    },
    span: {
        fontWeight: 'bold'
    },
    moreDetails: {
        textAlign: 'left'
    },
    menuIcon: {
        float: 'right'
    }
};

ProjectDetails.contextTypes = {
    muiTheme: React.PropTypes.object
};

ProjectDetails.propTypes = {
    loading: React.PropTypes.bool,
    account: React.PropTypes.array,
    error: React.PropTypes.string
};


export default ProjectDetails;

