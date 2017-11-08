import React, { PropTypes } from 'react';
const { array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import IconButton from 'material-ui/IconButton';
import LocalOffer from 'material-ui/svg-icons/maps/local-offer';

@observer
class TagCloud extends React.Component {

    render() {
        const { objectTags, projectRole } = mainStore;

        return (
            <div className="chip-container mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                { objectTags.map((tag) => {
                    return (<div key={tag.id} ref={(tag) => this.id = tag} className="chip">
                        <span className="chip-text">{tag.label}</span>
                        <span className="closebtn"
                              onTouchTap={() => this.deleteTag(tag.id, tag.label)}>
                    &times;
                </span>
                    </div>)
                }) }
                { projectRole !== 'project_viewer' && projectRole !== 'file_downloader' ? <IconButton tooltip="Add new tags" tooltipPosition="bottom-right"
                            style={styles.addTagButton}
                            tooltipStyles={{marginTop: -20}}
                            onTouchTap={() => this.openTagManager()}>
                    <LocalOffer color={Color.pink} />
                </IconButton> : null }
            </div>
        )
    }

    deleteTag(id, label) {
        this.id.style.display = 'none';
        mainStore.deleteTag(id, label);
    }

    openTagManager() {
        mainStore.toggleTagManager();
    }
}

const styles = {
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
    projectRole: string,
    objectTags: array
};

export default TagCloud;