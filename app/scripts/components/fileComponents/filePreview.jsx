import React from 'react';
import { Link } from 'react-router';
import cookie from 'react-cookie';

var mui = require('material-ui'),
    TextField = mui.TextField,
    IconMenu = mui.IconMenu,
    Dialog = mui.Dialog;


class FilePreview extends React.Component {

    constructor() {
        this.state = {

        }
    }

    render() {
        let error = '';
        let loading = this.props.loading ?
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';

        return (
            <div>
                <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored" style={styles.fullView}>
                    FULL VIEW
                </button>
                <div className="project-container mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800" style={styles.container}>
                </div>
            </div>
        );
    }

    handleTouchTapDetails() {
        if (!this.state.showDetails) {
            this.setState({showDetails: true})
        } else {
            this.setState({showDetails: false})
        }
    }
}



var styles = {
    container: {
        overflow: 'hidden'
        //padding: '10px 0px 10px 0px'
    },
    fullView: {
        float: 'right'
    }
};

FilePreview.contextTypes = {
    muiTheme: React.PropTypes.object
};

FilePreview.propTypes = {
    loading: React.PropTypes.bool,
    details: React.PropTypes.array,
    error: React.PropTypes.string
};


export default FilePreview;

