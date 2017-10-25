import React, { Component, PropTypes } from 'react';
const { object, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Path } from '../../util/urlEnum';
import Drawer from 'material-ui/Drawer';
import FileIcon from 'material-ui/svg-icons/action/description';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import { List, ListItem } from 'material-ui/List';
import ProjectIcon from 'material-ui/svg-icons/content/content-paste.js';

@observer
class TreeList extends Component {
    
    componentDidUpdate() {
        const { ancestorStatus, downloadedItems, projects, selectedItem } = mainStore;
        
        if (projects && projects.length && downloadedItems.size === 0) {
            mainStore.setDownloadedItems(projects);
            mainStore.setListItems(projects);
            mainStore.setSelectedItem();
        };
        
        let item = downloadedItems.get(selectedItem)
        if (item && !ancestorStatus.get('downloadComplete')) {
            if(!item.childrenIds) mainStore.getTreeListChildren(item)
            if (item.ancestors && item.ancestors.length > 0) {
                mainStore.updateAncestorStatus(item.ancestors)
                if(ancestorStatus.get('download')) mainStore.getAncestors(item.ancestors)
                if(ancestorStatus.get('downloadChildren')) mainStore.getAncestorsChildren(item.ancestors)
            }
        }
    }

    render() {
    		const { downloadedItems, drawer, projects, selectedItem } = mainStore;
        return (
            <Drawer
                open={drawer.get('open')}
                width={drawer.get('width')}
                zDepth={1}
                containerStyle={styles.drawer}
                >
                  <List>
                      {this.buildTree(downloadedItems)}
                  </List>
            </Drawer>
        );
    };

    handleKeyDown(e, item) {
        // Clicking SpaceBar
        if (item && e.keyCode === 32) {
            e.stopPropagation();
            e.preventDefault();
            this.handleTouchTap(item)
        }
    }
    
    handleTouchTap(item) {
        mainStore.selectItem(item.id);
    }
    
    iconPicker(kind) {
        let kinds = {
            'dds-project': <ProjectIcon />,
            'dds-folder': <FolderIcon />,
            'dds-file': <FileIcon />
        }
        return (kinds[kind])
    }
    
    listItemStyle(itemId) {
        if (mainStore.selectedItem === itemId) {
            return (styles.selected)
        }
    }

    buildTree(downloadedItems) {
        let looper = (itemIds) => {
            return (
                itemIds.map((id) => {
                    let child = mainStore.downloadedItems.get(id)
                    if (child && child.kind !== 'dds-file') {
                        let grandChildren = []
                        if (child.folderIds && child.folderIds.length > 0) {
                            grandChildren = looper(child.folderIds)
                        }
                        return (
                            <ListItem
                                key={child.id}
                                value={child.id}
                                primaryText={child.name}
                                leftIcon={this.iconPicker(child.kind)}
                                nestedItems={grandChildren}
                                open={child.open}
                                onNestedListToggle={() => {mainStore.toggleTreeListItem(child.id)}}
                                onClick={() => {this.handleTouchTap(child)}}
                                onKeyDown={(e) => {this.handleKeyDown(e, child)} }
                                style={this.listItemStyle(child.id)}
                            />
                        )
                    }
                })
            )
        }
        console.log('buildTree downloadedItems.size', downloadedItems.size);
        let projectIds = downloadedItems.get('projectIds')
        let projectTree = projectIds ? looper(projectIds) : null
        return projectTree
    }
};

const styles = {
    drawer: {
        height: 'calc(100% - 76px)',
        top: 76
    },
    selected: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
}

TreeList.propTypes = {
    downloadedItems: object,
    drawer: object,
    projects: array,
    selectedItem: string
};

export default TreeList;
