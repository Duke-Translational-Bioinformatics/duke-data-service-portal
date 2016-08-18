import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import Tooltip from '../../../util/tooltip.js';
import IconButton from 'material-ui/lib/icon-button';
import LocalOffer from 'material-ui/lib/svg-icons/maps/local-offer';

class TagCloud extends React.Component {

    render() {
        let addTagButton = null;
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        if(prjPrm !== 'viewOnly' && prjPrm !== 'flDownload') {
            addTagButton = <IconButton tooltip="Add new tags" tooltipPosition="bottom-right"
                                       style={styles.addTagButton}
                                       tooltipStyles={{marginTop: -20}}
                                       onTouchTap={() => this.openTagManager()}>
                                <LocalOffer color={'#235F9C'} />
                           </IconButton>
        }
        let tags = this.props.objectTags.map((tag)=>{
            return (<div key={tag.id} id={tag.id} className="chip">
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
        document.getElementById(id).style.display = 'none';
        ProjectActions.deleteTag(id, label, fileId);
    }

    openTagManager() {
        ProjectActions.toggleTagManager();
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