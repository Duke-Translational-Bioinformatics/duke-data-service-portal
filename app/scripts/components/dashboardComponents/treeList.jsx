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
        const {errorModals, phiModalOpen, toasts, showFilters, screenSize, serviceOutageNoticeModalOpen, projects} = mainStore;
        const { downloadedItems, drawer, selectedItem } = dashboardStore;
        let ancestorIds = []
        if (selectedItem) {
            let item = downloadedItems.get(selectedItem)
            if (item && item.ancestors && item.ancestors.length > 0) {
                ancestorIds = item.ancestors.map((a) => {return(a.id)})
            }
        }
        
        return (
            <Drawer
                open={drawer.get('open')}
                width={drawer.get('width')}
                zDepth={1}
                containerStyle={this.drawerStyle()}
                >
                  <List>
                      {this.buildTree(downloadedItems, ancestorIds)}
                  </List>
            </Drawer>
        );
    };
    
    drawerStyle() {
        const {leftMenuDrawer} = mainStore;
        const {drawer} = dashboardStore;
        let style = styles.drawer;
        if(leftMenuDrawer.get('open')) {
            style.marginLeft = window.innerWidth <= 720 ? 0 : leftMenuDrawer.get('width')
        };
        return style;
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

    iconPicker(child, ancestorIds) {
        let kinds = {
            'open': {
                'dds-project': 'content_paste',
                'dds-folder': 'folder_open',
                'dds-file': 'description'
            },
            'closed': {
                'dds-project': 'content_paste',
                'dds-folder': 'folder',
                'dds-file': 'description'
            }
        }
        let iconKind = ancestorIds.includes(child.id) || child.id === dashboardStore.selectedItem ? kinds.open[child.kind] : kinds.closed[child.kind]
        
        return (
            <FontIcon className="material-icons" style={styles.icon}>
                {iconKind}
            </FontIcon>
        )
    }
    
    listItemStyle(child) {
        if (dashboardStore.selectedItem === child.id) {
            return (styles.selected)
        } else if (child.childrenDownloaded) {
            return (styles.childrenDownloaded)
        }
    }

    buildTree(downloadedItems, ancestorIds) {
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
                                leftIcon={this.iconPicker(child, ancestorIds)}
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
        // console.log('buildTree downloadedItems.size', downloadedItems.size);
        let projectIds = downloadedItems.get('projectIds')
        let projectTree = projectIds ? looper(projectIds) : null
        return projectTree
    }
};

const styles = {
    childrenDownloaded: {
        color: Color.ltBlue
    },
    drawer: {
        top: '56px'
    },
    nestedListStyle: {
        padding: '0px'
    },
    selected: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        color: Color.ltBlue
    }
}

TreeList.propTypes = {
    downloadedItems: object,
    drawer: object,
    projects: array,
    selectedItem: string
};

export default TreeList;
