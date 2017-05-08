import React, { PropTypes } from 'react';
const { object } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Path } from '../../util/urlEnum';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

@observer
class FolderOptionsMenu extends React.Component {

    render() {
        const {entityObj, filesChecked, foldersChecked, selectedEntity} = mainStore;
        let id = selectedEntity !== null ? selectedEntity.id : entityObj !== null ? entityObj.id : null;
        return (
            <div>
                <IconMenu
                    iconButtonElement={<IconButton disabled={!!(filesChecked.length || foldersChecked.length)} iconClassName="material-icons" onTouchTap={this.props.clickHandler}>more_vert</IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Edit Folder Name" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={() => this.toggleModal('editFolder')}/>
                    <MenuItem primaryText="Move Folder" leftIcon={<i className="material-icons">low_priority</i>} onTouchTap={() => this.moveFolder(id)}/>
                    <MenuItem primaryText="Delete Folder" leftIcon={<i className="material-icons">delete</i>} onTouchTap={() => this.toggleModal('dltFolder')}/>
                </IconMenu>
            </div>
        );
    }

    moveFolder(id) {
        let requester = 'optionsMenu';
        mainStore.getEntity(id, Path.FOLDER, requester);
        mainStore.toggleModals('moveFolder');
    }

    toggleModal(id) {
        mainStore.toggleModals(id);
    }
}

FolderOptionsMenu.propTypes = {
    entityObj: object,
    selectedEntity: object
};

export default FolderOptionsMenu;