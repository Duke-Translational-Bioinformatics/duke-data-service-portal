import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { observer } from 'mobx-react'
import authStore from '../../stores/authStore';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import {Path} from '../../util/urlEnum';
import Drawer from 'material-ui/Drawer'
import Subheader from 'material-ui/Subheader'
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {Card, CardTitle, CardText} from 'material-ui/Card'
import {MuiTreeList} from 'react-treeview-mui'
import {TreeList} from 'react-treeview-mui'
import FontIcon from 'material-ui/FontIcon'
import AccountListItems from './accountListItems.jsx';
import Paper from 'material-ui/Paper';

@observer
class FileGroupDownloader extends Component {
    render() {
        const {fileMultiSelect, files, drawer} = mainStore;
        const contentStyle = drawer.get('contentStyle')
        const drawerDirection = drawer.get('open') ? '<' : '>'

        return (
            <div style={contentStyle}>
                <Paper style={styles.breadCrumb}>
                    <FlatButton
                        label={drawerDirection}
                        onClick={() => mainStore.toggleDrawer()}
                        style={{minWidth: '36px', minHeight: styles.breadCrumb.minHeight}}
                    />
                    <FlatButton
                        label="Home"
                        style={{minHeight: styles.breadCrumb.minHeight}}
                        onClick={() => mainStore.collapseTree(this.props.router)}
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
        let item = mainStore.downloadedItems.get(mainStore.selectedItem)
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
                            style={{minHeight: styles.breadCrumb.minHeight}}
                            onClick={() => mainStore.selectItem(bc.id, this.pathFinder(bc.kind))}
                        >\</FlatButton>
                    )
                })
            )
        }
    }
}

const styles = {
    card: {
        minHeight: 260,
        padding: 10
    },
    cardTitle: {
        fontWeight: 200,
        marginBottom: -15,
        marginRight: 24
    },
    cardTitle2: {
        fontWeight: 200,
        marginBottom: -15,
        padding: '4px 4px 4px 16px'
    },
    breadCrumb: {
        width: '100%',
        minHeight: '48px'
    },
    icon: {
        fontSize: 36,
        float: 'left',
        margin: '20px 15px 0px 13px',
        color: Color.dkGrey2
    },
    listTitle: {
        margin: '0px 0px 0px 0px',
        textAlign: 'left',
        float: 'left',
        paddingLeft: 20
    },
    menuIcon: {
        float: 'right',
        marginTop: 19,
        marginRight: 3
    },
    title: {
        margin: '-10px 0px 0px 0px',
        textAlign: 'left',
        float: 'left',
        marginLeft: -14
    }
};

export default FileGroupDownloader;
