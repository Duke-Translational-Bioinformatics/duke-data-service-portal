import React from 'react';
import { Link } from 'react-router';
import cookie from 'react-cookie';

var mui = require('material-ui'),
    TextField = mui.TextField,
    IconMenu = mui.IconMenu,
    Dialog = mui.Dialog;


class FileProvenance extends React.Component {

    constructor() {
        this.state = {

        }
    }

    render() {
        let error = '';
        let loading = this.props.loading ?
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';

        return (
            <div className="mdl-grid project-container mdl-color--white content mdl-color-text--grey-800" style={styles.container}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                    <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored" style={styles.fullView}>
                        FULL VIEW
                    </button>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-shadow--2dp mdl-color-text--grey-800" style={styles.container2}>

                </div>
            </div>
        );
    }
}



var styles = {
    container: {
        height: 'auto'
    },
    container2: {
        height: 250
    },
    fullView: {
        float: 'right',
        position: 'relative'
    }
};

FileProvenance.contextTypes = {
    muiTheme: React.PropTypes.object
};

FileProvenance.propTypes = {
    loading: React.PropTypes.bool,
    details: React.PropTypes.array,
    error: React.PropTypes.string
};


export default FileProvenance;

