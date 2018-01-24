import React from 'react';
import PropTypes from 'prop-types';
const { object } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

@observer
class DeleteTemplateModal extends React.Component {

    render() {
        const { metadataTemplate, screenSize, toggleModal } = mainStore;
        let templateId = metadataTemplate && metadataTemplate !== null ? metadataTemplate.id : null;
        let templateLabel = metadataTemplate && metadataTemplate !== null ? metadataTemplate.label : null;
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
                contentStyle={screenSize.width < 580 ? {width: '100%'} : {}}
                title="Are you sure you want to delete this template?"
                autoDetectWindowHeight={true}
                actions={actions}
                onRequestClose={() => this.handleClose()}
                open={toggleModal && toggleModal.id === 'dltTemplate' ? toggleModal.open : false}>
                <i className="material-icons" style={styles.warning}>warning</i>
                <p style={styles.msg}>If you are not the creator of {templateLabel}, or if it's currently associated with any files then {templateLabel} can not be deleted.</p>
            </Dialog>
        )
    }

    deleteTemplate(id,label) {
            mainStore. deleteTemplate(id, label);
            mainStore.toggleModals();
    };

    handleClose() {
        mainStore.toggleModals();
    };
}

const styles = {
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

DeleteTemplateModal.propTypes = {
    metadataTemplate: object,
    screenSize: object,
    toggleModal: object
};

export default DeleteTemplateModal;