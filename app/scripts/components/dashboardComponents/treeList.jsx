import React, { Component, PropTypes } from 'react';
const { object, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import dashboardStore from '../../stores/dashboardStore';
import { Path } from '../../util/urlEnum';
import { Color } from '../../theme/customTheme';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';

@observer
class TreeList extends Component {
    
    componentDidUpdate() {
        const { projects } = mainStore;
        const { ancestorStatus, downloadedItems, selectedItem } = dashboardStore;
        
        if (projects && projects.length && downloadedItems.size === 0) {
            dashboardStore.setDownloadedItems(projects);
            mainStore.setListItems(projects);
            dashboardStore.setSelectedItem();
        };
        
        let item = downloadedItems.get(selectedItem)
        if (item && !ancestorStatus.get('downloadComplete')) {
            if(!item.childrenIds) dashboardStore.getTreeListChildren(item)
            if (item.ancestors && item.ancestors.length > 0) {
                dashboardStore.updateAncestorStatus(item.ancestors)
                if(ancestorStatus.get('download')) dashboardStore.getAncestors(item.ancestors)
                if(ancestorStatus.get('downloadChildren')) dashboardStore.getAncestorsChildren(item.ancestors)
            }
        }
    }

    render() {
        const { projects } = mainStore;
        const { downloadedItems, drawer, selectedItem } = dashboardStore;
        
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
        dashboardStore.selectItem(item.id);
    }
    
    
    iconPicker(child) {
        let kinds = {
            'dds-project': 'content_paste',
            'dds-folder': 'folder',
            'dds-file': 'description'
        }

        return (
            <FontIcon className="material-icons" style={styles.icon}>
                {kinds[child.kind]}
            </FontIcon>
        )
    }

    // iconPicker(child) {
    //     let kinds = {
    //         'open': {
    //             'dds-project': 'content_paste',
    //             'dds-folder': 'folder_open',
    //             'dds-file': 'description'
    //         },
    //         'closed': {
    //             'dds-project': 'content_paste',
    //             'dds-folder': 'folder',
    //             'dds-file': 'description'
    //         }
    //     }
    //     let iconKind = child.childrenDownloaded ? kinds.open[child.kind] : kinds.closed[child.kind]
    //     return (
    //         <FontIcon className="material-icons" style={styles.icon}>
    //             {iconKind}
    //         </FontIcon>
    //     )
    // }
    
    listItemStyle(child) {
        if (dashboardStore.selectedItem === child.id) {
            return (styles.selected)
        } else if (child.childrenDownloaded) {
            return (styles.childrenDownloaded)
        }
    }

    buildTree(downloadedItems) {
        let looper = (itemIds) => {
            return (
                itemIds.map((id) => {
                    let child = downloadedItems.get(id)
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
                                leftIcon={this.iconPicker(child)}
                                nestedItems={grandChildren}
                                open={child.open}
                                onNestedListToggle={() => {dashboardStore.toggleTreeListItem(child.id)}}
                                onClick={() => {this.handleTouchTap(child)}}
                                onKeyDown={(e) => {this.handleKeyDown(e, child)} }
                                style={this.listItemStyle(child)}
                                nestedListStyle={styles.nestedListStyle}
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
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        color: Color.ltBlue
    },
    childrenDownloaded: {
        color: Color.ltBlue
    },
    nestedListStyle: {
        padding: '0px'
    }
}

TreeList.propTypes = {
    downloadedItems: object,
    drawer: object,
    projects: array,
    selectedItem: string
};

export default TreeList;
