import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import Badge from 'material-ui/lib/badge';
import RaisedButton from 'material-ui/lib/raised-button';

class DeleteConfirmation extends React.Component {

    constructor() {
        this.state = {
            open: false
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleClose.bind(this)}/>,
            <FlatButton
                label="Delete"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleBatchDelete.bind(this)}/>
        ];

        return (
            <div>
                <Badge
                    badgeContent={this.props.numSelected}
                    secondary={true}
                    badgeStyle={{top: 30, left: 20,  backgroundColor: '#EC407A'}}
                    style={{float:'right'}}>
                    <RaisedButton label="Delete" labelStyle={{color: '#EC407A', paddingLeft: 40}} style={styles.batchOpsButton} onTouchTap={this.openModal.bind(this)}/>
                </Badge>
                <Dialog
                    style={styles.dialogStyles}
                    title="Are you sure you want to delete these items?"
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    actions={actions}
                    open={this.state.open}
                    onRequestClose={this.handleClose.bind(this)}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
            </div>
        );
    }

    handleBatchDelete(){
        let files = this.props.filesChecked ? this.props.filesChecked : null;
        let folders = this.props.foldersChecked ? this.props.foldersChecked : null;
        let numItems = "Are you sure you want to delete " + files.length + folders.length + " items?";
        let parentId = this.props.entityObj && this.props.entityObj.id ? this.props.entityObj.id : this.props.project.id;
        let parentKind = this.props.entityObj && this.props.entityObj.kind === 'dds-folder' ? this.props.entityObj.kind : 'dds-project';
        for (let i = 0; i < files.length; i++) {
            ProjectActions.deleteFile(files[i], parentId, parentKind);
        }
        for (let i = 0; i < folders.length; i++) {
            ProjectActions.deleteFolder(folders[i], parentId, parentKind);
        }
        this.setState({open: false});
    }

    openModal() {
        this.setState({open: true});
    };

    handleClose() {
        this.setState({open: false});
    };
}

let styles = {
    batchOpsButton: {
        marginRight: -10
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9996'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

DeleteConfirmation.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default DeleteConfirmation;