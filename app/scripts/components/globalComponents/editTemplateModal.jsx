import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

@observer
class EditTemplateModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorText: ''
        };
    }

    render() {
        const { metadataTemplate, screenSize, toggleModal } = mainStore;
        let templateDesc = metadataTemplate && metadataTemplate !== null ? metadataTemplate.description : null;
        let templateId = metadataTemplate && metadataTemplate !== null ? metadataTemplate.id : null;
        let templateLabel = metadataTemplate && metadataTemplate !== null ? metadataTemplate.label : null;
        let templateName = metadataTemplate && metadataTemplate !== null ? metadataTemplate.name : null;
        const editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="UPDATE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.editTemplate(templateId)} />
        ];
        return (
            <Dialog
                style={styles.dialogStyles}
                contentStyle={screenSize.width < 580 ? {width: '100%'} : {}}
                title="Edit Template"
                autoDetectWindowHeight={true}
                actions={editActions}
                onRequestClose={() => this.handleClose()}
                open={toggleModal && toggleModal.id === 'editTemplate' ? toggleModal.open : false}>
                <TextField
                    fullWidth={true}
                    ref={(input) => this.templateName = input}
                    disabled={true}
                    underlineDisabledStyle={{display: 'none'}}
                    inputStyle={{color: '#212121'}}
                    defaultValue={templateName}
                    floatingLabelText="Name"/><br/>
                <TextField
                    fullWidth={true}
                    ref={(input) => this.templateLabel = input}
                    autoFocus={true}
                    onFocus={() => this.selectText()}
                    defaultValue={templateLabel}
                    hintText="A readable label for your template"
                    errorText={this.state.errorText}
                    floatingLabelText="Display Label"
                    onChange={(e) => this.validateText(e)}/><br/>
                <TextField
                    fullWidth={true}
                    ref={(input) => this.templateDesc = input}
                    style={{textAlign: 'left'}}
                    defaultValue={templateDesc}
                    hintText="Verbose template description"
                    floatingLabelText="Description"
                    multiLine={true}
                    rows={3}/>
            </Dialog>
        )
    }

    editTemplate(id) {
        let name = this.templateName.getValue();
        let label = this.templateLabel.getValue();
        let desc = this.templateDesc.getValue();
        if(!BaseUtils.validateTemplateName(name)) {
            this.setState({
                errorText: 'Invalid characters or spaces. Name must only consist of alphanumerics and underscores.'
            });
        } else {
            if (name !== '' && label !== '') {
                mainStore. updateMetadataTemplate(id, name, label, desc);
                mainStore.toggleModals();
            }
        }
    }

    handleClose() {
        mainStore.toggleModals();
        this.setState({
            errorText: '',
            errorText2: ''
        });
    }

    selectText() {
        setTimeout(()=>this.templateLabel.select(),100);
    }

    validateText(e) {
        this.setState({
            errorText: e.target.value ? '' : 'This field is required'
        });
    }
}

var styles = {
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    }
};

EditTemplateModal.contextTypes = {
    muiTheme: React.PropTypes.object
};

EditTemplateModal.propTypes = {
    metadataTemplate: object,
    screenSize: object,
    toggleModal: object
};

export default EditTemplateModal;