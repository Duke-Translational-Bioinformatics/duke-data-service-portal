import React from 'react';
import { Link } from 'react-router';
import ProjectListActions from '../../actions/projectListActions';
import ProjectStore from '../../stores/projectStore';
import MainActions from '../../actions/mainActions';
import MainStore from '../../stores/mainStore';
import FolderActions from '../../actions/folderActions';
import FolderStore from '../../stores/folderStore';
import ProjectOptionsMenu from './projectOptionsMenu.jsx';
import CurrentUser from '../../components/globalComponents/currentUser.jsx';
import cookie from 'react-cookie';
import urlGen from '../../../util/urlGen.js';

var mui = require('material-ui'),
    TextField = mui.TextField,
    IconMenu = mui.IconMenu,
    Dialog = mui.Dialog;


class ProjectDetails extends React.Component {

    constructor() {
        this.state = {
            showDetails: false,
            currentUser: cookie.load('currentUser'),
            project: ProjectStore.project,
            projects: ProjectStore.projects
        }
    }

    componentDidMount() {
        let id = this.props.params.id;  //Todo: Need to fix this. Needs to get ID of project
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        ProjectListActions.showDetails(id);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        let id = this.props.params.id;
        let currentUser = cookie.load('currentUser').map((user)=> {
            return <span key={user.id}>{user.first_name + " " + user.last_name}</span>
        });
        let details = this.state.project.map((detail) => { //TODO: Fix this!!!!
            return detail.name;
        });

        let error = '';

        let addProjectLoading = this.props.addProjectLoading ?
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';

        return (
            <div
                className="project-container mdl-color--white mdl-shadow--2dp mdl-color-text--grey-800"
                style={styles.container}>
                <button
                    className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored"
                    style={styles.floatingButton}>
                    <i className="material-icons">file_upload</i>
                </button>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div style={styles.menuIcon}>
                        <ProjectOptionsMenu {...this.props} />
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href={urlGen.routes.baseUrl + 'home'} style={styles.back} className="external mdl-color-text--grey-800"><i className="material-icons mdl-color-text--grey-800" style={styles.backIcon}>keyboard_backspace</i>Back</a>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone"
                         style={styles.detailsTitle}>
                        <h4>{details}</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet" style={styles.details}>
                        <p><span style={styles.span}>Created By:</span> {currentUser}</p>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet" style={styles.details}>
                        <p><span style={styles.span}>Created On:</span> 7/30/2015</p>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.detailsButton}>
                        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
                                onClick={this.handleTouchTapDetails.bind(this)}>
                            {!this.state.showDetails ? 'MORE DETAILS' : 'LESS DETAILS'}
                        </button>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                        <div style={styles.moreDetails} className={!this.state.showDetails ? 'less' : 'more'}>
                            { this.state.showDetails ? <Details className={this.state.newClass}/> : null }
                        </div>
                    </div>
                </div>
                { addProjectLoading }
                { error }
            </div>
        );
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
            <div>
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
        marginTop: 30,
        position: 'relative',
        overflow: 'visible',
        padding: '10px 0px 10px 0px'
    },
    detailsTitle: {
        textAlign: 'left',
        marginTop: -16,
        float: 'left',
        marginLeft: 5
    },
    details: {
        textAlign: 'left',
        float: 'left',
        marginLeft: -3
    },
    summary: {
        float: 'left',
        textAlign: 'left'
    },
    detailsButton: {
        align: 'center',
        clear: 'both',
        textAlign: 'center'
    },
    textStyles: {
        textAlign: 'left'
    },
    moreDetails: {
        textAlign: 'left'
    },
    menuIcon: {
        float: 'right',
        marginTop: 38
    },
    backIcon: {
        fontSize: 24,
        float: 'left'
    },
    arrow: {
        textAlign: 'left'
    },
    back: {
        verticalAlign: -2
    },
    floatingButton: {
        position: 'absolute',
        top: -20,
        right: '2%',
        zIndex: '2',
        color: '#ffffff'
    }
};

ProjectDetails.contextTypes = {
    muiTheme: React.PropTypes.object
};

ProjectDetails.propTypes = {
    loading: React.PropTypes.bool,
    details: React.PropTypes.array,
    error: React.PropTypes.string
};


export default ProjectDetails;

