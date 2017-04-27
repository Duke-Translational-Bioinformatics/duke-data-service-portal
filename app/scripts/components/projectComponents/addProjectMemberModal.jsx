import React, { PropTypes } from 'react';
const { object, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import authStore from '../../stores/authStore';
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

@observer
class AddProjectMemberModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorText: null,
            floatingErrorText: '',
            value: null
        }
        this.search = _.debounce(this.search ,500);
    }

    componentDidUpdate() {
        if(mainStore.toggleModal.open && mainStore.toggleModal.id === 'addMember') setTimeout(()=>this.fullName.focus(), 300);
    }

    render() {
        const { currentUser, screenSize, toggleModal, users } = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let userName = currentUser ? currentUser.full_name : null;
        let id = this.props.params.id;
        let autoCompleteData = users.map((user)=>{
            return {text: user.full_name, value: user.full_name, id: user.uid}
        });

        let memberActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={() => this.toggleModal()} />,
            <FlatButton
                label="ADD"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleMemberButton(userName, id)} />
        ];

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Add Project Member"
                    autoDetectWindowHeight={true}
                    actions={memberActions}
                    onRequestClose={() => this.toggleModal()}
                    open={toggleModal && toggleModal.id === 'addMember' ? toggleModal.open : false}>
                    <form action="#" id="newMemberForm">
                        {mainStore.drawerLoading ? <CircularProgress size={50} thickness={4} style={styles.loading}/> : null}
                        <AutoComplete
                            style={{textAlign: 'left'}}
                            ref={(input) => this.fullName = input}
                            floatingLabelText="Name"
                            filter={AutoComplete.caseInsensitiveFilter}
                            dataSource={autoCompleteData}
                            errorText={this.state.floatingErrorText}
                            maxSearchResults={7}
                            onNewRequest={(value, e) => this.chooseUser(value, e)}
                            onUpdateInput={() => this.search()}/><br/>
                        <SelectField value={this.state.value}
                                     onChange={this.handleSelectValueChange.bind(this, 'value')}
                                     floatingLabelText="Project Role"
                                     floatingLabelStyle={{color: '#235f9c'}}
                                     errorText={this.state.errorText}
                                     errorStyle={styles.textStyles}
                                     style={styles.textStyles}>
                            <MenuItem value={0} primaryText='Project Administrator'/>
                            <MenuItem value={1} primaryText='Project Viewer'/>
                            <MenuItem value={2} primaryText='File Downloader'/>
                            <MenuItem value={3} primaryText='File Uploader'/>
                            <MenuItem value={4} primaryText='File Editor'/>
                        </SelectField><br/>
                    </form>
                </Dialog>
            </div>
        );
    }

    chooseUser(value, e) {
        if(e === -1) return false;
        let id = value.id;
        mainStore.registerNewUser(id);
    }

    handleSelectValueChange (event, index, value) {
        this.setState({
            value,
            errorText: null
        });
    };

    search() {
        let value = this.fullName.state.searchText;
        let authId = authStore.appConfig.authServiceId;
        if (!value.indexOf(' ') <= 0) {
            mainStore.getUserNameFromAuthProvider(value, authId);
            this.setState({floatingErrorText: value ? '' : 'This field is required'});
        }
    }

    handleMemberButton(userName, id) {
        let  fullName = this.fullName.state.searchText;
        let role = null;
        switch(this.state.value){
            case 0:
                role = 'project_admin';
                break;
            case 1:
                role = 'project_viewer';
                break;
            case 2:
                role = 'file_downloader';
                break;
            case 3:
                role = 'file_uploader';
                break;
            case 4:
                role = 'file_editor';
                break;
        }
        if (this.state.floatingErrorText != '' || this.state.value === null) {
            this.setState({errorText: 'Select a project role'});
            return null
        }
        if(userName === fullName){
            this.setState({floatingErrorText: "You can't add yourself or change your role"});
            return null
        }
        else {
            mainStore.getUserId(fullName, id, role);
            this.toggleModal();
            this.setState({value: null});
        }
    };

    toggleModal() {
        mainStore.toggleModals('addMember');
        this.setState({
            errorText: null,
            value: null
        });
    };
}

const styles = {
    dialogStyles: {
        textAlign: 'center',
        zIndex: '5000'
    },
    loading: {
        position: 'absolute',
        margin: '-10px auto',
        left: 0,
        right: 0
    },
    textStyles: {
        textAlign: 'left'
    }
};

AddProjectMemberModal.contextTypes = {
    muiTheme: object
};

AddProjectMemberModal.propTypes = {
    screenSize: object,
    currentUser: object,
    users: array,
};

export default AddProjectMemberModal;