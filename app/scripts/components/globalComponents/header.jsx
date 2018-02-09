import React from 'react';
import PropTypes from 'prop-types';
const { object, bool } = PropTypes;
import { observer } from 'mobx-react';
import authStore from '../../stores/authStore';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import CurrentUser from '../globalComponents/currentUser.jsx';
import Search from '../globalComponents/search.jsx';
import FontIcon from 'material-ui/FontIcon';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

@observer
class Header extends React.Component {

    render() {
        const { appConfig } = authStore;
        const { showSearch } = mainStore;
        let header = !showSearch ? <Toolbar className="navbar" style={styles.toolbar}>
            <ToolbarGroup firstChild={true} style={styles.toolbar.firstToolbarGroup}>
                {!appConfig.apiToken ? '' : <a href="#" onTouchTap={()=>this.toggleNav()}><FontIcon className="material-icons" style={styles.openIcon}>menu</FontIcon></a>}
                {!appConfig.apiToken ? '' : <img src="/images/dukeDSVertical.png" style={styles.logo}/>}
            </ToolbarGroup>
            <ToolbarGroup lastChild={true}>
                <FontIcon className="material-icons" style={styles.searchIcon} onTouchTap={()=>this.toggleSearch()}>
                    search
                </FontIcon>
                <CurrentUser {...this.props} />
            </ToolbarGroup>
        </Toolbar> : <Search {...this.props} />;

        if(!appConfig.apiToken) {
            return null;
        } else {
            return header
        }
    }

    toggleNav() {
        mainStore.toggleNavDrawer();
        mainStore.setLeftNavIndex(this.props.router.location.pathname)
    }

    toggleSearch() {
        mainStore.toggleSearch();
        mainStore.toggleNav ? mainStore.toggleNavDrawer() : null;
    }
}

const styles = {
    logo: {
        width: '20%',
        maxWidth: '20%',
        minWidth: 58,
        minHeight: 46,
        marginBottom: 4
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
    openIcon: {
        fontSize: 24,
        color: '#fff',
        margin: '4px 10px 0px 10px'
    },
    searchIcon: {
        color: "#fff",
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
    showSearch: bool,
    appConfig: object
};

export default Header;