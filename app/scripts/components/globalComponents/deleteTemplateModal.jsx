import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BaseUtils from '../../../util/baseUtils'
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

class DeleteTemplateModal extends React.Component {

    render() {
        let open = this.props.toggleModal && this.props.toggleModal.id === 'dltTemplate' ? this.props.toggleModal.open : false;
        let templateId = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.id : null;
        let templateLabel = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.label : null;
        const actions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.deleteTemplate(templateId, templateLabel)} />
        ];
        return (
            <Dialog
                style={styles.dialogStyles}
                contentStyle={this.props.screenSize.width < 580 ? {width: '100%'} : {}}
                title="Are you sure you want to delete this template?"
                autoDetectWindowHeight={true}
                actions={actions}
                onRequestClose={this.handleClose.bind(this)}
                open={open}>
                <i className="material-icons" style={styles.warning}>warning</i>
                <p style={styles.msg}>If you are not the creator of {templateLabel}, or if it's currently associated with any files then {templateLabel} can not be deleted.</p>
            </Dialog>
        )
    }

    deleteTemplate(id,label) {
            ProjectActions. deleteTemplate(id, label);
            ProjectActions.toggleModals();
    };

    handleClose() {
        ProjectActions.toggleModals();
    };
}

var styles = {
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    msg: {
        textAlign: 'left',
        marginLeft: 30
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

DeleteTemplateModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

DeleteTemplateModal.propTypes = {
    loading: React.PropTypes.bool,
    error: React.PropTypes.object
};

export default DeleteTemplateModal;