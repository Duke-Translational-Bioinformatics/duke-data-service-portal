import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import {Kind, Path} from '../../../util/urlEnum';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Archive from 'material-ui/lib/svg-icons/content/archive.js';
import CircularProgress from 'material-ui/lib/circular-progress';
import ContentPaste from 'material-ui/lib/svg-icons/content/content-paste.js';
import Folder from 'material-ui/lib/svg-icons/file/folder';
import IconButton from 'material-ui/lib/icon-button';
import KeyboardBackspace from 'material-ui/lib/svg-icons/hardware/keyboard-backspace.js';
import Paper from 'material-ui/lib/paper';

let MoveItemModal = React.createClass({

    getInitialState() {
        return {
            goBack: false,
            openChildren: false,
            projectChildren: false,
            showWarning: false
        };
    },

    render(){
        let ancestors = [];
        let children = [];
        let projectChildren = [];
        let openItem = <span></span>;
        let path = this.props.routerPath.split('/').splice([1], 1).toString();
        let itemId = this.props.selectedEntity && this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.entityObj.id;

        if (!this.state.projectChildren && this.props.moveToObj) {
            if (itemId === this.props.moveToObj.id) {
                openItem = <span></span>
            }
            if (itemId != this.props.moveToObj.id && !this.state.openChildren) {
                openItem = <span></span>;
            }
            if (itemId != this.props.moveToObj.id && this.state.openChildren) {
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
                if (item.id === itemId) {
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

        if (this.props.moveItemList && this.state.openChildren) {
            children = this.props.moveItemList.map((children) => {
                if (children.id === itemId || children.parent.id === itemId) {
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

        if (this.props.moveItemList && this.state.projectChildren) {
            projectChildren = this.props.moveItemList.map((children) => {
                if (children.id === itemId || children.parent.id === itemId) {
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
                {this.state.showWarning ? <Paper className="mdl-cell mdl-cell--12-col"
                       style={styles.warning}
                       zDepth={1}>
                    <span>The item you're trying to move is already located here. Please pick another
                        location to move to</span>
                </Paper> : null}
                {!this.props.loading ? <List {...this.props} value={3}>
                    {ancestors}
                    {projectChildren}
                    {openItem}
                    {children}
                </List> : <CircularProgress size={1} style={styles.loading}/>}
            </div>
        )
    },

    handleMove(destinationId, destinationKind) {
        let id = this.props.selectedEntity && this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.params.id;
        let kind = this.props.selectedEntity && this.props.selectedEntity !== null ? this.props.selectedEntity.kind : this.props.entityObj.kind;
        let parent = this.props.parent ? this.props.parent.id : null;
        let parentKind = this.props.parent ? this.props.parent.kind : null;
        let transitionToParent = (root, parent)=> {
            setTimeout(()=>{this.props.appRouter.transitionTo(root + parent)}, 500)
        };
        if (destinationId === this.props.parent.id || destinationId === id) {
            this.setState({showWarning: true});
        } else {
            ProjectActions.moveItem(id, kind, destinationId, destinationKind);
            if (parentKind === Kind.DDS_FOLDER) {
                transitionToParent('/folder/', parent);
            } else {
                transitionToParent('/project/', parent);
            }
            this.setState({showWarning: false});
            ProjectActions.toggleModals('moveItem');
        }
    },

    openListItem(id, parentKind){
        let requester = 'moveItemModal';
        let kind = 'folders';
        ProjectActions.getEntity(id, kind, requester);
        ProjectActions.selectMoveLocation(id, parentKind);
        ProjectActions.getMoveItemList(id, Path.FOLDER);
        this.setState({
            goBack: true,
            openChildren: true,
            projectChildren: false,
            showWarning: false
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
            ProjectActions.getChildren(parentId, Path.FOLDER);
        } else {
            ProjectActions.getChildren(parentId, Path.PROJECT);
            this.setState({
                goBack: false,
                openChildren: false,
                showWarning: false
            })
        }
    },

    getProjectChildren(id){
        ProjectActions.getMoveItemList(id, Path.PROJECT);
        this.setState({
            openChildren: false,
            projectChildren: true,
            showWarning: false
        })
    },

    selectedLocation(parentId, parentKind){
        ProjectActions.selectMoveLocation(parentId, parentKind)
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
    loading: {
        position: 'absolute',
        margin: '0 auto',
        //top: 200,
        left: 0,
        right: 0
    },
    rightIcon: {
        position: 'absolute',
        top: 10,
        right: 4
    },
    warning: {
        backgroundColor: '#ef5350',
        color: '#EEEEEE',
        height: 40,
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
        textAlign: 'center'
    }
};

export default MoveItemModal;