import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import { Kind, Path } from '../../util/urlEnum';
import { List, ListItem } from 'material-ui/List';
import Archive from 'material-ui/svg-icons/content/archive.js';
import CircularProgress from 'material-ui/CircularProgress';
import ContentPaste from 'material-ui/svg-icons/content/content-paste.js';
import Folder from 'material-ui/svg-icons/file/folder';
import IconButton from 'material-ui/IconButton';
import KeyboardBackspace from 'material-ui/svg-icons/hardware/keyboard-backspace.js';
import Paper from 'material-ui/Paper';
const { object, bool, array } = PropTypes;

@observer
class MoveItemModal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            goBack: false,
            openChildren: false,
            projectChildren: false,
            showWarning: false
        }
    }

    render() {
        const { entityObj, moveItemLoading, moveToObj, moveItemList, selectedEntity } = mainStore;
        let ancestors = [];
        let children = [];
        let projectChildren = [];
        let openItem = <span></span>;
        let itemId = null;
        let itemParentId = null;
        let itemBatchId = [];
        if(mainStore.filesChecked.length || mainStore.foldersChecked.length) {
            itemBatchId = [...itemBatchId, ...mainStore.filesChecked];
            itemBatchId = [...itemBatchId, ...mainStore.foldersChecked];

        } else {
            itemId = selectedEntity && selectedEntity !== null ? selectedEntity.id : entityObj !== null ? entityObj.id : null;
            itemParentId = selectedEntity && selectedEntity !== null ? selectedEntity.parent.id : entityObj !== null ? entityObj.parent.id : null;
        }

        if (!this.state.projectChildren && moveToObj) {
            if (itemId === moveToObj.id || itemBatchId.includes(moveToObj.id)) {
                openItem = <span></span>
            }
            if ((itemId !== moveToObj.id || !itemBatchId.includes(moveToObj.id)) && !this.state.openChildren) {
                openItem = <span></span>;
            }
            if ((itemId !== moveToObj.id || !itemBatchId.includes(moveToObj.id)) && this.state.openChildren) {
                openItem = <ListItem
                    style={styles.listItem}
                    innerDivStyle={{marginLeft: 20}}
                    value={moveToObj.id}
                    primaryText={moveToObj.name}
                    leftIcon={<Folder />}
                    onTouchTap={() => this.selectedLocation(moveToObj.id, moveToObj.kind)}
                    rightIconButton={<IconButton disabled={moveToObj.id === this.props.params.id || moveToObj.id === itemParentId} tooltip="move here" tooltipPosition="bottom-center" onTouchTap={() => this.handleMove(moveToObj.id, moveToObj.kind)}><Archive style={styles.rightIcon} color={Color.pink} /></IconButton>}/>
            }
        }

        if (moveToObj && moveToObj.ancestors) {
            ancestors = moveToObj.ancestors.map((item) => {
                if (item.id === itemId || itemBatchId.includes(item.id)) {
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
                                  rightIconButton={<IconButton disabled={item.id === this.props.params.id || item.id === itemParentId} tooltip="move here" tooltipPosition="bottom-center" onTouchTap={() => this.handleMove(item.id, item.kind)}><Archive style={styles.rightIcon} color={Color.pink}/></IconButton>}/>
                    )
                } else if(!this.state.projectChildren) {
                    return (
                        <ListItem key={item.id}
                                  style={styles.listItem}
                                  innerDivStyle={{marginLeft: 10}}
                                  value={item.id}
                                  primaryText={item.name}
                                  leftIcon={<Folder />}
                                  onTouchTap={() => this.openListItem(item.id, item.kind)}
                                  rightIconButton={<IconButton disabled={item.id === this.props.params.id || item.id === itemParentId} tooltip="move here" tooltipPosition="bottom-center" onTouchTap={() => this.handleMove(item.id, item.kind)}><Archive style={styles.rightIcon} color={Color.pink}/></IconButton>}/>
                    )
                }
            });
        }

        if (moveItemList.length && this.state.openChildren) {
            children = moveItemList.map((item) => {
                if (item.id === itemId || item.parent.id === itemId || itemBatchId.includes(item.id) || itemBatchId.includes(item.parent.id)) {
                    return (
                        <span key={item.id}></span>
                    )
                }
                if (item.kind === 'dds-folder' && !this.state.projectChildren) {
                    return (
                        <ListItem key={item.id}
                                  style={styles.listItem}
                                  innerDivStyle={{marginLeft: 30}}
                                  value={item.id}
                                  primaryText={item.name}
                                  leftIcon={<Folder />}
                                  onTouchTap={() => this.openListItem(item.id, item.kind)}
                                  rightIconButton={<IconButton disabled={item.id === this.props.params.id || item.id === itemParentId} tooltip="move here" tooltipPosition="bottom-center" onTouchTap={() => this.handleMove(item.id, item.kind)}><Archive style={styles.rightIcon} color={Color.pink}/></IconButton>}/>
                    )
                } else {
                    return (
                        <span key={item.id}></span>
                    )
                }
            });
        }

        if (moveItemList.length && this.state.projectChildren) {
            projectChildren = moveItemList.map((item) => {
                if (item.id === itemId || item.parent.id === itemId || itemBatchId.includes(item.id) || itemBatchId.includes(item.parent.id)) {
                    return (
                        <span key={item.id}></span>
                    )
                }
                if (item.kind === 'dds-folder') {
                    return (
                        <ListItem key={item.id + item.id}
                                  style={styles.listItem}
                                  innerDivStyle={{marginLeft: 0}}
                                  value={item.id}
                                  primaryText={item.name}
                                  leftIcon={<Folder />}
                                  onTouchTap={() => this.openListItem(item.id, item.kind)}
                                  rightIconButton={<IconButton disabled={item.id === this.props.params.id || item.id === itemParentId} tooltip="move here" tooltipPosition="bottom-center" onTouchTap={() => this.handleMove(item.id, item.kind)}><Archive style={styles.rightIcon} color={Color.pink}/></IconButton>}/>
                    )
                } else {
                    return (
                        <span key={item.id}></span>
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
                {this.state.showWarning ? <Paper className="mdl-cell mdl-cell--12-col" style={styles.warning} zDepth={1}>
                        <span>The item you're trying to move is already located here. Please pick another
                            location to move to.</span>
                </Paper> : null}
                {!moveItemLoading ? <List value={3}>
                    {ancestors}
                    {projectChildren}
                    {openItem}
                    {children}
                </List> : <CircularProgress size={60} thickness={5} style={styles.loading}/>}
            </div>
        )
    }

    handleMove(destinationId, destinationKind) {
        const {entityObj, filesChecked, foldersChecked, parent, selectedEntity} = mainStore;
        let id = selectedEntity && selectedEntity !== null ? selectedEntity.id : this.props.params.id;
        let kind = selectedEntity && selectedEntity !== null ? selectedEntity.kind : entityObj !== null ? entityObj.kind : Kind.DDS_PROJECT;
        if (destinationId === parent.id || destinationId === id) {
            this.setState({showWarning: true});
        } else {
            if(mainStore.filesChecked.length || mainStore.foldersChecked.length) {
                for (let id of filesChecked) mainStore.moveItem(id, Kind.DDS_FILE, destinationId, destinationKind);
                for (let id of foldersChecked) mainStore.moveItem(id, Kind.DDS_FOLDER, destinationId, destinationKind);
            } else {
                mainStore.moveItem(id, kind, destinationId, destinationKind);
            }
            mainStore.toggleModals('moveItem');
            this.setState({showWarning: false});
        }
    }

    openListItem(id, parentKind){
        let requester = 'moveItemModal';
        mainStore.getEntity(id, Path.FOLDER, requester);
        mainStore.selectMoveLocation(id, parentKind);
        mainStore.getMoveItemList(id, Path.FOLDER);
        this.setState({
            goBack: true,
            openChildren: true,
            projectChildren: false,
            showWarning: false
        })
    }

    goBack(){
        const {moveToObj} = mainStore;
        let requester = 'moveItemModal';
        let parentKind = moveToObj.parent.kind;
        let parentId = moveToObj.parent.id;
        mainStore.selectMoveLocation(parentId, parentKind);
        if (parentKind === 'dds-folder') {
            mainStore.getEntity(parentId, Path.FOLDER, requester);
            mainStore.getMoveItemList(parentId, Path.FOLDER);
        } else {
            mainStore.getMoveItemList(parentId, Path.PROJECT);
            this.setState({
                goBack: false,
                openChildren: false,
                showWarning: false
            })
        }
    }

    getProjectChildren(id){
        mainStore.getMoveItemList(id, Path.PROJECT);
        this.setState({
            openChildren: false,
            projectChildren: true,
            showWarning: false
        })
    }

    selectedLocation(parentId, parentKind){
        mainStore.selectMoveLocation(parentId, parentKind)
    }
}

const styles = {
    backButton: {
        position: 'absolute',
        top: 14,
        left: 36,
        fontSize: 14
    },
    backButtonWrapper: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    listItem: {
        textAlign: 'left'
    },
    loading: {
        position: 'absolute',
        margin: '0 auto',
        left: 0,
        right: 0
    },
    rightIcon: {
        position: 'absolute',
        top: 10,
        right: 4
    },
    warning: {
        backgroundColor: Color.ltRed,
        color: '#EEEEEE',
        minHeight: 40,
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
        fontSize: 14,
        textAlign: 'left'
    }
};

MoveItemModal.propTypes = {
    entityObj: object,
    selectedEntity: object,
    moveItemList: array,
    moveToObj: object,
    moveItemLoading: bool
};

export default MoveItemModal;