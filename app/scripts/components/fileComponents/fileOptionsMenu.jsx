import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';

class FileOptionsMenu extends React.Component {

    constructor() {
        this.state = {
            deleteOpen: false,
            editOpen: false,
            floatingErrorText: 'This field is required.'
        }
    }

    render() {
        let deleteActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)} />,
            <FlatButton
                label="DELETE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleDeleteButton.bind(this)} />
        ];
        let editActions = [
            <FlatButton
                label="CANCEL"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)} />,
            <FlatButton
                label="UPDATE"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleUpdateButton.bind(this)} />
        ];
        let fileName = this.props.entityObj ? this.props.entityObj.name : null;

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    title="Are you sure you want to delete this file?"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={deleteActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.deleteOpen}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    title="Update File Name"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={editActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={this.state.editOpen}>
                    <form action="#" id="editFileForm">
                        <TextField
                            style={styles.textStyles}
                            hintText="Project Name"
                            defaultValue={fileName}
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="File Name"
                            id="fileNameText"
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingErrorInputChange.bind(this)}/> <br/>
                    </form>
                </Dialog>
                <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Delete File" leftIcon={<i className="material-icons">delete</i>} onTouchTap={this.handleTouchTapDelete.bind(this)}/>
                    <MenuItem primaryText="Edit File" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={this.handleTouchTapEdit.bind(this)}/>
                </IconMenu>
            </div>
        );
    };

    handleTouchTapDelete() {
        this.setState({deleteOpen:true})
    };

    handleTouchTapEdit() {
        this.setState({editOpen:true})
    };

    handleDeleteButton() {
        let id = this.props.params.id;
        let parentId = this.props.entityObj ? this.props.entityObj.parent.id : null;
        let parentKind = this.props.entityObj ? this.props.entityObj.parent.kind : null;
        let urlPath = '';
        {parentKind === 'dds-project' ? urlPath = '/project/' : urlPath = '/folder/'}
        ProjectActions.deleteFile(id, parentId, parentKind);
        this.setState({deleteOpen:false});
        setTimeout(()=>this.props.appRouter.transitionTo(urlPath + parentId),500)
    };


    handleUpdateButton() {
        let id = this.props.params.id;
        let  fileName = document.getElementById("fileNameText").value;
        if (this.state.floatingErrorText != '') {
            return null
        } else {
            ProjectActions.editFile(id, fileName);
            this.setState({
                editOpen:false,
                floatingErrorText: 'This field is required.'
            });
        }
    };

    handleFloatingErrorInputChange(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    };

    handleClose() {
        this.setState({
            deleteOpen: false,
            editOpen: false,
            floatingErrorText: 'This field is required.'
        });
    };
}
var styles = {
    deleteFile: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
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

export default FileOptionsMenu;