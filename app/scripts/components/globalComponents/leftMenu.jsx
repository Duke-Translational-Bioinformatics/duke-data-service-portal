import React from 'react';
import PropTypes from 'prop-types';
const { object, bool } = PropTypes;
import { observer } from 'mobx-react';
import authStore from '../../stores/authStore';
import mainStore from '../../stores/mainStore';
import {Color} from '../../theme/customTheme';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends React.Component {

        componentWillMount() {
            mainStore.setLeftNavIndex(this.props.router.location.pathname)
        }

        handleRequestChange = (event, index) => {
            this.props.router.replace(index)
        };

        render() {
            const { leftNavIndex, leftMenuDrawer } = mainStore;
            return (
                <ComposedComponent style={styles.listContainer} value={leftMenuDrawer.get('index')} onChange={this.handleRequestChange}>
                    {this.props.children}
                </ComposedComponent>
            );
        }
    };
}

SelectableList = observer(wrapState(SelectableList));

@observer
class LeftMenu extends React.Component {

    render() {
        const { leftMenuDrawer, screenSize, showSearch } = mainStore;
        const drawerWidth = screenSize.width >= 700 ? 240 : screenSize.width;

        return (
            <Drawer width={drawerWidth} open={leftMenuDrawer.get('open') && !showSearch} zDepth={0} containerStyle={styles.drawer}>
                <SelectableList router={this.props.router}>
                    <ListItem
                        value={'/'}
                        onClick={() => this.setNavIndex('/')}
                        leftIcon={<i className="material-icons" style={styles.navIcon}>home</i>}
                        primaryText="Home"
                    />
                    <ListItem
                       value={'/dashboard'}
                       onClick={() => this.setNavIndex('/dashboard')}
                       leftIcon={<i className="material-icons" style={styles.navIcon}>view_list</i>}
                       primaryText="Dashboard"
                    />
                    <ListItem
                        value={'/metadata'}
                        onClick={() => this.setNavIndex('/metadata')}
                        leftIcon={<i className="material-icons" style={styles.navIcon}>local_offer</i>}
                        primaryText="Advanced Metadata"
                    />
                    <ListItem
                        value={'/agents'}
                        onClick={() => this.setNavIndex('/agents')}
                        primaryText="Software Agents"
                        leftIcon={<i className="material-icons" style={styles.navIcon}>group_work</i>}
                    />
                    <Divider/>
                    <ListItem
                        value={0}
                        primaryText="Resources"
                        leftIcon={<i className="material-icons" style={styles.navIcon}>build</i>}
                        primaryTogglesNestedList={true}
                        nestedItems={[
                            <ListItem
                                value={1}
                                onClick={() => this.linkToOutsideResource('https://api.dataservice.duke.edu/apidocs/')}
                                leftIcon={<i className="material-icons" style={styles.navIcon}>info</i>}
                                primaryText="Duke DS API Docs"
                            />,
                            <ListItem
                                value={2}
                                onClick={() => this.linkToOutsideResource('https://github.com/Duke-Translational-Bioinformatics/duke-data-service')}
                                leftIcon={<i className="material-icons" style={styles.navIcon}>code</i>}
                                primaryText="Duke DS API Github"
                            />,
                            <ListItem
                                value={3}
                                onClick={() => this.linkToOutsideResource('https://github.com/Duke-Translational-Bioinformatics/duke-data-service-portal')}
                                leftIcon={<i className="material-icons" style={styles.navIcon}>code</i>}
                                primaryText="Duke DS Web Portal Github"
                            />]}
                    />
                    <ListItem
                        value={'/privacy'}
                        onClick={() => this.setNavIndex('/privacy')}
                        primaryText="Privacy Policy"
                        leftIcon={<i className="material-icons" style={styles.navIcon}>lock</i>}
                    />
                    <Divider/>
                    <ListItem
                        value={1}
                        onClick={() => this.handleLogout()}
                        primaryText="Log Out"
                        leftIcon={<i className="material-icons" style={styles.navIcon}>exit_to_app</i>}
                    />
                </SelectableList>
            </Drawer>
        );
    }

    linkToOutsideResource(link) {
        const { screenSize } = mainStore;
        screenSize.width < 700 ? this.toggleNav() : null;
        const win = window.open(link, '_blank');
        win ? win.focus() : alert('Please allow popups for this website');
    }

    setNavIndex(index) {
        const { screenSize } = mainStore;
        mainStore.setLeftNavIndex(index);
        screenSize.width < 700 ? this.toggleNav() : null;
    }

    toggleNav() {
        mainStore.toggleNavDrawer();
    }

    handleLogout() {
        authStore.handleLogout();
        location.reload();
    }
}

const toolbarHeight = '56px'
const styles = {
    drawer: {
        backgroundColor: Color.ltGrey3,
        position: 'absolute',
        top: toolbarHeight,
        zIndex: 1
    },
    logo: {
        width: '20%',
        maxWidth: '20%',
        minWidth: 58,
        minHeight: 46,
        marginBottom: 4
    },
    listContainer: {
        padding: '8px 4px'
    },
    navIcon: {
        paddingRight: 5,
        verticalAlign: -6
    },
    toolbar: {
        height: toolbarHeight,
        backgroundColor: Color.blue,
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px',
        firstToolbarGroup: {
            backgroundColor: Color.blue,
            justifyContent: 'flex-start'
        }
    }
};

LeftMenu.propTypes = {
    leftMenuDrawer: object,
    screenSize: object,
    showSearch: bool
};

export default LeftMenu;