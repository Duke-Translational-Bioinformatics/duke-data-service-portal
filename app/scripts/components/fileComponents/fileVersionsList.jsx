import React from 'react';
import ProjectActions from '../../actions/projectActions';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import Divider from 'material-ui/lib/divider';
import TextField from 'material-ui/lib/text-field';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import ActionInfo from 'material-ui/lib/svg-icons/action/info';

class FileVersionsList extends React.Component {

    render() {
        let open = this.props.modal ? this.props.modal : false;
        let currentVersion = null;
        if (this.props.entityObj && this.props.entityObj != undefined) {
            let x = new Date(this.props.entityObj.audit.created_on);
            let createdOn = x.toString();
            currentVersion = <span>
                            <ListItem primaryText={'Current Version: ' + this.props.entityObj.name}
                                      secondaryText={<p><span>{this.props.entityObj.label}</span><br/> Created on: {' ' + createdOn}</p>}
                                      secondaryTextLines={2}
                                      rightIcon={<ActionInfo />}
                                      style={styles.listItem}
                                      onTouchTap={() => this.handleClose()}/>
                            <Divider />
                        </span>
        }
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
                                      rightIcon={<ActionInfo />}
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
                    title="File Versions"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={actions}
                    open={open}
                    onRequestClose={this.handleClose.bind(this)}>
                    <List>
                        <Divider />
                        { currentVersion }
                        <Divider />
                        { versions }
                    </List>
                </Dialog>
            </div>
        );
    }

    goTo(versionId) {
        this.props.appRouter.transitionTo('/version' + '/' + versionId)
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

