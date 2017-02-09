import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

class FolderOptionsMenu extends React.Component {

    render() {
        return (
            <div>
                <IconMenu
                    iconButtonElement={<IconButton iconClassName="material-icons" onTouchTap={this.props.clickHandler}>more_vert</IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Delete Folder" leftIcon={<i className="material-icons">delete</i>} onTouchTap={() => this.toggleModal('dltFolder')}/>
                    <MenuItem primaryText="Edit Folder Name" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={() => this.toggleModal('editFolder')}/>
                    <MenuItem primaryText="Move Folder" leftIcon={<i className="material-icons">low_priority</i>} onTouchTap={() => this.moveFolder()}/>
                </IconMenu>
            </div>
        );
    }

    moveFolder() {
        let id = this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.entityObj.id;
        let kind = 'folders';
        let requester = 'optionsMenu'; // Use this to only set parent in store once.
        ProjectActions.getEntity(id, kind, requester);
        ProjectActions.toggleModals('moveFolder');
    }

    toggleModal(id) {
        ProjectActions.toggleModals(id);
    }
}

export default FolderOptionsMenu;