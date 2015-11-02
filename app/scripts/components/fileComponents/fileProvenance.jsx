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
            <div className="mdl-grid preview-container mdl-color--white content mdl-color-text--grey-800" style={styles.container}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                    <div style={styles.listTitle}>
                        <h4>Provenance</h4>
                    </div>
                    <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored" style={styles.fullView}>
                        FULL VIEW
                    </button>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-shadow--2dp mdl-color-text--grey-800" style={styles.preview}>

                </div>
            </div>
        );
    }
}



var styles = {
    preview: {
        overflow: 'hidden',
        height: 250
    },
    fullView: {
        float: 'right',
        position: 'relative',
        margin: '18px -10px 0px 0px'
    },
    image: {
        maxWidth: '50%',
        maxHeight: '100%'
    },
    listTitle: {
        margin: '0px 0px -5px 0px',
        textAlign: 'left',
        float: 'left',
        paddingLeft: 5
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

