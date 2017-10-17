import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import {Path} from '../../util/urlEnum';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import ProjectIcon from 'material-ui/svg-icons/content/content-paste.js';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import FileIcon from 'material-ui/svg-icons/action/description';


const styles = {
    selected: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    hover: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    }
}

@observer
class TreeList extends Component {
    
    componentDidUpdate() {
        const {downloadedItems, projects} = mainStore;
        if (projects && projects.length && downloadedItems.size === 0) {
            mainStore.setDownloadedItems(projects);
            mainStore.setListItems(projects);
        };
    }

    render() {
    		const {downloadedItems, selectedItem, projects} = mainStore;
        return (
      			<Drawer
        				open={true}
        				width={350}
        				zDepth={1}
        				containerStyle={{height: 'calc(100% - 76px)', top: 76}}
        				>
                <br/>
                {this.buildTree(downloadedItems)}
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
        console.log('params', JSON.stringify(this.props, null, 2));
        mainStore.selectItem(item.id, this.props.router);
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
        } else if (mainStore.hoveredItem === itemId) {
            return (styles.hover)
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
                                onNestedListToggle={() => {mainStore.toggleTreeListItem(child)}}
                                onClick={() => {this.handleTouchTap(child)}}
                                onKeyDown={(e) => {this.handleKeyDown(e, child)} }
                                style={this.listItemStyle(child.id)}
                            />
                        )
                    }
                })
            )
        }
        downloadedItems.has('loading') // Required to refresh buildTree after loading is finished
        let projectIds = downloadedItems.get('projectIds')
        let projectTree = projectIds ? looper(projectIds) : null
        return projectTree
    }
};

export default TreeList;
