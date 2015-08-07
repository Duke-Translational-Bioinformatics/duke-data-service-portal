import React from 'react';
import ProjectListActions from '../actions/projectListActions';
var mui = require('material-ui');

class ProjectDetails extends React.Component {

    constructor() {
    }
    render () {
        return (
            <div className="project-container account-overview-container mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800" style={styles.container}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" >
                    <div className="mdl-cell mdl-cell--4-col" style={styles.detailsTitle}>
                        <h4>Test Project 123</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col" style={styles.details}>
                        <p><span style={styles.span}>Created By:</span> Jane Doe</p>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col" style={styles.details}>
                        <p><span style={styles.span}>Created On:</span> 7/30/2015</p>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.details}>
                        <p style={styles.summary}><span style={styles.span}>Summary:</span> Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary Fake project summary vFake project summary Fake project summary Fake project summary </p>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.detailsButton}>
                        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored">
                            MORE DETAILS
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

var styles = {
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
    span: {
        fontWeight: 'bold'
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

