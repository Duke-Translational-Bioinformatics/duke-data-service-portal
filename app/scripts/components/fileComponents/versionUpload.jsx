import React from 'react';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

import FloatingActionButton from 'material-ui/lib/floating-action-button';

class VersionUpload extends React.Component {

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

        let open = this.props.versionModal ? this.props.versionModal : false;

        return (
            <div style={styles.fileUpload}>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={this.props.screenSize.width < 580 ? {width: '100%'} : {}}
                    title='Upload New Version'
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={standardActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={open}>
                    <form action='#' id='newFileForm'>
                        <div className="mdl-cell mdl-cell--6-col mdl-textfield mdl-textfield--file">
                            <textarea className="mdl-textfield__input mdl-color-text--grey-800" placeholder="File" type="text" id="uploadFile" rows="3"readOnly></textarea>
                            <div className="mdl-button mdl-button--icon mdl-button--file">
                                <i className="material-icons" style={styles.iconColor}>attach_file</i>
                                <input type='file' id="uploadBtn" ref='fileUpload' onChange={this.handleFileName.bind(this)} />
                            </div>
                        </div> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Optional Label"
                            floatingLabelText="Label"
                            id="labelText"
                            type="text"
                            multiLine={true}/> <br/>
                    </form>
                </Dialog>
            </div>
        );
    }

    handleUploadButton() {
        if (document.getElementById("uploadFile").value) {
            let projId = '';
            let parentKind = '';
            let fileId = this.props.entityObj ? this.props.entityObj.id : null;
            let parentId = this.props.entityObj ? this.props.entityObj.parent.id : null;
            let fileList = document.getElementById('uploadBtn').files;
            for (var i = 0; i < fileList.length; i++) {
                let blob = fileList[i];
                let label = document.getElementById('labelText').value;
                projId = this.props.entityObj ? this.props.entityObj.ancestors[0].id : null;
                parentKind = this.props.entityObj ? this.props.entityObj.parent.kind : null;
                ProjectActions.startUpload(projId, blob, parentId, parentKind, label, fileId);
                ProjectActions.closeVersionModal();
            }
        } else {
            return null
        }
    }

    handleFileName() {
        let fList = [];
        let fl = document.getElementById('uploadBtn').files;
        for (var i = 0; i < fl.length; i++) {
            fList.push(fl[i].name);
            var fileList = fList.toString().split(',').join(', ');
        }
        document.getElementById('uploadFile').value = 'Preparing to upload: ' + fileList;
    }

    handleClose() {
        ProjectActions.closeVersionModal();
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
        minWidth: '48%',
        textAlign: 'left',
        fontColor: '#303F9F'
    },
    floatingButton: {
        position: 'absolute',
        top: -50,
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

VersionUpload.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default VersionUpload;