import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import MetadataPropertyManager from '../globalComponents/metadataPropertyManager.jsx';
import MetadataTemplateCreator from '../globalComponents/metadataTemplateCreator.jsx';
import MetadataTemplateOptions from '../globalComponents/metadataTemplateOptions.jsx';
import BaseUtils from '../../util/baseUtils'
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

@observer
class MetadataTemplateManager extends React.Component {

    componentDidMount() {
        if (window.performance && mainStore.openMetadataManager) { // If page refreshed, close drawer
            if (performance.navigation.type == 1) {
                this.toggleMetadataManager();
            }
        }
    }

    render() {
        const { drawerLoading, openMetadataManager, screenSize, showPropertyCreator, showTemplateCreator, showTemplateDetails } = mainStore;
        let width = screenSize !== null && Object.keys(screenSize).length !== 0 ? screenSize.width : window.innerWidth;
        return (
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <Drawer disableSwipeToOpen={true} width={width > 640 ? width*.80 : width} openSecondary={true} open={openMetadataManager}>
                    <div className="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800"
                         style={{marginTop: 85}}>
                        <IconButton style={styles.toggleBtn}
                                    onTouchTap={() => this.toggleMetadataManager()}>
                            <NavigationClose />
                        </IconButton>
                    </div>
                    {drawerLoading ? <CircularProgress size={80} thickness={5} style={styles.drawerLoader}/> : <span>
                        {showTemplateCreator ? <MetadataTemplateCreator {...this.props}/> : null}
                        {showTemplateDetails ? <MetadataTemplateOptions {...this.props}/> : null}
                        {showPropertyCreator ? <MetadataPropertyManager {...this.props}/> : null}
                    </span>}
                </Drawer>
            </div>
        )
    }

    toggleMetadataManager() {
        mainStore.toggleMetadataManager();
    }
}

var styles = {
    drawerLoader: {
        position: 'absolute',
        margin: '0 auto',
        top: 200,
        left: 0,
        right: 0
    },
    toggleBtn: {
        margin: '5px 0px 5px 0px',
        zIndex: 9999
    }
};

MetadataTemplateManager.contextTypes = {
    muiTheme: React.PropTypes.object
};

MetadataTemplateManager.propTypes = {
    drawerLoading: bool,
    screenSize: object,
    showPropertyCreator: bool,
    showTemplateCreator: bool,
    showTemplateDetails: bool
};

export default MetadataTemplateManager;