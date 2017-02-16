import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import {Kind, Path} from '../../../util/urlEnum';
import FileOptions from '../fileComponents/fileOptions.jsx';
import MoveItemModal from '../globalComponents/moveItemModal.jsx';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

class FileOptionsMenu extends React.Component {

    render() {
        let path = this.props.location.pathname.split('/').splice([1], 1).toString();
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        let menu = null;
        if (prjPrm !== null) {
            if(prjPrm === 'viewOnly' || prjPrm === 'flDownload'){
                menu = <IconMenu
                            iconButtonElement={<IconButton iconClassName="material-icons" onTouchTap={this.props.clickHandler}>more_vert</IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                            {prjPrm !== 'viewOnly' ? <MenuItem primaryText="Download File" leftIcon={<i className="material-icons">file_download</i>} onTouchTap={() => this.handleDownload()}/> : null}
                            <MenuItem primaryText="Provenance" leftIcon={<i className="material-icons">device_hub</i>} onTouchTap={() => this.toggleProv()}/>
                </IconMenu>;
            }
            if(prjPrm === 'flUpload'){
                menu = <IconMenu
                            iconButtonElement={<IconButton iconClassName="material-icons" onTouchTap={this.props.clickHandler}>more_vert</IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                            <MenuItem primaryText="Upload New Version" leftIcon={<i className="material-icons">file_upload</i>} onTouchTap={() => this.toggleModal('newVersionModal')}/>
                            <MenuItem primaryText="Provenance" leftIcon={<i className="material-icons">device_hub</i>} onTouchTap={() => this.toggleProv()}/>
                </IconMenu>;
            }
            if(prjPrm === 'prjCrud' || prjPrm === 'flCrud'){
                menu = <IconMenu
                            iconButtonElement={<IconButton iconClassName="material-icons" onTouchTap={this.props.clickHandler}>more_vert</IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                            <MenuItem primaryText="Download File" leftIcon={<i className="material-icons">file_download</i>} onTouchTap={() => this.handleDownload()}/>
                            <MenuItem primaryText="Delete File" leftIcon={<i className="material-icons">delete</i>} onTouchTap={() => this.toggleModal('dltFile')}/>
                            <MenuItem primaryText="Edit File Name" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={() => this.toggleModal('editFile')}/>
                            <MenuItem primaryText="Add Tags" leftIcon={<i className="material-icons">local_offer</i>} onTouchTap={() => this.openTagManager()}/>
                            <MenuItem primaryText="Move File" leftIcon={<i className="material-icons">low_priority</i>} onTouchTap={() => this.moveFile()}/>
                            <MenuItem primaryText="Upload New Version" leftIcon={<i className="material-icons">file_upload</i>} onTouchTap={() => this.toggleModal('newVersionModal')}/>
                            <MenuItem primaryText="Provenance" leftIcon={<i className="material-icons">device_hub</i>} onTouchTap={() => this.toggleProv()}/>
                </IconMenu>;
            }
        }
        return (
            <span>
             {menu}
            </span>
        );
    };


    handleDownload() {
        let id = this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.entityObj.id;
        let kind = Path.FILE;
        ProjectActions.getDownloadUrl(id, kind);
    }

    moveFile() {
        // Get current file object to access ancestors. Set parent in store.
        let id = this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.entityObj.id;
        let kind = 'files';
        let requester = 'optionsMenu';
        ProjectActions.getEntity(id, kind, requester);
        ProjectActions.toggleModals('moveItem');
    }

    openVersionModal() {
        ProjectActions.openVersionModal();
    }

    toggleModal(id) {
        ProjectActions.toggleModals(id);
    }

    toggleProv() {
        let fileId = this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.entityObj.id;
        let versionId = this.props.selectedEntity !== null ? this.props.selectedEntity.current_version.id : this.props.entityObj.current_version.id;
        ProjectActions.getWasGeneratedByNode(versionId);
        ProjectActions.toggleProvView();
        this.props.router.push('/file/'+fileId);
    }

    openTagManager() {
        let id = this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.entityObj.id;
        ProjectActions.getObjectMetadata(id, Kind.DDS_FILE);
        ProjectActions.toggleTagManager();
    }
}

export default FileOptionsMenu;