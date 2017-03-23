import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';

@observer
class FileVersionsList extends React.Component {

    render() {
        const { fileVersions, screenSize, toggleModal } = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let versions = null;
        if (fileVersions && fileVersions != null) {
            versions = fileVersions.map((version) => {
                if (!version.is_deleted) {
                    return <span key={version.id + Math.random()}>
                            <ListItem primaryText={'Version: ' + version.version}
                                      secondaryText={<p><span>{version.label}</span><br/> Created on: {' ' + BaseUtils.formatDate(version.audit.created_on)}</p>}
                                      secondaryTextLines={2}
                                      style={styles.listItem}
                                      onTouchTap={() => this.goTo(version.id)}/>
                            <Divider />
                        </span>
                }
            });
        }

        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose()}/>
        ];

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="File Versions"
                    autoDetectWindowHeight={true}
                    actions={actions}
                    open={toggleModal && toggleModal.id === 'fileVersions' ? toggleModal.open : false}
                    onRequestClose={() => this.handleClose()}>
                    <List>
                        <Divider />
                        { versions }
                    </List>
                </Dialog>
            </div>
        );
    }

    goTo(versionId) {
        this.props.router.push('/version/' + versionId)
        this.handleClose();
    }

    handleClose() {
        mainStore.toggleModals('fileVersions');
    }
}

var styles = {
    addProject: {
        float: 'right',
        position: 'relative',
        margin: '12px -09px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    listItem: {
        textAlign: 'left'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    }
};

FileVersionsList.contextTypes = {
    muiTheme: React.PropTypes.object
};

FileVersionsList.propTypes = {
    fileVersions: array,
    screenSize: object,
    toggleModal: object
};

export default FileVersionsList;

