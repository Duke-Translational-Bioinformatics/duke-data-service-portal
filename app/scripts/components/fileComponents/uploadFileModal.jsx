import React from 'react';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';

let mui = require('material-ui'),
    RaisedButton = mui.RaisedButton,
    TextField = mui.TextField,
    Snackbar = mui.Snackbar,
    Dialog = mui.Dialog;

class UploadFileModal extends React.Component {

    constructor() {
        this.state = {
            floatingErrorText: 'This field is required.',
            floatingErrorText2: 'This field is required'
        }
    }

    render() {

        let standardActions = [
            {text: 'Upload', onTouchTap: this.handleFileButton.bind(this)},
            {text: 'Cancel'}
        ];

        return (
            <div style={styles.uploadFile}>
                <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
                        style={styles.uploadFile}
                        onTouchTap={this.handleTouchTap.bind(this)}>
                    ADD FILE
                </button>
                <Dialog
                    style={styles.dialogStyles}
                    title="Upload a File"
                    actions={standardActions}
                    ref="uploadFile">

                </Dialog>
            </div>
        );
    }

    handleTouchTap() {
        this.refs.uploadFile.show();
    };

    handleFileButton() {
        if (this.state.floatingErrorText || this.state.floatingErrorText2) {
            return null
        } else {
            ProjectActions.uploadFile(this.setState({
                floatingErrorText: 'This field is required.',
                floatingErrorText2: 'This field is required'
            }));
            this.refs.uploadFile.dismiss();
        }
    };

    handleFloatingErrorInputChange(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    };

    handleFloatingErrorInputChange2(e) {
        this.setState({
            floatingErrorText2: e.target.value ? '' : 'This field is required.'
        });
    };
}

var styles = {
    uploadFile: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    }
};

UploadFileModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

UploadFileModal.propTypes = {

};

export default UploadFileModal;

