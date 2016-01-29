import React from 'react';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import Tooltip from '../../../util/tooltip.js';

const RaisedButton = require('material-ui/lib/raised-button');
let mui = require('material-ui'),
    TextField = mui.TextField,
    Snackbar = mui.Snackbar,
    Dialog = mui.Dialog;

class UploadModal extends React.Component {

    render() {

        let standardActions = [
            {text: 'Upload', onTouchTap: this.handleUploadButton.bind(this)},
            {text: 'Cancel'}
        ];
        let standardActionsWarn = [
            {text: 'Cancel'}
        ];

        Tooltip.bindEvents();

        return (
            <div style={styles.fileUpload}>
                <button
                    title="Upload File"
                    rel="tooltip"
                    className='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored'
                    style={styles.floatingButton}
                    onTouchTap={this.handleTouchTap.bind(this)}>
                    <i className='material-icons'>file_upload</i>
                </button>
                <div id="tooltip"></div>
                <Dialog
                    style={styles.dialogStyles}
                    title='Upload Files'
                    actions={standardActions}
                    ref='fileU'>
                    <form action='#' id='newFileForm'>
                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--file">
                            <input className="mdl-textfield__input" placeholder="File" type="text" id="uploadFile" readOnly/>
                            <div className="mdl-button mdl-button--primary mdl-button--icon mdl-button--file">
                                <i className="material-icons">attach_file</i>
                                <input type='file' id="uploadBtn" ref='fileUpload' onChange={this.handleFileName.bind(this)}/>
                            </div>
                        </div>

                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title='File exceeds size limit for the current Alpha version of Duke Data Service'
                    actions={standardActionsWarn}
                    ref='fileWarn'>
                    <i className="material-icons" style={styles.warning}>announcement</i>
                    <p style={styles.msg}>Please compress this file into a .zip format before uploading. <br/>We apologize for the inconvenience.</p>
                </Dialog>
            </div>
        );
    }

    handleTouchTap() {
        this.refs.fileU.show();
    }

    handleUploadButton() {
        if (document.getElementById("uploadFile").value) {
            let projId = '';
            let parentKind = '';
            if (!this.props.entityObj) {
                projId = this.props.params.id;
                parentKind = 'dds-project';
            } else {
                projId = this.props.entityObj ? this.props.entityObj.ancestors[0].id : null;
                parentKind = this.props.entityObj ? this.props.entityObj.kind : null;
            }
            let parentId = this.props.params.id;
            let blob = document.getElementById('uploadBtn').files[0];
            if(blob.size > 1073741824 * 3.5){
                this.refs.fileWarn.show();
            }else{
                ProjectActions.startUpload(projId, blob, parentId, parentKind);
                this.refs.fileU.dismiss();
            }
        } else {
            return null
        }
    }

    handleFileName() {
        document.getElementById('uploadFile').value = document.getElementById('uploadBtn').files[0].name;
    }
}

var styles = {
    fileUpload: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    dialogStyles: {
        zIndex: '9996',
        textAlign: 'center',
        fontColor: '#303F9F'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    },
    floatingButton: {
        position: 'absolute',
        top: -42,
        marginRight: 17,
        right: '2%',
        zIndex: '2',
        color: '#ffffff'
    },
    msg: {
        textAlign: 'center',
        marginLeft: 30
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#FFEB3B'
    }
};

UploadModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default UploadModal;

