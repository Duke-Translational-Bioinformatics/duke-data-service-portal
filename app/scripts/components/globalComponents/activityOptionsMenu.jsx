import React from 'react';
import PropTypes from 'prop-types';
const { object } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

@observer
class ActivityOptionsMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deleteOpen: false,
            editOpen: false,
            floatingErrorText: '',
            floatingErrorText2: ''
        }
    }

    render() {
        const { screenSize, toggleModal } = mainStore;
        const { activity } = provenanceStore;
        const dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        const id = activity !== null ? activity.id : null;
        const name = activity !== null ? activity.name : null;
        const description = activity !== null ? activity.description : null;
        const menu = <IconMenu
                    iconButtonElement={<IconButton iconClassName="material-icons" style={{marginRight: -10}}>more_vert</IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Delete Activity" leftIcon={<i className="material-icons">delete</i>}
                              onTouchTap={() => this.toggleModal('dltActivity')}/>
                    <MenuItem primaryText="Edit Activity Details"
                              leftIcon={<i className="material-icons">mode_edit</i>}
                              onTouchTap={() => this.toggleModal('editActivity')}/>
                </IconMenu>;

        const deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.toggleModal('dltActivity')}/>,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleDeleteButton(id, name)}/>
        ];

        const editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.toggleModal('editActivity')}/>,
            <FlatButton
                label="UPDATE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleUpdateButton(id)}/>
        ];

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Are you sure you want to delete this activity?"
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    onRequestClose={() => this.toggleModal('dltActivity')}
                    open={toggleModal && toggleModal.id === 'dltActivity' ? toggleModal.open : false}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Edit Activity Details"
                    autoDetectWindowHeight={true}
                    actions={editActions}
                    onRequestClose={() => this.toggleModal('editActivity')}
                    open={toggleModal && toggleModal.id === 'editActivity' ? toggleModal.open : false}>
                    <form action="#" id="editActivityForm">
                        <TextField
                            style={styles.textStyles}
                            autoFocus={true}
                            onFocus={()=>this.selectText()}
                            hintText="Activity Name"
                            defaultValue={name}
                            errorText={this.state.floatingErrorText}
                            ref={(input) => this.nameInput = input}
                            floatingLabelText="Activity Name"
                            type="text"
                            multiLine={true}
                            onChange={(e)=>this.validateText(e)}/> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Activity Description"
                            defaultValue={description}
                            errorText={this.state.floatingErrorText2}
                            ref={(input) => this.descriptionInput = input}
                            floatingLabelText="Activity Description"
                            type="text"
                            multiLine={true}
                            onChange={(e)=>this.validateText(e)}/>
                    </form>
                </Dialog>
                { menu }
            </div>
        );
    }

    handleDeleteButton(id, name) {
        provenanceStore.deleteProvActivity(id, name);
        this.toggleModal('dltActivity');
        this.props.router.goBack();
    }


    handleUpdateButton(id) {
        const prevName = provenanceStore.activity.name;
        const name = this.nameInput.getValue();
        const description = this.descriptionInput.getValue();
        if (this.state.floatingErrorText2 !== '' && this.state.floatingErrorText !== '') {
            return null
        } else {
            provenanceStore.editProvActivity(id, name, description, prevName);
            this.toggleModal('editActivity');
        }
    }

    selectText() {
        setTimeout(()=>this.nameInput.select(),100);
    }

    validateText(e) {
        const name = this.nameInput.getValue();
        const description = this.descriptionInput.getValue();
        this.setState({
            floatingErrorText: name.length ? '' : 'This field is required.',
            floatingErrorText2: description.length ? '' : 'This field is required.'
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

ActivityOptionsMenu.propTypes = {
    activity: object,
    toggleModal: object,
    screenSize: object
};

export default ActivityOptionsMenu;