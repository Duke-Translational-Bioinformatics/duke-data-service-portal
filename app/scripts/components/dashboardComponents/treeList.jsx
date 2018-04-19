import React from 'react';
import PropTypes from 'prop-types';
const { array, object, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import dashboardStore from '../../stores/dashboardStore';
import { UrlGen, Kind } from '../../util/urlEnum';
import { Color, WindowBreak } from '../../theme/customTheme';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';

@observer
class TreeList extends React.Component {
    
    // componentDidMount() {
    //     const { projects, selectedEntity } = mainStore;
    //     const { ancestorStatus, downloadedItems, selectedItem } = dashboardStore;
    //     console.log('TreeList componentDidMount selectedItem', selectedItem);
    // 
    //     // if (projects && projects.length && downloadedItems.size === 0) {
    //     //     dashboardStore.setDownloadedItems(projects);
    //     //     mainStore.setListItems(projects);
    //     // };
    //     // let item = downloadedItems.get(selectedItem)
    //     // if (selectedItem && !ancestorStatus.get('downloadComplete')) {
    //     //     // if(!selectedItem.childrenIds) dashboardStore.getTreeListChildren(selectedItem)
    //     //     if (selectedItem.ancestors && selectedItem.ancestors.length > 0) {
    //     //         dashboardStore.updateAncestorStatus(selectedItem.ancestors)
    //     //         if(ancestorStatus.get('download')) dashboardStore.getAncestors(selectedItem.ancestors)
    //     //         if(ancestorStatus.get('downloadChildren')) dashboardStore.getAncestorsChildren(selectedItem.ancestors)
    //     //     }
    //     // }
    // }

    // componentDidUpdate() {
    //     const { projects, selectedEntity } = mainStore;
    //     const { ancestorStatus, downloadedItems, selectedItem } = dashboardStore;
    //     console.log('TreeList componentDidUpdate selectedItem.......', selectedItem);
    // 
    //     // if (projects && projects.length && downloadedItems.size === 0) {
    //     //     dashboardStore.setDownloadedItems(projects);
    //     //     mainStore.setListItems(projects);
    //     // };
    //     // let item = downloadedItems.get(selectedItem)
    //     // if (selectedItem && !ancestorStatus.get('downloadComplete')) {
    //     //     // if(!selectedItem.childrenIds) dashboardStore.getTreeListChildren(selectedItem)
    //     //     if (selectedItem.ancestors && selectedItem.ancestors.length > 0) {
    //     //         dashboardStore.updateAncestorStatus(selectedItem.ancestors)
    //     //         if(ancestorStatus.get('download')) dashboardStore.getAncestors(selectedItem.ancestors)
    //     //         if(ancestorStatus.get('downloadChildren')) dashboardStore.getAncestorsChildren(selectedItem.ancestors)
    //     //     }
    //     // }
    // }

    render() {
        const { leftMenuDrawer, projects, screenSize } = mainStore;
        const { downloadedItems, drawer, selectedItem } = dashboardStore;
        let projectIds = projects.map(p => p.id)

        return (
            <Drawer
                open={drawer.get('open')}
                width={drawer.get('width')}
                zDepth={1}
                containerStyle={this.drawerStyle(screenSize, leftMenuDrawer)}
            >
                <List>
                    {this.buildTree(downloadedItems, projectIds, selectedItem)}
                </List>
            </Drawer>
        );
    };
    
    drawerStyle(screenSize, leftMenuDrawer) {
        let style = styles.drawer;
        if(screenSize.width > WindowBreak.tablet) {
            style.marginLeft = leftMenuDrawer.get('open') ? leftMenuDrawer.get('width') : 0
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
        dashboardStore.selectItem(item.id, this.props.router, true);
    }

    iconPicker(child, ancestorIds, selectedItem) {
        let iconKind
        switch (child.kind) {
        case Kind.DDS_PROJECT:
            iconKind = 'content_paste';
            break;
        case Kind.DDS_FOLDER:
            let folderOpen = selectedItem && child.id === selectedItem.id || ancestorIds.includes(child.id);
            iconKind = folderOpen ? 'folder_open' : 'folder';
            break;
        }
        return (
            <FontIcon className="material-icons" style={styles.icon}>
                {iconKind}
            </FontIcon>
        )
    }
    
    listItemStyle(child, selectedItem) {
        if (selectedItem && selectedItem.id === child.id) {
            return (styles.selected)
        }
    }

    routeFinder(item) {
        if (item.kind === Kind.DDS_PROJECT) {
            return UrlGen.routes.dashboardProject(item.id);
        } else if (item.kind === Kind.DDS_FOLDER) {
            return UrlGen.routes.dashboardFolder(item.id);
        }
    }

    buildTree(downloadedItems, projectIds, selectedItem) {
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
                                leftIcon={this.iconPicker(child, ancestorIds, selectedItem)}
                                nestedItems={grandChildren}
                                open={child.open}
                                onClick={() => {this.handleTouchTap(child)}}
                                onKeyDown={(e) => {this.handleKeyDown(e, child)} }
                                style={this.listItemStyle(child, selectedItem)}
                                nestedListStyle={styles.nestedListStyle}
                                onNestedListToggle={() => {dashboardStore.toggleTreeListItem(child)}}
                            />
                        )
                    }
                })
            )
        }

        let ancestorIds = []
        if (selectedItem) {
            if (downloadedItems.size > 0 && selectedItem && selectedItem.ancestors && selectedItem.ancestors.length > 0) {
                ancestorIds = selectedItem.ancestors.map((a) => {return(a.id)})
            }
        }

        let projectTree = projectIds ? looper(projectIds) : null
        return projectTree
    }
};

const styles = {
    drawer: {
        top: '56px'
    },
    nestedListStyle: {
        padding: '0px'
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
