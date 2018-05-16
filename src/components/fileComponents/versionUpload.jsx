import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Color } from '../../theme/customTheme';
import mainStore from '../../stores/mainStore';
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
const { object } = PropTypes;

@observer
class VersionUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            files: ''
        }
    }

    render() {
        const { entityObj, toggleModal, screenSize, selectedEntity } = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let fileId = selectedEntity !== null ? selectedEntity.id : entityObj !== null ? entityObj.id : null;
        let parentId = selectedEntity !== null ?  selectedEntity.parent.id : entityObj !== null && entityObj.parent ? entityObj.parent.id : null;
        let projectId = entityObj && entityObj.ancestors ? entityObj.ancestors[0].id : selectedEntity !== null ? selectedEntity.ancestors[0].id : null;
        let parentKind = entityObj && entityObj.parent ? entityObj.parent.kind : selectedEntity !== null ? selectedEntity.parent.kind : null;

        let standardActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="Submit"
                secondary={true}
                onTouchTap={() => this.handleUploadButton(fileId, parentId, projectId, parentKind)} />
        ];
        return (
            <div style={styles.fileUpload}>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title='Upload New Version'
                    autoDetectWindowHeight={true}
                    actions={standardActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={toggleModal && toggleModal.id === 'newVersionModal' ? toggleModal.open : false}>
                        <div className="mdl-cell mdl-cell--6-col" style={styles.form}>
                            <RaisedButton
                                secondary={true}
                                label="Select a File"
                                labelPosition="before"
                                style={styles.inputButton.btn}
                                labelStyle={styles.inputButton.btn.label}
                                containerElement="label"
                                icon={<FileUpload color={Color.white} />}
                            >
                                <input ref={(input) => this.fileInput = input} type="file" style={styles.inputButton} onChange={this.handleFileName.bind(this)} />
                            </RaisedButton>
                            <TextField
                                style={{opacity: this.state.files.length ? 1 : 0, textAlign: 'left', height: this.state.files.length ? 0 : 'auto', width: '100%'}}
                                value={this.state.files}
                                hintText="Files"
                                floatingLabelText="Preparing to upload"
                                floatingLabelFocusStyle={{color: Color.blue}}
                                floatingLabelStyle={{color: Color.blue}}
                                ref={(input) => this.fileList = input}
                                multiLine={true}/>
                            <TextField
                                style={styles.textStyles}
                                hintText="Optional Label"
                                floatingLabelStyle={styles.hintLabel}
                                floatingLabelText="Optional Label"
                                ref={(input) => this.labelText = input}
                                type="text"
                                multiLine={true}/> <br/>
                        </div>
                </Dialog>
            </div>
        );
    }

    handleUploadButton(fileId, parentId, projectId, parentKind) {
        if (this.fileInput.value) {
            let fileList = this.fileInput.files;
            for (var i = 0; i < fileList.length; i++) {
                let blob = fileList[i];
                let label = this.labelText.getValue();
                mainStore.startUpload(projectId, blob, parentId, parentKind, label, fileId);
                mainStore.toggleModals('newVersionModal');
                this.setState({
                    files: ''
                })
            }
        } else {
            return null
        }
    }

    handleFileName() {
        let fileList = [];
        for (let i = 0; i < this.fileInput.files.length; i++) {
            fileList.push(this.fileInput.files[i].name);
            fileList = fileList.toString().split(',').join(', ');
        }
        this.fileList.value = 'Preparing to upload: ' + fileList;
        this.setState({files: fileList})
    }

    handleClose() {
        mainStore.toggleModals('newVersionModal');
    }
}

const styles = {
    form: {
        margin: '0px auto'
    },
    fileUpload: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    dialogStyles: {
        zIndex: '9996',
        textAlign: 'center',
        fontColor: Color.blue
    },
    hintLabel: {
        color: Color.dkGrey
    },
    inputButton: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
        btn: {
            width: '100%',
            label: {
                fontWeight: 100
            }
        }
    },
    textStyles: {
        width: '100%',
        minWidth: '48%',
        textAlign: 'left'
    }
};

VersionUpload.propTypes = {
    entityObj: object,
    toggleModal: object,
    screenSize: object,
    selectedEntity: object
};

export default VersionUpload;