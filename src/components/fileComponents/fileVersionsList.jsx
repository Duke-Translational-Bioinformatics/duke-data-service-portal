import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
const { object, array } = PropTypes;

@observer
class FileVersionsList extends React.Component {

    render() {
        const { fileVersions, screenSize, toggleModal } = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};

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
                        {
                            fileVersions.filter(v => !v.is_deleted).map((v) => {
                                return <span key={BaseUtils.generateUniqueKey()}>
                                    <ListItem primaryText={'Version: ' + v.version}
                                              secondaryText={<p><span>{v.label}</span><br/> Created on: {' ' + BaseUtils.formatDate(v.audit.created_on)}</p>}
                                              secondaryTextLines={2}
                                              style={styles.listItem}
                                              onTouchTap={() => this.goTo(v.id)}/>
                                    <Divider />
                                </span>
                            })
                        }
                    </List>
                </Dialog>
            </div>
        );
    }

    goTo(versionId) {
        this.props.router.push('/version/' + versionId);
        this.handleClose();
    }

    handleClose() {
        mainStore.toggleModals('fileVersions');
    }
}

const styles = {
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

FileVersionsList.propTypes = {
    fileVersions: array,
    screenSize: object,
    toggleModal: object
};

export default FileVersionsList;

