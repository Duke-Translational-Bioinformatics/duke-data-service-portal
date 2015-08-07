import React from 'react';
import ProjectListActions from '../actions/projectListActions';
var mui = require('material-ui');

class AccountOverview extends React.Component {

    constructor() {
    }
        render () {
            let numProjects = this.props.projects.length;
            return (
                    <div className="project-container account-overview-container mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800 ">
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.accountOverviewTitle}>
                            <div style={styles.accountOverviewTitle}>
                                <h4>Account Overview</h4>
                            </div>
                        </div>
                        <div style={styles.cardSquare}
                             className="mdl-cell mdl-cell--4-col">
                            <h4 style={styles.cardHeader}>
                                {numProjects + ' Projects'}</h4>
                            <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>folder_special</i>
                        </div>
                        <div style={styles.cardSquare}
                             className="mdl-cell mdl-cell--4-col">
                            <h4 style={styles.cardHeader}>
                                370 Files</h4>
                            <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>description</i>
                        </div>
                        <div style={styles.cardSquare}
                             className="mdl-cell mdl-cell--4-col">
                            <h4 style={styles.cardHeader}>
                                99.9 GB</h4>
                            <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>save</i>
                        </div>
                    </div>
            );
    }
}

var styles = {
    cardSquare: {
        width: 320,
        height: 120,
        margin: 20,
        display: 'inline-block',
    },
    cardHeader: {
       margin: 20
    },
    icon: {
        fontSize: 64,
        verticalAlign: 'center'
    },
    accountOverviewTitle: {
        marginTop: -10,
        marginBottom: -10,
        float: 'left',
        paddingLeft: 38
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

