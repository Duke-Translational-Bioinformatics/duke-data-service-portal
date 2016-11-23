import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BaseUtils from '../../../util/baseUtils'

class MetadataTemplateProperties extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let currentUser = this.props.currentUser && this.props.currentUser !== null ? this.props.currentUser : null;
        let properties = this.props.templateProperties && this.props.templateProperties.length !== 0 ? this.props.templateProperties.map((obj)=>{
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
                            <i className="material-icons" style={styles.deleteIcon} onTouchTap={()=>this.deleteProperty(obj.id, obj.label)}>cancel</i>
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
        ProjectActions.deleteMetadataProperty(id, label);
    }
}

var styles = {
    datatypeHeading: {
        paddingRight: 50
    },
    deleteIcon: {
        fontSize: 18,
        color: '#F44336',
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
    currentUser: React.PropTypes.object,
    templateProperties: React.PropTypes.array
};

export default MetadataTemplateProperties;