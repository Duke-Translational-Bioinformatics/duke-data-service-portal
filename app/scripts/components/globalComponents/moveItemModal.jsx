import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import FlatButton from 'material-ui/lib/flat-button';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Folder from 'material-ui/lib/svg-icons/file/folder';
import ContentPaste from 'material-ui/lib/svg-icons/content/content-paste.js';
import IconButton from 'material-ui/lib/icon-button';
import KeyboardBackspace from 'material-ui/lib/svg-icons/hardware/keyboard-backspace.js';
import Archive from 'material-ui/lib/svg-icons/content/archive.js';

let MoveItemModal = React.createClass({

    getInitialState() {
        return {
            openChildren: false,
            projectChildren: false,
            goBack: false
        };
    },

    render(){
        let ancestors = [];
        let children = [];
        let projectChildren = [];
        let openItem = <span></span>;

        if (!this.state.projectChildren && this.props.moveToObj) {
            if (this.props.params.id === this.props.moveToObj.id) {
                openItem = <span></span>
            }
            if (this.props.params.id != this.props.moveToObj.id && !this.state.openChildren) {
                openItem = <span></span>;
            }
            if (this.props.params.id != this.props.moveToObj.id && this.state.openChildren) {
                openItem = <ListItem
                    style={styles.listItem}
                    value={this.props.moveToObj.id}
                    primaryText={this.props.moveToObj.name}
                    leftIcon={<Folder />}
                    onTouchTap={() => this.selectedLocation(this.props.moveToObj.id, this.props.moveToObj.kind)}
                    rightIconButton={<Archive touch={true} style={styles.rightIcon} color={'#EC407A'} onTouchTap={() => this.handleMove(this.props.moveToObj.id, this.props.moveToObj.kind)}/>}/>
            }
        }

        if (this.props.moveToObj && this.props.moveToObj.ancestors) {
            ancestors = this.props.moveToObj.ancestors.map((item) => {
                if (item.id === this.props.params.id) {
                    return (
                        <span key={item.id}></span>
                    )
                }
                if (item.kind === 'dds-project') {
                    return (
                        <ListItem key={item.id}
                                  style={styles.listItem}
                                  value={item.id}
                                  primaryText={item.name}
                                  leftIcon={<ContentPaste />}
                                  onTouchTap={() => this.getProjectChildren(item.id)}
                                  rightIconButton={<Archive touch={true} style={styles.rightIcon} color={'#EC407A'} onTouchTap={() => this.handleMove(item.id, item.kind)}/>}/>
                    )
                } else {
                    return (
                        <span key={item.id}></span>
                    )
                }
            });
        }

        if (this.props.children && this.state.openChildren) {
            children = this.props.children.map((children) => {
                if (children.id === this.props.params.id || children.parent.id === this.props.params.id) {
                    return (
                        <span key={children.id}></span>
                    )
                }
                if (children.kind === 'dds-folder' && !this.state.projectChildren) {
                    return (
                        <ListItem key={children.id}
                                  style={styles.listItem}
                                  innerDivStyle={{marginLeft: 20}}
                                  value={children.id}
                                  primaryText={children.name}
                                  leftIcon={<Folder />}
                                  onTouchTap={() => this.openListItem(children.id, children.kind)}
                                  rightIconButton={<Archive touch={true} style={styles.rightIcon} color={'#EC407A'} onTouchTap={() => this.handleMove(children.id, children.kind)}/>}/>
                    )
                } else {
                    return (
                        <span key={children.id}></span>
                    )
                }
            });
        }

        if (this.props.children && this.state.projectChildren) {
            projectChildren = this.props.children.map((children) => {
                if (children.id === this.props.params.id || children.parent.id === this.props.params.id) {
                    return (
                        <span key={children.id}></span>
                    )
                }
                if (children.kind === 'dds-folder') {
                    return (
                        <ListItem key={children.id + children.id}
                                  style={styles.listItem}
                                  innerDivStyle={{marginLeft: 20}}
                                  value={children.id}
                                  primaryText={children.name}
                                  leftIcon={<Folder />}
                                  onTouchTap={() => this.openListItem(children.id, children.kind)}
                                  rightIconButton={<Archive touch={true} style={styles.rightIcon} color={'#EC407A'} onTouchTap={() => this.handleMove(children.id, children.kind)}/>}/>
                    )
                } else {
                    return (
                        <span key={children.id}></span>
                    )
                }
            });
        }

        return (
            <div>
                <div style={styles.backButtonWrapper}>
                    {this.state.goBack ? <a href="" onTouchTap={() => this.goBack()}>
                        <IconButton tooltip="Previous" style={{float: 'left'}}>
                            <KeyboardBackspace />
                        </IconButton>
                        <div className="mdl-color-text--grey-800"
                             style={styles.backButton}>Back
                        </div>
                    </a> : null}
                </div>
                <List
                    {...this.props}
                    value={3}
                    >
                    {ancestors}
                    {projectChildren}
                    {openItem}
                    {children}
                </List>
            </div>
        )
    },

    handleMove(destinationId, destinationKind) {
        let id = this.props.params.id;
        let parent = this.props.parent ? this.props.parent.id : null;
        let parentKind = this.props.parent ? this.props.parent.kind : null;
        if (destinationId === this.props.parent.id || destinationId === this.props.entityObj.id) {
            ProjectActions.moveItemWarning(true);
        } else {
            if (this.props.entityObj.kind === 'dds-folder') {
                ProjectActions.moveFolder(id, destinationId, destinationKind);
            } else {
                ProjectActions.moveFile(id, destinationId, destinationKind);
            }
            if (parentKind === 'dds-folder') {
                this.props.appRouter.transitionTo('/folder/' + parent);
                ProjectActions.loadFolderChildren(parent);
            } else {
                this.props.appRouter.transitionTo('/project/' + parent);
                ProjectActions.loadProjectChildren(parent);
            }
            ProjectActions.openMoveModal(false);
        }
    },

    openListItem(id, parentKind){
        let requester = 'moveItemModal';
        let kind = 'folders';
        ProjectActions.getEntity(id, kind, requester);
        ProjectActions.selectMoveLocation(id, parentKind);
        ProjectActions.loadFolderChildren(id);
        this.setState({
            goBack: true,
            openChildren: true,
            projectChildren: false
        })
    },

    goBack(){
        let requester = 'moveItemModal';
        let parentKind = this.props.moveToObj.parent.kind;
        let kind = 'folders';
        let parentId = this.props.moveToObj.parent.id;
        ProjectActions.selectMoveLocation(parentId, parentKind);
        if (parentKind === 'dds-folder') {
            ProjectActions.getEntity(parentId, kind, requester);
            ProjectActions.loadFolderChildren(parentId);
        } else {
            ProjectActions.loadProjectChildren(parentId);
            this.setState({
                goBack: false,
                openChildren: false
            })
        }
    },

    getProjectChildren(id){
        ProjectActions.loadProjectChildren(id);
        this.setState({
            openChildren: false,
            projectChildren: true
        })
    },

    selectedLocation(parentId, parentKind){
        ProjectActions.selectMoveLocation(parentId, parentKind)
    },

    closeChildren(){
        this.setState({
            openChildren: false,
            projectChildren: false
        })
    }
});
var styles = {
    backButton: {
        float: 'left',
        marginLeft: -10,
        marginTop: 14
    },
    backButtonWrapper: {
        float: 'left',
        marginLeft: 4,
        marginTop: -30
    },
    listItem: {
        textAlign: 'left'
    },
    rightIcon: {
        position: 'absolute',
        top: 10,
        right: 4
    }
};

export default MoveItemModal;