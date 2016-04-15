import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';

class ErrorModal extends React.Component {

    render() {
        const actions = [
            <FlatButton
                label="Exit"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)}/>
        ];

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    title="We're sorry, it looks like you don't have permission to access this feature at this time."
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={actions}
                    open={this.props.errorModal}
                    onRequestClose={this.handleClose.bind(this)}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <p>Contact the project manager or system administrator to request access.</p>
                </Dialog>
            </div>
        );
    }

    handleClose() {
        ProjectActions.closeErrorModal();
        //this.props.appRouter.transitionTo('/home');
    };
}

let styles = {
    batchOpsButton: {
        marginRight: -10
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9996'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

ErrorModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default ErrorModal;

