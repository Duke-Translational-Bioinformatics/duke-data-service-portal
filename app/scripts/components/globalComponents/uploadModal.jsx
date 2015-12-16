import React from 'react';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
const RaisedButton = require('material-ui/lib/raised-button');
let mui = require('material-ui'),
    TextField = mui.TextField,
    Snackbar = mui.Snackbar,
    Dialog = mui.Dialog;

class UploadModal extends React.Component {

    constructor() {
        this.state = {}
    }

    render() {

        let standardActions = [
            {text: 'Upload', onTouchTap: this.handleUploadButton.bind(this)},
            {text: 'Cancel'}
        ];
        return (
            <div style={styles.fileUpload}>
                <button
                    id="ub"
                    className='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored'
                    style={styles.floatingButton}
                    onTouchTap={this.handleTouchTap.bind(this)}>
                    <i className='material-icons'>file_upload</i>
                </button>
                <div className="mdl-tooltip" htmlFor="ub">
                    UPLOAD FILES
                </div>
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
                                <input type='file' id="uploadBtn" id='afile' ref='fileUpload' onChange={this.handleFileName.bind(this)}/>
                            </div>
                        </div>

                    </form>
                </Dialog>
            </div>
        );
    }

    handleTouchTap() {
        this.refs.fileU.show();
    }

    handleUploadButton() {
        if (document.getElementById("uploadFile").value) {
            if (!this.props.entityObj) {
                var projId = this.props.params.id
            } else {
                projId = this.props.entityObj ? this.props.entityObj.ancestors[0].id : null;
            }
            let blob = document.getElementById('afile').files[0];
            ProjectActions.startUpload(projId, blob);
            this.refs.fileU.dismiss();
        } else {
            return null
        }
    }

    handleFileName() {
        document.getElementById("uploadFile").value = document.getElementById('afile').files[0].name;
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
    }
};

UploadModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default UploadModal;

