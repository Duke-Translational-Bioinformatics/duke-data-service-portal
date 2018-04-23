import React from 'react'
import PropTypes from 'prop-types';
const { object, string } = PropTypes;
import { observer } from 'mobx-react';
import navigatorStore from '../../stores/navigatorStore';
import { Color } from '../../theme/customTheme';
import { UrlGen, Kind, Path } from '../../util/urlEnum';
import BaseUtils from '../../util/baseUtils';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

@observer
class Breadcrumbs extends React.Component {
    render() {
        const { drawer, downloadedItems, selectedItem } = navigatorStore;
        const drawerDirectionIcon = drawer.get('open') ? 'chevron_left' : 'chevron_right';
        return (
            <Paper>
                <IconButton
                    iconClassName="material-icons"
                    onClick={() => navigatorStore.toggleDrawer()}
                    style={styles.breadCrumbButton}
                    hoveredStyle={styles.hover}
                >
                    {drawerDirectionIcon}
                </IconButton>
                <a href={UrlGen.routes.navigatorHome()} className="external">
                    <IconButton
                        iconClassName="material-icons"
                        style={styles.breadCrumbButton}
                        hoveredStyle={styles.hover}
                    >home</IconButton>
                </a>
                {this.breadCrumb(downloadedItems, selectedItem)}
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

    breadCrumb(downloadedItems, selectedItem) {
        if (selectedItem) {
            let ancestorPath = [selectedItem]
            if (selectedItem.ancestors) {
                ancestorPath = [...selectedItem.ancestors, selectedItem]
            }
            return (
                ancestorPath.map((bc) => {
                    let lable = bc.name && bc.name.length > 20 ? bc.name.substring(0, 20) + '...' : bc.name;
                    let route = `/#/${BaseUtils.getUrlPath(bc.kind, true) + bc.id}`;
                    return (
                        <a key={bc.id} href={route} className="external">
                            <FlatButton
                                label={lable}
                                style={selectedItem.id === bc.id ? styles.breadCrumbSelected : styles.breadCrumb}
                                onClick={() => navigatorStore.selectItem(bc.id, this.props.router)}
                                hoveredStyle={styles.hover}
                            >
                                <span style={{color: styles.breadCrumb.color}}> / </span>
                            </FlatButton>
                        </a>
                    )
                })
            )
        }
    }
}

const styles = {
    breadCrumb: {
        top: '-7px',
        minHeight: '36px',
        color: Color.blue,
    },
    breadCrumbSelected: {
        top: '-7px',
        minHeight: '36px',
    },
    breadCrumbButton: {
        minHeight: '36px',
        paddingTop: '6px',
    },
    hover: {
        backgroundColor: Color.ltGrey3,
        color: 'blue',
        textDecoration: 'underline',
    }
};

Breadcrumbs.propTypes = {
    downloadedItems: object,
    drawer: object,
    selectedItem: string,
};

export default Breadcrumbs;
