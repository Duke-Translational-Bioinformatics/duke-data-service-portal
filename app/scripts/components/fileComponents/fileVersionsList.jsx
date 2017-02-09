import React from 'react';
import ProjectActions from '../../actions/projectActions';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';


class FileVersionsList extends React.Component {

    render() {
        let open = this.props.modal ? this.props.modal : false;
        let versions = null;
        if (this.props.fileVersions && this.props.fileVersions != undefined) {
            versions = this.props.fileVersions.map((version) => {
                if (!version.is_deleted) {
                    let x = new Date(version.audit.created_on);
                    let createdOn = x.toString();
                    return <span key={version.id + Math.random()}>
                            <ListItem primaryText={'Version: ' + version.version}
                                      secondaryText={<p><span>{version.label}</span><br/> Created on: {' ' + createdOn}</p>}
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
                onTouchTap={this.handleClose.bind(this)}/>
        ];

        return (
            <div>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={this.props.screenSize.width < 580 ? {width: '100%'} : {}}
                    title="File Versions"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={actions}
                    open={open}
                    onRequestClose={this.handleClose.bind(this)}>
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
        ProjectActions.closeModal();
    }

    handleClose() {
        ProjectActions.closeModal();
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

export default FileVersionsList;

