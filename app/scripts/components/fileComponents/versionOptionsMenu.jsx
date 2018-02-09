import React from 'react';
import PropTypes from 'prop-types';
const { object, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import { Roles } from '../../enum';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

@observer
class VersionsOptionsMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deleteOpen: false,
            editOpen: false,
            floatingErrorText: ''
        }
    }

    render() {
        const { entityObj, projectRole, screenSize, toggleModal } = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let fileId = mainStore.entityObj && mainStore.entityObj.file ? mainStore.entityObj.file.id : null;
        let id = this.props.params.id;

        const deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.toggleModal('dltVersion')}/>,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleDeleteButton(id, fileId)}/>
        ];
        
        const editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.toggleModal('editVersion')}/>,
            <FlatButton
                label="UPDATE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleUpdateButton(id, fileId)}/>
        ];
        
        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Are you sure you want to delete this file version?"
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    onRequestClose={() => this.toggleModal('dltVersion')}
                    open={toggleModal && toggleModal.id === 'dltVersion' ? toggleModal.open : false}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Update Version Label"
                    autoDetectWindowHeight={true}
                    actions={editActions}
                    onRequestClose={() => this.toggleModal('editVersion')}
                    open={toggleModal && toggleModal.id === 'editVersion' ? toggleModal.open : false}>
                    <form action="#" id="editVersionForm">
                        <TextField
                            style={styles.textStyles}
                            autoFocus={true}
                            onFocus={()=>this.selectText()}
                            hintText="Version Label"
                            defaultValue={entityObj ? entityObj.label : ''}
                            errorText={this.state.floatingErrorText}
                            ref={(input) => this.versionLabelText = input}
                            floatingLabelText="Version Label"
                            type="text"
                            multiLine={true}
                            onChange={(e)=>this.validateText(e)}/> <br/>
                    </form>
                </Dialog>
                { <IconMenu
                    iconButtonElement={<IconButton iconClassName="material-icons" style={{marginRight: -10}}>more_vert</IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    { projectRole === Roles.project_admin || projectRole === Roles.file_editor || projectRole === Roles.system_admin ? <MenuItem primaryText="Delete Version" leftIcon={<i className="material-icons">delete</i>}
                              onTouchTap={() => this.toggleModal('dltVersion')}/> : null }
                    { projectRole !== Roles.project_viewer && projectRole !== Roles.file_downloader ? <MenuItem primaryText="Edit Version Label"
                              leftIcon={<i className="material-icons">mode_edit</i>}
                              onTouchTap={() => this.toggleModal('editVersion')}/> : null }
                    <MenuItem primaryText="Provenance" leftIcon={<i className="material-icons">device_hub</i>}
                              onTouchTap={() => this.openProv(id, fileId)}/>
                </IconMenu> }
            </div>
        );
    }

    handleDeleteButton(id, fileId) {
        mainStore.deleteVersion(id);
        this.toggleModal('dltVersion');
        setTimeout(()=>this.props.router.push('/file' + '/' + fileId), 500)
    }


    handleUpdateButton(id) {
        let label = this.versionLabelText.getValue();
        if (this.state.floatingErrorText !== '') {
            return null
        } else {
            mainStore.editVersionLabel(id, label);
            this.toggleModal('editVersion');
        }
    }

    openProv(id, fileId) {
        if(!provenanceStore.provNodes.length) provenanceStore.getWasGeneratedByNode(id);
        mainStore.getFileVersions(fileId);
        provenanceStore.toggleProvView();
    }

    selectText() {
        setTimeout(()=>this.versionLabelText.select(),100);
    }

    validateText(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    }

    toggleModal(id) {
        mainStore.toggleModals(id)
    }
}
const styles = {
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9999'
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

VersionsOptionsMenu.propTypes = {
    entityObj: object,
    toggleModal: object,
    screenSize: object,
    projectRole: string
};

export default VersionsOptionsMenu;