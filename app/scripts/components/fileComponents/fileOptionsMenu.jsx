import React from 'react';
import PropTypes from 'prop-types';
const { object, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import { Kind, Path } from '../../util/urlEnum';
import { Roles } from '../../enum';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

@observer
class FileOptionsMenu extends React.Component {

    render() {
        const { entityObj, filesChecked, foldersChecked, projectRole, selectedEntity } = mainStore;
        let id = selectedEntity !== null ? selectedEntity.id : entityObj !== null ? entityObj.id : null;
        let versionId = selectedEntity !== null && selectedEntity.current_version ? selectedEntity.current_version.id : entityObj !== null && entityObj.current_version ? entityObj.current_version.id : null;

        return (
            <span>
                { <IconMenu
                    iconButtonElement={<IconButton disabled={!!(filesChecked.length || foldersChecked.length)} iconClassName="material-icons" onTouchTap={this.props.clickHandler}>more_vert</IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    {projectRole !== Roles.project_viewer && projectRole !== Roles.file_downloader ? <MenuItem primaryText="Edit File Name" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={() => this.toggleModal('editFile')}/> : null}
                    {projectRole !== Roles.project_viewer && projectRole !== Roles.file_downloader ? <MenuItem primaryText="Move File" leftIcon={<i className="material-icons">low_priority</i>} onTouchTap={() => this.moveFile(id)}/> : null}
                    {projectRole !== Roles.project_viewer && projectRole !== Roles.file_downloader && projectRole !== Roles.file_uploader ? <MenuItem primaryText="Delete File" leftIcon={<i className="material-icons">delete</i>} onTouchTap={() => this.toggleModal('dltFile')}/> : null}
                    {projectRole !== Roles.project_viewer && projectRole !== Roles.file_downloader && projectRole !== Roles.file_uploader ? <Divider/> : null }
                    {projectRole !== Roles.project_viewer && projectRole !== Roles.file_uploader ? <MenuItem primaryText="Download File" leftIcon={<i className="material-icons">file_download</i>} onTouchTap={() => this.handleDownload(id)}/> : null}
                    {projectRole !== Roles.project_viewer && projectRole !== Roles.file_downloader ? <MenuItem primaryText="Upload New Version" leftIcon={<i className="material-icons">file_upload</i>} onTouchTap={() => this.toggleModal('newVersionModal')}/> : null}
                    <Divider/>
                    {projectRole !== Roles.project_viewer && projectRole !== Roles.file_downloader ? <MenuItem primaryText="Add Tags" leftIcon={<i className="material-icons">local_offer</i>} onTouchTap={() => this.openTagManager(id)}/> : null}
                    <MenuItem primaryText="Edit Provenance" leftIcon={<i className="material-icons">device_hub</i>} onTouchTap={() => this.toggleProv(id, versionId)}/>
                </IconMenu> }
            </span>
        );
    };


    handleDownload(id) {
        mainStore.getDownloadUrl(id, Path.FILE);
    }

    moveFile(id) {
        let requester = 'optionsMenu';
        mainStore.getEntity(id, Path.FILE, requester);
        mainStore.toggleModals('moveItem');
    }

    toggleModal(id) {
        mainStore.toggleModals(id);
    }

    toggleProv(id, versionId) {
        const { currentGraph } = provenanceStore;
        let projId = this.props.router.location.pathname.includes('project') ? this.props.params.id : mainStore.entityObj.ancestors[0].id;
        mainStore.searchFiles('', projId);
        if(currentGraph === null || (currentGraph !== null && currentGraph.id !== this.props.params.id)) {
            provenanceStore.getWasGeneratedByNode(versionId);
        } else if (currentGraph !== null && currentGraph.id === this.props.params.id) {
            provenanceStore.shouldRenderGraph();
        }
        provenanceStore.toggleProvView();
        !this.props.router.location.pathname.includes(id) ? this.props.router.push('/file/'+id) : null;
    }

    openTagManager(id) {
        mainStore.getObjectMetadata(id, Kind.DDS_FILE);
        mainStore.toggleTagManager();
    }
}

FileOptionsMenu.propTypes = {
    projectRole: string,
    selectedEntity: object,
    entityObj: object
};

export default FileOptionsMenu;