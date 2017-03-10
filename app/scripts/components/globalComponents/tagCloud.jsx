import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import Tooltip from '../../../util/tooltip.js';
import IconButton from 'material-ui/IconButton';
import LocalOffer from 'material-ui/svg-icons/maps/local-offer';

@observer
class TagCloud extends React.Component {

    render() {
        const {objectTags, projPermissions} = mainStore;
        let addTagButton = null;
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
        if(prjPrm !== 'viewOnly' && prjPrm !== 'flDownload') {
            addTagButton = <IconButton tooltip="Add new tags" tooltipPosition="bottom-right"
                                       style={styles.addTagButton}
                                       tooltipStyles={{marginTop: -20}}
                                       onTouchTap={() => this.openTagManager()}>
                                <LocalOffer color={'#EC407A'} />
                           </IconButton>
        }
        let tags = objectTags.map((tag)=>{
            return (<div key={tag.id} ref={(tag) => this.id = tag} className="chip">
                <span className="chip-text">{tag.label}</span>
                <span className="closebtn"
                      onTouchTap={() => this.deleteTag(tag.id, tag.label)}>
                    &times;
                </span>
            </div>)
        });
        return (
            <div className="chip-container mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                {tags}
                {addTagButton}
            </div>
        )
    }

    deleteTag(id, label) {
        let fileId = this.props.params.id;
        this.id.style.display = 'none';
        mainStore.deleteTag(id, label, fileId);
    }

    openTagManager() {
        mainStore.toggleTagManager();
    }
}

var styles = {
    // Additional styles for chips located in stylus/main.styl
    addTagButton: {
        height: 24,
        width: 24,
        padding: 0,
        margin: '5px 5px 5px 9px'
    }
};

TagCloud.contextTypes = {
    muiTheme: React.PropTypes.object
};

TagCloud.propTypes = {
    loading: bool,
    details: array,
    error: object
};

export default TagCloud;