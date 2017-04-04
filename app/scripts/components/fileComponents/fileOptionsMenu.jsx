import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import {Kind, Path} from '../../util/urlEnum';
import FileOptions from '../fileComponents/fileOptions.jsx';
import MoveItemModal from '../globalComponents/moveItemModal.jsx';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

@observer
class FileOptionsMenu extends React.Component {

    render() {
        const { entityObj, projPermissions, selectedEntity } = mainStore;
        let id = selectedEntity !== null ? selectedEntity.id : entityObj !== null ? entityObj.id : null;
        let versionId = selectedEntity !== null && selectedEntity.current_version ? selectedEntity.current_version.id : entityObj !== null && entityObj.current_version ? entityObj.current_version.id : null;
        let path = this.props.location.pathname.split('/').splice([1], 1).toString();
        let prjPrm = projPermissions && projPermissions !== undefined ? projPermissions : null;
        let menu = null;
        if (prjPrm !== null) {
            if(prjPrm === 'viewOnly' || prjPrm === 'flDownload'){
                menu = <IconMenu
                            iconButtonElement={<IconButton iconClassName="material-icons" onTouchTap={this.props.clickHandler}>more_vert</IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                            {prjPrm !== 'viewOnly' ? <MenuItem primaryText="Download File" leftIcon={<i className="material-icons">file_download</i>} onTouchTap={() => this.handleDownload()}/> : null}
                            <MenuItem primaryText="Provenance" leftIcon={<i className="material-icons">device_hub</i>} onTouchTap={() => this.toggleProv(id, versionId)}/>
                </IconMenu>;
            }
            if(prjPrm === 'flUpload'){
                menu = <IconMenu
                            iconButtonElement={<IconButton iconClassName="material-icons" onTouchTap={this.props.clickHandler}>more_vert</IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                            <MenuItem primaryText="Upload New Version" leftIcon={<i className="material-icons">file_upload</i>} onTouchTap={() => this.toggleModal('newVersionModal')}/>
                            <MenuItem primaryText="Provenance" leftIcon={<i className="material-icons">device_hub</i>} onTouchTap={() => this.toggleProv(id, versionId)}/>
                </IconMenu>;
            }
            if(prjPrm === 'prjCrud' || prjPrm === 'flCrud'){
                menu = <IconMenu
                            iconButtonElement={<IconButton iconClassName="material-icons" onTouchTap={this.props.clickHandler}>more_vert</IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                            <MenuItem primaryText="Download File" leftIcon={<i className="material-icons">file_download</i>} onTouchTap={() => this.handleDownload(id)}/>
                            <MenuItem primaryText="Delete File" leftIcon={<i className="material-icons">delete</i>} onTouchTap={() => this.toggleModal('dltFile')}/>
                            <MenuItem primaryText="Edit File Name" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={() => this.toggleModal('editFile')}/>
                            <MenuItem primaryText="Add Tags" leftIcon={<i className="material-icons">local_offer</i>} onTouchTap={() => this.openTagManager(id)}/>
                            <MenuItem primaryText="Move File" leftIcon={<i className="material-icons">low_priority</i>} onTouchTap={() => this.moveFile(id)}/>
                            <MenuItem primaryText="Upload New Version" leftIcon={<i className="material-icons">file_upload</i>} onTouchTap={() => this.toggleModal('newVersionModal')}/>
                            <MenuItem primaryText="Provenance" leftIcon={<i className="material-icons">device_hub</i>} onTouchTap={() => this.toggleProv(id, versionId)}/>
                </IconMenu>;
            }
        }
        return (
            <span>
             {menu}
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
        provenanceStore.getWasGeneratedByNode(versionId);
        provenanceStore.toggleProvView();
        this.props.router.push('/file/'+id);
    }

    openTagManager(id) {
        mainStore.getObjectMetadata(id, Kind.DDS_FILE);
        mainStore.toggleTagManager();
    }
}

FileOptionsMenu.propTypes = {
    projPermissions: object,
    selectedEntity: object,
    entityObj: object
};

export default FileOptionsMenu;