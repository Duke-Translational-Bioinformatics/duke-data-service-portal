import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

class VersionsOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            deleteOpen: false,
            editOpen: false,
            floatingErrorText: 'This field is required.'
        }
    }

    render() {
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        let menu = null;
        if (prjPrm !== null) {
            if(prjPrm === 'viewOnly' || prjPrm === 'flDownload'){
                menu = <MenuItem primaryText="Provenance" leftIcon={<i className="material-icons">device_hub</i>}
                                 onTouchTap={() => this.openProv()}/>;
            }
            if (prjPrm === 'flUpload') {
                menu = <span>
                        <MenuItem primaryText="Edit Version Label" leftIcon={<i className="material-icons">mode_edit</i>}
                                     onTouchTap={this.handleTouchTapEdit.bind(this)}/>
                        <MenuItem primaryText="Provenance" leftIcon={<i className="material-icons">device_hub</i>}
                                  onTouchTap={() => this.openProv()}/>
                </span>;
            }
            if (prjPrm === 'prjCrud' || prjPrm === 'flCrud') {
                menu = <span>
                        <MenuItem primaryText="Delete Version" leftIcon={<i className="material-icons">delete</i>}
                                  onTouchTap={this.handleTouchTapDelete.bind(this)}/>
                        <MenuItem primaryText="Edit Version Label"
                                  leftIcon={<i className="material-icons">mode_edit</i>}
                                  onTouchTap={this.handleTouchTapEdit.bind(this)}/>
                        <MenuItem primaryText="Provenance" leftIcon={<i className="material-icons">device_hub</i>}
                               onTouchTap={() => this.openProv()}/>
                </span>;
            }
        }
        const deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)}/>,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleDeleteButton.bind(this)}/>
        ];
        const editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)}/>,
            <FlatButton
                label="UPDATE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleUpdateButton.bind(this)}/>
        ];

        let labelText = this.props.entityObj ? this.props.entityObj.label : null;

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={this.props.screenSize.width < 580 ? {width: '100%'} : {}}
                    title="Are you sure you want to delete this file version?"
                    autoDetectWindowHeight={true}
                    actions={deleteActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.deleteOpen}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={this.props.screenSize.width < 580 ? {width: '100%'} : {}}
                    title="Update Version Label"
                    autoDetectWindowHeight={true}
                    actions={editActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.editOpen}>
                    <form action="#" id="editVersionForm">
                        <TextField
                            style={styles.textStyles}
                            autoFocus={true}
                            onFocus={()=>this.selectText()}
                            hintText="Version Label"
                            defaultValue={labelText}
                            errorText={this.state.floatingErrorText}
                            ref={(input) => this.versionLabelText = input}
                            floatingLabelText="Version Label"
                            type="text"
                            multiLine={true}
                            onChange={(e)=>this.validateText(e)}/> <br/>
                    </form>
                </Dialog>
                <IconMenu {...this.props}
                    iconButtonElement={<IconButton iconClassName="material-icons" style={{marginRight: -10}}>more_vert</IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    { menu }
                </IconMenu>
            </div>
        );
    }

    handleTouchTapDelete() {
        this.setState({deleteOpen: true})
    }

    handleTouchTapEdit() {
        this.setState({editOpen: true})
    }

    handleDeleteButton() {
        let id = this.props.params.id;
        let parentId = this.props.entityObj ? this.props.entityObj.file.id : null;
        ProjectActions.deleteVersion(id);
        this.setState({deleteOpen: false});
        setTimeout(()=>this.props.appRouter.transitionTo('/file' + '/' + parentId), 500)
    }


    handleUpdateButton() {
        let id = this.props.params.id;
        let label = this.versionLabelText.getValue();
        if (this.state.floatingErrorText != '') {
            return null
        } else {
            ProjectActions.editVersion(id, label);
            this.setState({
                editOpen: false,
                floatingErrorText: 'This field is required.'
            });
        }
    }

    handleClose() {
        this.setState({
            deleteOpen: false,
            editOpen: false,
            floatingErrorText: 'This field is required.'
        });
    }

    openProv() {
        let fileId = this.props.entityObj && this.props.entityObj.file ? this.props.entityObj.file.id : null;
        ProjectActions.getFileVersions(fileId);
        ProjectActions.toggleProvView();
    }

    selectText() {
        setTimeout(()=>this.versionLabelText.select(),100);
    }

    validateText(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    }
}
var styles = {
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

export default VersionsOptionsMenu;