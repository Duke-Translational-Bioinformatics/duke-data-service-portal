import React, { PropTypes } from 'react';
const { array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import Card from 'material-ui/Card';

import IconButton from 'material-ui/IconButton';

@observer
class CustomMetadata extends React.Component {

    render() {
        const {objectMetadata} = mainStore;

        let metadataItems = objectMetadata && objectMetadata.length ? objectMetadata.map((obj) => {
            let properties = obj.properties.map((prop)=>{
                return <span key={prop.template_property.id}>
                        <li className="item-content">
                            <div className="item-inner">
                                <div className="mdl-color-text--grey-600">{prop.template_property.key+' '}<span className="mdl-color-text--grey-800">=></span><span className="mdl-color-text--grey-600">{' '+prop.value}</span></div>
                            </div>
                        </li>
                   </span>
            });
            return <span key={obj.template.id}>
                    <div className="list-group" style={styles.listStyle}>
                        <li className="list-group-title" style={styles.listItemPadding}>{obj.template.name}
                            <IconButton
                                iconClassName="material-icons"
                                style={styles.deleteIcon}
                                iconStyle={styles.deleteIcon.iconColor}
                                onTouchTap={() => this.deleteObjectMetadata(obj.object, obj.template)} >
                                delete_forever
                            </IconButton>
                        </li>
                        <ul>
                            {properties}
                        </ul>
                    </div>
               </span>
        }) : null;
        let customMetadata = <Card style={styles.card}>
            <div className="mdl-cell mdl-cell--12-col" style={styles.list}>
                <div className="list-block">
                    {metadataItems}
                </div>
            </div>
        </Card>;
        return (
            <div className="project-container mdl-cell mdl-cell--12-col" style={styles.wrapper}>
                <h5 className="mdl-color-text--grey-800" style={styles.heading}>Custom Metadata</h5>
                {customMetadata}
            </div>
        )
    }

    deleteObjectMetadata(object, template) {
        mainStore.deleteObjectMetadata(object, template);
    };

}

const styles = {
    card: {
        padding: '10px 0px 10px 0px',
        marginTop: 0
    },
    deleteIcon: {
        float: 'right',
        cursor: 'pointer',
        iconColor: {
            color: Color.red
        }
    },
    heading: {
        paddingLeft: 0,
        marginTop: 15
    },
    list: {
        paddingTop: 5,
        clear: 'both'
    },
    listStyle: {
        listStyle: 'none'
    },
    listItemPadding: {
        paddingRight: 0
    },
    wrapper: {
        margin: '0 auto'
    }
};

CustomMetadata.contextTypes = {
    muiTheme: React.PropTypes.object
};

CustomMetadata.propTypes = {
    objectMetadata: array
};

export default CustomMetadata;