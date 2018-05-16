import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import authStore from '../../stores/authStore';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import { UrlGen } from '../../util/urlEnum';
import CurrentUser from '../globalComponents/currentUser.jsx';
import Search from '../globalComponents/search.jsx';
import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import dukeDSVertical from '../../images/dukeDSVertical.png';
const { object, bool } = PropTypes;

@observer
class Header extends React.Component {

    render() {
        const { appConfig } = authStore;
        const { showSearch } = mainStore;
        let header = null;
        if (!!appConfig.apiToken) {
            header = !showSearch ? this.navBar() : <Search {...this.props} />;
        }
        return header;
    }

    navBar() {
        return (
            <Toolbar className="navbar" style={styles.toolbar}>
                <ToolbarGroup firstChild={true} style={styles.toolbar.firstToolbarGroup}>
                    {this.menuButton()}
                    <a onClick={() => this.goHome()}>
                        <img src={dukeDSVertical} style={styles.logo} alt="Duke data service logo"/>
                    </a>
                </ToolbarGroup>
                <ToolbarGroup lastChild={true}>
                    <FontIcon className="material-icons" style={styles.searchIcon} onTouchTap={()=>this.toggleSearch()}>
                        search
                    </FontIcon>
                    <CurrentUser {...this.props} />
                </ToolbarGroup>
            </Toolbar>
        )
    }

    goHome() {
        this.props.router.push(UrlGen.routes.home());
    }

    menuButton() {
        const { leftMenuDrawer } = mainStore;
        let menuIcon = leftMenuDrawer.get('open') ? 'close' : 'menu';
        return (
            <a onTouchTap={()=>this.toggleNav()}>
                <FontIcon className="material-icons" style={styles.menuIcon}>{menuIcon}</FontIcon>
            </a>
        );
    }

    toggleNav() {
        mainStore.toggleLeftMenuDrawer();
        mainStore.setLeftNavIndex(this.props.router.location.pathname)
    }

    toggleSearch() {
        mainStore.toggleSearch();
        if(mainStore.leftMenuDrawer.get('open')) mainStore.toggleLeftMenuDrawer();
    }
}

const styles = {
    logo: {
        cursor: 'pointer',
        width: '20%',
        maxWidth: '20%',
        minWidth: 58,
        minHeight: 46,
        marginBottom: 4,
        marginLeft: 20,
    },
    navBar: {
        height: 76,
        centerDiv: {
            width: '100%'
        },
        leftDiv: {
            maxWidth: 130,
            marginBottom: 35
        }
    },
    menuIcon: {
        fontSize: 24,
        color: Color.white,
        margin: '4px 10px 0px 10px'
    },
    searchIcon: {
        color: Color.white,
        cursor: 'pointer'
    },
    toolbar: {
        backgroundColor: Color.blue,
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px',
        firstToolbarGroup: {
            backgroundColor: Color.blue,
            justifyContent: 'flex-start'
        }
    }
};

Header.propTypes = {
    appConfig: object,
    leftMenuDrawer: object,
    showSearch: bool
};

export default Header;