import React from 'react';
import PropTypes from 'prop-types';
const { array, object, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import navigatorStore from '../../stores/navigatorStore';
import { UrlGen, Kind } from '../../util/urlEnum';
import { WindowBreak } from '../../theme/customTheme';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';

@observer
class TreeList extends React.Component {
    render() {
        const { leftMenuDrawer, projects, screenSize } = mainStore;
        const { downloadedItems, drawer, selectedItem } = navigatorStore;
        let projectIds = projects.map(p => p.id);

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
        }
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
        navigatorStore.selectItem(item.id, this.props.router, true);
    }

    iconPicker(child, ancestorIds, selectedItem) {
        let iconKind;
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

    routeFinder(item) { // Todo: remove unused method
        if (item.kind === Kind.DDS_PROJECT) {
            return UrlGen.routes.navigatorProject(item.id);
        } else if (item.kind === Kind.DDS_FOLDER) {
            return UrlGen.routes.navigatorFolder(item.id);
        }
    }

    buildTree(downloadedItems, projectIds, selectedItem) {
        const looper = (itemIds) => {
            return (
                itemIds.map((id) => {
                    let child = downloadedItems.get(id);
                    if (child && child.kind !== 'dds-file') {
                        let grandChildren = [];
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
                                onClick={() => this.handleTouchTap(child)}
                                onKeyDown={(e) => this.handleKeyDown(e, child)}
                                style={this.listItemStyle(child, selectedItem)}
                                nestedListStyle={styles.nestedListStyle}
                                onNestedListToggle={() => navigatorStore.toggleTreeListItem(child)}
                            />
                        )
                    }
                })
            )
        };

        let ancestorIds = [];
        if (selectedItem) {
            if (downloadedItems.size > 0 && selectedItem && selectedItem.ancestors && selectedItem.ancestors.length > 0) {
                ancestorIds = selectedItem.ancestors.map((a) => a.id)
            }
        }
        return projectIds ? looper(projectIds) : null;
    }
}

const styles = {
    drawer: {
        top: '56px',
        paddingBottom: 64,
    },
    nestedListStyle: {
        padding: '0px'
    },
    selected: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
};

TreeList.propTypes = {
    downloadedItems: object,
    drawer: object,
    projects: array,
    selectedItem: string
};

export default TreeList;
