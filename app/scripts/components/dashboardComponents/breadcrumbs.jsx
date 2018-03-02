import React from 'react'
import PropTypes from 'prop-types';
const { object, string } = PropTypes;
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import dashboardStore from '../../stores/dashboardStore';
import { Color } from '../../theme/customTheme';
import { Kind, Path } from '../../util/urlEnum';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

@observer
class Breadcrumbs extends React.Component {
    render() {
        const { drawer, selectedItem } = dashboardStore;
        const contentStyle = drawer.get('contentStyle')
        const drawerDirection = drawer.get('open') ? '<' : '>'

        return (
            <div style={contentStyle}>
                <Paper style={styles.breadCrumb}>
                    <FlatButton
                        label={drawerDirection}
                        onClick={() => dashboardStore.toggleDrawer()}
                        style={styles.drawerToggle}
                    />
                    <FlatButton
                        label={drawer.get('toggleLable')}
                        style={selectedItem ? styles.breadCrumb : styles.breadCrumbSelected}
                        onClick={() => dashboardStore.toggleCollapseTree(this.props.router)}
                    />
                    {this.breadCrumb()}
                </Paper> 
          	</div>
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
        minHeight: '48px',
        color: Color.ltGrey
    },
    breadCrumbSelected: {
        minHeight: '48px'
    },
    drawerToggle: {
        minHeight: '48px',
        minWidth: '36px'
    }
};

Breadcrumbs.propTypes = {
    downloadedItems: object,
    drawer: object,
    selectedItem: string
};

export default Breadcrumbs;
