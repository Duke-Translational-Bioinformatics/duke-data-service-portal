import React from 'react';
import PropTypes from 'prop-types';
const { object } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import Card from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';

@observer
class AccountOverview extends React.Component {

    render() {
        const { usage } = mainStore;

        return (
            usage && usage !== null ? <Card className="account-overview content mdl-cell mdl-cell--12-col mdl-color-text--grey-800"
                  style={styles.card}>
                <div style={styles.cardSquare} className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>{usage.project_count + ' Projects'}</h4>
                    <FontIcon className="material-icons" style={styles.icon}>content_paste</FontIcon>
                </div>
                <div style={styles.cardSquare} className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>{usage.file_count + ' Files' }</h4>
                    <FontIcon className="material-icons" style={styles.icon}>description</FontIcon>
                </div>
                <div style={styles.cardSquare} className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <h4>{BaseUtils.bytesToSize(usage.storage_bytes)}</h4>
                    <FontIcon className="material-icons" style={styles.icon}>save</FontIcon>
                </div>
            </Card> : null
        );
    }
}

const styles = {
    card: {
        padding: '0px 0px 20px 0px',
        textAlign: 'center',
        margin: '0 auto'
    },
    cardSquare: {
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