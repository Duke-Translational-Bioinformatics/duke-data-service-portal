import React from 'react'
import PropTypes from 'prop-types';
const { object, string } = PropTypes;
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'; // Todo: remove cruft
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore'; // Todo: remove cruft
import dashboardStore from '../../stores/dashboardStore';
import { Color } from '../../theme/customTheme';
import { UrlGen, Kind, Path } from '../../util/urlEnum';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

@observer
class Breadcrumbs extends React.Component {
    render() {
        const { drawer, selectedItem } = dashboardStore;
        const drawerDirectionIcon = drawer.get('open') ? 'chevron_left' : 'chevron_right'
        return (
            <Paper style={styles.breadCrumb}>
                <IconButton
                    iconClassName="material-icons"
                    onClick={() => dashboardStore.toggleDrawer()}
                    style={styles.breadCrumbButton}
                    hoveredStyle={styles.hover}
                >
                    {drawerDirectionIcon}
                </IconButton>
                <a href={UrlGen.routes.dashboardHome()} className="external">
                    <IconButton
                        iconClassName="material-icons"
                        style={styles.breadCrumbButton}
                        hoveredStyle={styles.hover}
                    >home</IconButton>
                </a>
                {this.breadCrumb()}
            </Paper> 
        );
    }

    pathFinder(kind) {
        let path
        switch (kind) {
        case Kind.DDS_PROJECT:
            path = Path.PROJECT;
            break;
        case Kind.DDS_FOLDER:
            path = Path.FOLDER;
            break;
        }
        return (path)
    }

    breadCrumb() {
        const { selectedItem, downloadedItems } = dashboardStore;
        let item = downloadedItems.get(selectedItem)
        if (item) {
            let ancestorPath = [item]
            if (item.ancestors) {
                ancestorPath = [...item.ancestors, item]
            }
            return (
                ancestorPath.map((bc) => {
                    return (
                        <FlatButton
                            key={bc.id}
                            label={bc.name.length > 20 ? bc.name.substring(0, 20) + '...' : bc.name}
                            style={selectedItem === bc.id ? styles.breadCrumbSelected : styles.breadCrumb}
                            onClick={() => dashboardStore.selectItem(bc.id, this.pathFinder(bc.kind))}
                        >
                            <span style={{color: styles.breadCrumb.color}}>/</span>
                        </FlatButton>
                    )
                })
            )
        }
    }
}

const styles = {
    breadCrumb: {
        top: '-7px',
        height: '36px',
        color: Color.ltGrey
    },
    breadCrumbSelected: {
        top: '-7px',
        height: '36px'
    },
    breadCrumbButton: {
        height: '36px',
        paddingTop: '6px'
    },
    hover: {
        backgroundColor: Color.ltGrey3
    }
};

Breadcrumbs.propTypes = {
    downloadedItems: object,
    drawer: object,
    selectedItem: string
};

export default Breadcrumbs;
