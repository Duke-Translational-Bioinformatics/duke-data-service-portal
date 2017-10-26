import React, { Component, PropTypes } from 'react'
const { object, string } = PropTypes;
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import dashboardStore from '../../stores/dashboardStore';
import { Color } from '../../theme/customTheme';
import { Path } from '../../util/urlEnum';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

@observer
class Breadcrumbs extends Component {
    render() {
        const { selectedItem } = mainStore;
        const { drawer } = dashboardStore;
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
                        label={drawer.get('collapsed') ? 'Expand' : 'Home'}
                        style={selectedItem ? styles.breadCrumb : styles.breadCrumbSelected}
                        onClick={() => dashboardStore.toggleCollapseTree(this.props.router)}
                    />
                    {this.breadCrumb()}
                </Paper> 
          	</div>
        );
    }

    pathFinder(kind) {
        let kinds = {
            'dds-project': Path.PROJECT,
            'dds-folder': Path.FOLDER
        }
        return (kinds[kind])
    }

    breadCrumb() {
        const { selectedItem } = mainStore
        let item = mainStore.downloadedItems.get(selectedItem)
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
                            onClick={() => mainStore.selectItem(bc.id, this.pathFinder(bc.kind))}
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
    drawer: object,
    selectedItem: string
};

export default Breadcrumbs;
