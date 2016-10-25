import React from 'react';
import BaseUtils from '../../../util/baseUtils.js';
import Card from 'material-ui/lib/card/card';

class AccountOverview extends React.Component {

    render() {
        let numProjects = this.props.usage ? this.props.usage.project_count : '';
        let numFiles = this.props.usage ? this.props.usage.file_count : '';
        let bytes = this.props.usage ? this.props.usage.storage_bytes : '';

        return (
            <Card className="account-overview content mdl-color-text--grey-800"
                  style={{marginTop: this.props.windowWidth > 680 ? 117 : 30,padding: 20,textAlign: 'center'}}>
                <div style={styles.cardSquare}
                     className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>{numProjects + ' Projects'}</h4>
                    <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>content_paste</i>
                </div>
                <div style={styles.cardSquare}
                     className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>{numFiles + ' Files' }</h4>
                    <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>description</i>
                </div>
                <div style={styles.cardSquare}
                     className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>{BaseUtils.bytesToSize(bytes)}</h4>
                    <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>save</i>
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
        verticalAlign: 'center'
    }
};

AccountOverview.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default AccountOverview;