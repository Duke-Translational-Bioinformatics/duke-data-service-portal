import React from 'react';
import ProjectListActions from '../actions/projectListActions';
var mui = require('material-ui');

class AccountOverview extends React.Component {

    constructor() {
    }
        render () {
            var numProjects = this.props.projects.length;
            return (
                    <div className="demo account-overview-container mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800 ">
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.accountOverviewTitle}>
                            <div style={styles.accountOverviewTitle}>
                            <h4>Account Overview</h4>
                                </div>
                        </div>
                        <div style={styles.cardSquare}
                             className="mdl-cell mdl-cell--4-col">
                            <h3 style={styles.cardHeader}>
                                {numProjects + ' Projects'}</h3>
                            <i className="material-icons" style={styles.icon}>folder</i>
                        </div>
                        <div style={styles.cardSquare}
                             className="mdl-cell mdl-cell--4-col">
                            <h3 style={styles.cardHeader}>
                                370 Files</h3>
                            <i className="material-icons" style={styles.icon}>folder</i>
                        </div>
                        <div style={styles.cardSquare}
                             className="mdl-cell mdl-cell--4-col">
                            <h3 style={styles.cardHeader}>
                                99.9 GB</h3>
                            <i className="material-icons" style={styles.icon}>folder</i>
                        </div>
                    </div>
            );
    }
}


AccountOverview.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    cardSquare: {
        width: 320,
        height: 220,
        margin: 20,
        display: 'inline-block',
        backgroundColor: '#40c4ff'
    },
    cardHeader: {
       margin: 20
    },
    icon: {
        fontSize: 48,
        verticalAlign: 'center'
    },
    accountOverviewTitle: {
        margin: 20,
        marginBottom: -5,
        textAlign: 'left',
        overflow: 'auto',
        float: 'left',
        paddingLeft: 20
    }
};

AccountOverview.propTypes = {
    loading: React.PropTypes.bool,
    account: React.PropTypes.array,
    error: React.PropTypes.string
};


export default AccountOverview;

