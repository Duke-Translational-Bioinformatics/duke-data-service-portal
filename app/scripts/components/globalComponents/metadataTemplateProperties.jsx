import React, { PropTypes } from 'react';
const { object, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import authStore from '../../stores/authStore';
import { Color } from '../../theme/customTheme';
import BaseUtils from '../../util/baseUtils'

@observer
class MetadataTemplateProperties extends React.Component {

    render() {
        const { templateProperties } = mainStore;
        const { currentUser } = authStore;
        let properties = templateProperties && templateProperties.length !== 0 ? templateProperties.map((obj)=>{
            let type = BaseUtils.getTemplatePropertyType(obj.type);
            return (
                <span key={obj.id}>
                    <li className="item-content" style={styles.listStyles}>
                        <div className="item-inner">
                            <div className="item-title-row">
                                <div className="item-title">{obj.key}</div>
                            </div>
                        </div>
                        <div className="item-after" style={styles.datatypeHeading}>{type}</div>
                        {currentUser.id === obj.audit.created_by.id ? <div className="item-after">
                            <i className="material-icons" style={styles.deleteIcon} onTouchTap={()=>this.deleteProperty(obj.id, obj.label)}>delete_forever</i>
                        </div> : null}
                    </li>
                </span>
            )
        }) : null;

        return (
            <div className="list-block">
                <div className="list-group">
                    <ul>
                        <li className="list-group-title">Key<span style={styles.listHeader}>Datatype</span></li>
                        {properties}
                    </ul>
                </div>
            </div>
        )
    }

    deleteProperty(id, label) {
        mainStore.deleteMetadataProperty(id, label);
    }
}

const styles = {
    datatypeHeading: {
        paddingRight: 50
    },
    deleteIcon: {
        fontSize: 22,
        color: Color.red,
        cursor: 'pointer'
    },
    listHeader: {
        float: 'right',
        paddingRight: 60
    },
    listStyles: {
        borderBottom: '1px solid #E0E0E0'
    }
};

MetadataTemplateProperties.contextTypes = {
    muiTheme: React.PropTypes.object
};

MetadataTemplateProperties.propTypes = {
    currentUser: object,
    templateProperties: array
};

export default MetadataTemplateProperties;