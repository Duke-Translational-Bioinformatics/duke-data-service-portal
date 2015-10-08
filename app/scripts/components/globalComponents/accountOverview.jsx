import React from 'react';
import ProjectListActions from '../../actions/projectListActions';
import FolderActions from '../../actions/folderActions';
import FileActions from '../../actions/fileActions';
var mui = require('material-ui');

class AccountOverview extends React.Component {

    constructor() {
    }

    render() {
        let numProjects = 0;
        let projects = this.props.projects.map((project) => {
            if (!project.is_deleted) {
                numProjects++;
                return numProjects;
            }
        });

        return (
            <div
                className="mdl-grid account-overview mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800 "
                style={styles.overviewContainer}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.accountOverviewTitle}>
                    <div style={styles.accountOverviewTitle}>
                        <h4>Account Overview</h4>
                    </div>
                </div>
                <div style={styles.cardSquare}
                     className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>
                        {numProjects + ' Projects'}</h4>
                    <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>content_paste</i>
                </div>
                <div style={styles.cardSquare}
                     className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>
                        370 Files</h4>
                    <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>description</i>
                </div>
                <div style={styles.cardSquare}
                     className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>
                        99.9 GB</h4>
                    <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>save</i>
                </div>
            </div>
        );
    }
}

var styles = {
    cardSquare: {
        height: 120,
        display: 'inline-block'
    },
    icon: {
        fontSize: 52,
        verticalAlign: 'center'
    },
    accountOverviewTitle: {
        marginTop: -10,
        marginBottom: -10,
        float: 'left',
        paddingLeft: 14
    },
    overviewContainer: {
        marginTop: 20,
        padding: 20,
        textAlign: 'center'
    }
};

AccountOverview.contextTypes = {
    muiTheme: React.PropTypes.object
};

AccountOverview.propTypes = {
    loading: React.PropTypes.bool,
    account: React.PropTypes.array,
    error: React.PropTypes.string
};


export default AccountOverview;

