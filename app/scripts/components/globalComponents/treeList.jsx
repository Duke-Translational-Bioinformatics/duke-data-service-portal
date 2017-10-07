import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import {Path} from '../../util/urlEnum';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import ProjectIcon from 'material-ui/svg-icons/content/content-paste.js';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import FileIcon from 'material-ui/svg-icons/action/description';

@observer
class TreeList extends Component {
    componentDidUpdate() {
        if (mainStore.projects && mainStore.projects.length && mainStore.downloadedItems.size === 0) {
            mainStore.setDownloadedItems();
        };
    }

    render() {
    		const {downloadedItems, projects, loading, selectedItem} = mainStore;	
        const projectIds = projects.map((project) => { return project.id })

        return (
      			<Drawer
        				open={true}
        				width={350}
        				zDepth={1}
        				containerStyle={{height: 'calc(100% - 76px)', top: 76}}
        				>
                <br />
  				      {this.buildTree(projectIds)}
      			</Drawer>
        );
    }
    
    handleTouchTap(item) {
        mainStore.selectItem(item.id);
        let path = this.pathFinder(item.kind)
        if (!item.folderIds && path) {
            mainStore.getTreeListChildren(item, path);
        }
    }
    
    pathFinder(kind) {
        let kinds = {
            'dds-project': Path.PROJECT,
            'dds-folder': Path.FOLDER
        }
        return (kinds[kind])
    }
    
    iconPicker(kind) {
        let kinds = {
            'dds-project': <ProjectIcon />,
            'dds-folder': <FolderIcon />,
            'dds-file': <FileIcon />
        }
        return (kinds[kind])
    }

    buildTree(itemIds) {
        return (
            itemIds.map((id) => {
              let child = mainStore.downloadedItems.get(id)
                if (child) {
                    let grandChildren = []
                    if (child.folderIds && child.folderIds.length > 0) {
                      grandChildren = this.buildTree(child.folderIds)
                    }
                    return (
                        <ListItem
                            key={child.id}
                            value={child.id}
                            primaryText={child.name}
                            leftIcon={this.iconPicker(child.kind)}
                            nestedItems={grandChildren}
                            open={child.open}
                            onNestedListToggle={() => {mainStore.toggleTreeListItem(child)}}
                            onClick={() => {this.handleTouchTap(child)}}
                            style={mainStore.selectedItem === child.id ? styles.selected : null}
                        />
                    )
                }
            })
        )
    }
};

const styles = {
    selected: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
};

export default TreeList;
