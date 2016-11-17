import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import MetadataPropertyManager from '../globalComponents/metadataPropertyManager.jsx';
import MetadataTemplateCreator from '../globalComponents/metadataTemplateCreator.jsx';
import MetadataTemplateOptions from '../globalComponents/metadataTemplateOptions.jsx';
import BaseUtils from '../../../util/baseUtils'
import AddCircle from 'material-ui/lib/svg-icons/content/add-circle';
import AutoComplete from 'material-ui/lib/auto-complete';
import CircularProgress from 'material-ui/lib/circular-progress';
import Divider from 'material-ui/lib/divider';
import IconButton from 'material-ui/lib/icon-button';
import LeftNav from 'material-ui/lib/left-nav';
import Help from 'material-ui/lib/svg-icons/action/help';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

class MetadataTemplateManager extends React.Component {

    componentDidMount() {
        if (window.performance && this.props.openMetadataManager) { // If page refreshed, close drawer
            if (performance.navigation.type == 1) {
                this.toggleMetadataManager();
            }
        }
    }

    render() {
        let height = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.height : window.innerHeight;
        let width = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.width : window.innerWidth;
        return (
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <LeftNav disableSwipeToOpen={true} width={width > 640 ? width*.80 : width} openRight={true} open={this.props.openMetadataManager}>
                    <div className="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800"
                         style={{marginTop: width > 680 ? 65 : 85}}>
                        <IconButton style={styles.toggleBtn}
                                    onTouchTap={() => this.toggleMetadataManager()}>
                            <NavigationClose />
                        </IconButton>
                    </div>
                    {this.props.drawerLoading ? <CircularProgress size={1.5} style={styles.drawerLoader}/> : <span>
                        {this.props.showTemplateCreator ? <MetadataTemplateCreator {...this.props}/> : null}
                        {this.props.showTemplateDetails ? <MetadataTemplateOptions {...this.props}/> : null}
                        {this.props.showPropertyCreator ? <MetadataPropertyManager {...this.props}/> : null}
                    </span>}
                </LeftNav>
            </div>
        )
    }

    toggleMetadataManager() {
        ProjectActions.toggleMetadataManager();
    }
}

var styles = {
    buttonWrapper: {
        textAlign: 'left'
    },
    drawerLoader: {
        position: 'absolute',
        margin: '0 auto',
        top: 200,
        left: 0,
        right: 0
    },
    heading: {
        textAlign: 'center'
    },
    infoIcon: {
        verticalAlign: 8
    },
    textFieldContainer: {
        textAlign: 'left'
    },
    toggleBtn: {
        margin: '25px 0px 15px 0px',
        zIndex: 9999
    }
};

MetadataTemplateManager.contextTypes = {
    muiTheme: React.PropTypes.object
};

MetadataTemplateManager.propTypes = {
    drawerLoading: bool
};

export default MetadataTemplateManager;