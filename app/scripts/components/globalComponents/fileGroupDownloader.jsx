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

@observer
class FileGroupDownloader extends Component {
    render() {
        const {fileMultiSelect, files} = mainStore;

        return (
        		<div className="mdl-grid">
          			<div className="mdl-cell mdl-cell--3-col mdl-cell--8-col-tablet"></div>
          			<Card className="mdl-cell mdl-cell--9-col mdl-cell--8-col-tablet" style={styles.card}>
          					<CardTitle titleColor="#424242" style={styles.cardTitle}>
                        <FlatButton
                            label="Home"
                            primary={true}
                            onClick={() => mainStore.collapseTree()}
                        />
                        {this.breadCrumb()}
                    </CardTitle>
          					<CardText>
                        <AccountListItems {...this.props} />
          					</CardText>
          			</Card>
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
                            primary={true}
                            onClick={() => mainStore.selectItem(bc.id, this.pathFinder(bc.kind))}
                        >/</FlatButton>
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
