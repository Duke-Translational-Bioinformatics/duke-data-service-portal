import React from 'react';
import BaseUtils from '../../../util/baseUtils.js';
import Card from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';

class AccountOverview extends React.Component {

    render() {
        let numProjects = this.props.usage ? this.props.usage.project_count : '';
        let numFiles = this.props.usage ? this.props.usage.file_count : '';
        let bytes = this.props.usage ? this.props.usage.storage_bytes : '';

        return (
            <Card className="account-overview content mdl-color-text--grey-800"
                  style={{padding: 20,textAlign: 'center'}}>
                <div style={styles.cardSquare}
                     className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>{numProjects + ' Projects'}</h4>
                    <FontIcon className="material-icons" style={styles.icon}>content_paste</FontIcon>
                </div>
                <div style={styles.cardSquare}
                     className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>{numFiles + ' Files' }</h4>
                    <FontIcon className="material-icons" style={styles.icon}>description</FontIcon>
                </div>
                <div style={styles.cardSquare}
                     className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>{BaseUtils.bytesToSize(bytes)}</h4>
                    <FontIcon className="material-icons" style={styles.icon}>save</FontIcon>
                </div>
            </Card>
        );
    }
}

var styles = {
    cardSquare: {
        marginBottom: 40,
        height: 120,
        display: 'inline-block'
    },
    icon: {
        fontSize: 52,
        verticalAlign: 'center',
        color: '#616161'
    }
};

AccountOverview.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default AccountOverview;