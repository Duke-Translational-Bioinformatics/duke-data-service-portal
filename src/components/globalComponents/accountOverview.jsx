import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
const { object } = PropTypes;

@observer
class AccountOverview extends React.Component {

    render() {
        const { usage } = mainStore;

        return (
            usage && usage !== null ?
                <Paper className="account-overview mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet" style={styles.card}>
                    <div style={styles.cardSquare} className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                        <h4>{usage.project_count + ' Projects'}</h4>
                        <FontIcon className="material-icons" style={styles.icon}>content_paste</FontIcon>
                    </div >
                    <div style={styles.cardSquare} className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                        <h4>{usage.file_count + ' Files' }</h4>
                        <FontIcon className="material-icons" style={styles.icon}>description</FontIcon>
                    </div >
                    <div  style={styles.cardSquare} className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                        <h4>{BaseUtils.bytesToSize(usage.storage_bytes)}</h4>
                        <FontIcon className="material-icons" style={styles.icon}>dns</FontIcon>
                    </div >
                </Paper> : null
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

AccountOverview.propTypes = {
    usage: object
};

export default AccountOverview;