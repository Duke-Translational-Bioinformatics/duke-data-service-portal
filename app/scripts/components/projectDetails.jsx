import React from 'react';
import ProjectListActions from '../actions/projectListActions';
import ProjectStore from '../stores/projectStore';
import FolderActions from '../actions/folderActions';
import FolderStore from '../stores/folderStore';
import AddFolderModal from './addFolderModal.jsx';

var mui = require('material-ui'),
    TextField = mui.TextField,
    Dialog = mui.Dialog;


class ProjectDetails extends React.Component {

    constructor() {
        this.state = {
            showDetails: false
        }
    }
    render () {
        let standardActions = [
            { text: 'Submit' },
            { text: 'Cancel' }
        ];
        let details = this.props.projects.map((project) => {
            return <div>
                <p>{project.name}</p>
                <p>{project.description}</p>
            </div>
        });
        let error = '';
        let addProjectLoading = this.props.addProjectLoading ? <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';
        return (
            <div className="project-container account-overview-container mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800" style={styles.container}>
                <AddFolderModal/>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" >
                    <div className="mdl-cell mdl-cell--4-col" style={styles.detailsTitle}>
                        <h4>Test Project</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col" style={styles.details}>
                        <p><span style={styles.span}>Created By:</span> Jane Doe</p>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col" style={styles.details}>
                        <p><span style={styles.span}>Created On:</span> 7/30/2015</p>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.details}>
                        <!--<p style={styles.summary}><span style={styles.span}>Summary:</span> Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary vFake project summary Fake project summary Fake project summary </p>-->
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.detailsButton}>
                        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored" onClick={this.handleTouchTapDetails.bind(this)}>
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
    };
    handleTouchTapDetails() {
        if(!this.state.showDetails) {
            this.setState({showDetails: true})
        }else{
            this.setState({showDetails: false})
        }
    }
}

var Details = React.createClass({
    getInitialState(){
        return {
            projects: []
        }
    },
    render() {
        return (
            <div  style={styles.moreDetails}>
                <h5>Project Members</h5>
                <ul>
                    <li>Jon</li>
                    <li>Darin</li>
                    <li>Darrin</li>
                    <li>Casey</li>
                </ul>
                <p>Placeholder for additional project details. Placeholder for additional project details. Placeholder for additional project details and other things.</p>
                <p>Placeholder for additional project details. Placeholder for additional project details. Placeholder for additional project details and other things.</p>
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
        float: 'left',
    },
    details: {
        float: 'left',
    },
    summary: {
        float: 'left',
        textAlign: 'left'
    },
    detailsButton: {
        align: 'center',
        clear: 'both',
    },
    textStyles: {
        textAlign: 'left',
    },
    span: {
        fontWeight: 'bold'
    },
    moreDetails: {
        textAlign: 'left'
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

