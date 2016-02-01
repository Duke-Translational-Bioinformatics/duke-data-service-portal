import React from 'react';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import Tooltip from '../../../util/tooltip.js';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

class UploadModal extends React.Component {
    constructor() {
        this.state = {
            open: false,
            warnOpen: false
        }
    }

    render() {
        let standardActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)} />,
            <FlatButton
                label="Submit"
                secondary={true}
                onTouchTap={this.handleUploadButton.bind(this)} />
        ];
        let warnActions = [
            <FlatButton
                label="Okay"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)} />,
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
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={standardActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.open}>
                    <form action='#' id='newFileForm'>
                        <div className="mdl-textfield mdl-textfield--file">
                            <input className="mdl-textfield__input" placeholder="File" type="text" id="uploadFile" readOnly/>
                            <div className="mdl-button mdl-button--icon mdl-button--file">
                                <i className="material-icons" style={styles.iconColor}>attach_file</i>
                                <input type='file' id="uploadBtn" ref='fileUpload' onChange={this.handleFileName.bind(this)} multiple/>
                            </div>
                        </div>

                    </form>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title='File exceeds size limit for the current Alpha version of Duke Data Service'
                    actions={warnActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.warnOpen}>
                    <i className="material-icons" style={styles.warning}>announcement</i>
                    <p style={styles.msg}>Please compress this file into a .zip format before uploading. <br/>We apologize for the inconvenience.</p>
                </Dialog>
            </div>
        );
    }

    handleTouchTap() {
        this.setState({open: true});
    }

    handleUploadButton() {
        if (document.getElementById("uploadFile").value) {
            let projId = '';
            let parentKind = '';
            let parentId = this.props.params.id;
            let blob = document.getElementById('uploadBtn').files[0];
            if (!this.props.entityObj) {
                projId = this.props.params.id;
                parentKind = 'dds-project';
            } else {
                projId = this.props.entityObj ? this.props.entityObj.ancestors[0].id : null;
                parentKind = this.props.entityObj ? this.props.entityObj.kind : null;
            }
            if(blob.size > 1073741824 * 3.5){
                this.setState({warnOpen: true});
            }else{
                ProjectActions.startUpload(projId, blob, parentId, parentKind);
                this.setState({open: false});
            }
        } else {
            return null
        }
    }

    handleFileName() {
        document.getElementById('uploadFile').value = document.getElementById('uploadBtn').files[0].name;
    }

    handleClose() {
        this.setState({
            open: false,
            warnOpen: false
        });
    }
}

var styles = {
    fileUpload: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    iconColor: {
        color: '#235F9C'
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