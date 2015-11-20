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
        let standardActions = [
            {text: 'DOWNLOAD', onTouchTap: this.handleDownloadButton.bind(this)},
            {text: 'CANCEL'}
        ];
        return (
            <div className="preview-container mdl-grid" style={styles.container}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                    <div style={styles.listTitle}>
                        <h4>Preview</h4>
                    </div>
                    <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
                            style={styles.fullView}
                            onTouchTap={this.handleTouchTap.bind(this)}>
                        FULL VIEW
                    </button>
                    <Dialog
                        style={styles.dialogStyles}
                        title="Sample File Name"
                        actions={standardActions}
                        ref="showFilePreview"
                        autoDetectWindowHeight={true}
                        autoScrollBodyContent={true}>
                        <img style={{maxWidth: '95%'}} src="http://i.stack.imgur.com/pjtbx.png"/>
                    </Dialog>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-shadow--2dp mdl-color-text--grey-800" style={styles.preview}>
                    <img src="http://i.stack.imgur.com/pjtbx.png" style={styles.image}/>
                </div>
            </div>
        );
    }
    handleTouchTap() {
        this.refs.showFilePreview.show();
    }
    handleDownloadButton() {
        let parent = this.props.params.id;
        if (this.state.floatingErrorText) {
            return null
        } else {
            FolderActions.addFolder(parent,this.setState({
                floatingErrorText: 'This field is required.'
            }));
            this.refs.addFolder.dismiss();
        }
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
    },
    dialogStyles: {
        marginTop: 40
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

