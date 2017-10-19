import React, { Component, PropTypes } from 'react'
const { object, string } = PropTypes;
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { observer } from 'mobx-react'
import mainStore from '../../stores/mainStore';
import AccountListItems from './accountListItems.jsx';
import { Color } from '../../theme/customTheme';
import { Path } from '../../util/urlEnum';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

@observer
class FileGroupDownloader extends Component {
    render() {
        const { drawer, selectedItem } = mainStore;
        const contentStyle = drawer.get('contentStyle')
        const drawerDirection = drawer.get('open') ? '<' : '>'

        return (
            <div style={contentStyle}>
                <Paper style={styles.breadCrumb}>
                    <FlatButton
                        label={drawerDirection}
                        onClick={() => mainStore.toggleDrawer()}
                        style={styles.drawerToggle}
                    />
                    <FlatButton
                        label={drawer.get('collapsed') ? 'Expand' : 'Home'}
                        style={selectedItem ? styles.breadCrumb : styles.breadCrumbSelected}
                        onClick={() => mainStore.toggleCollapseTree(this.props.router)}
                    />
                    {this.breadCrumb()}
                </Paper>
                <AccountListItems {...this.props} />    
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
                        >/</FlatButton>
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
    // card: {
    //     minHeight: 260,
    //     padding: 10
    // },
    // cardTitle: {
    //     fontWeight: 200,
    //     marginBottom: -15,
    //     marginRight: 24
    // },
    // cardTitle2: {
    //     fontWeight: 200,
    //     marginBottom: -15,
    //     padding: '4px 4px 4px 16px'
    // },
    drawerToggle: {
        minHeight: '48px',
        minWidth: '36px'
    },
    // listTitle: {
    //     margin: '0px 0px 0px 0px',
    //     textAlign: 'left',
    //     float: 'left',
    //     paddingLeft: 20
    // },
    // title: {
    //     margin: '-10px 0px 0px 0px',
    //     textAlign: 'left',
    //     float: 'left',
    //     marginLeft: -14
    // }
};

FileGroupDownloader.propTypes = {
    drawer: object,
    selectedItem: string
};

export default FileGroupDownloader;
