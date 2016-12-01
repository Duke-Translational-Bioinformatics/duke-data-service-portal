import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectStore from '../../stores/projectStore';
import Card from 'material-ui/lib/card/card';

const CustomMetadata = () => {
        let metadataItems = [];
        metadataItems = ProjectStore.objectMetadata && ProjectStore.objectMetadata !== null ? ProjectStore.objectMetadata.map((obj)=>{
           let properties = obj.properties.map((prop)=>{
               return <span key={prop.template_property.id}>
                    <li className="list-group-title">{prop.template_property.key}</li>
                    <li className="item-content">
                        <div className="item-inner">
                            <div>{prop.value}</div>
                        </div>
                    </li>
               </span>
           });
           return <span key={obj.template.id}>
                <div className="list-group">
                    <ul>
                        {properties}
                    </ul>
                </div>
           </span>
        }) : null;
        let customMetadata = <Card className="project-container mdl-color--white content mdl-color-text--grey-800"
                                   style={styles.card}>
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block">
                        {metadataItems}
                    </div>
                </div>
        </Card>;
        return (
            <div className="project-container">
                <h5 className="mdl-color-text--grey-800" style={styles.heading}>Custom Metadata</h5>
                {customMetadata}
            </div>
        )
};

var styles = {
    card: {
        padding: '10px 0px 10px 0px'
    },
    heading: {
        paddingLeft: 0,
        marginTop: 15
},
    list: {
        paddingTop: 5,
        clear: 'both'
    }
};

CustomMetadata.contextTypes = {
    muiTheme: React.PropTypes.object
};

CustomMetadata.propTypes = {
    objectMetadata: React.PropTypes.array
};

export default CustomMetadata;