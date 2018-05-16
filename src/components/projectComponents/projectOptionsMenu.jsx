import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
const { object } = PropTypes;

@observer
class ProjectOptionsMenu extends React.Component {

    render() {
        return (
            <IconMenu iconButtonElement={<IconButton iconClassName="material-icons" onTouchTap={this.props.clickHandler}>more_vert</IconButton>}
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                <MenuItem primaryText="Edit Project Details" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={() => this.toggleModal('editOpen')}/>
                <MenuItem primaryText="Add Project Members" leftIcon={<i className="material-icons">person_add</i>} onTouchTap={() => this.toggleTeamManager()}/>
                <MenuItem primaryText="Delete Project" leftIcon={<i className="material-icons">delete</i>} onTouchTap={() => this.toggleModal('deleteOpen')}/>
            </IconMenu>
        );
    }

    toggleModal(id) {
        mainStore.toggleModals(id);
    }

    toggleTeamManager() {
        mainStore.toggleTeamManager()
    }
}

ProjectOptionsMenu.propTypes = {
    project: object
};

export default ProjectOptionsMenu;