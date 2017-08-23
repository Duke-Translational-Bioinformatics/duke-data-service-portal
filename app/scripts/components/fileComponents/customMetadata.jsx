import React, { PropTypes } from 'react';
const { array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import Card from 'material-ui/Card';

const CustomMetadata = observer(() => {
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
                <div className="list-group" style={{listStyle: 'none'}}>
                    <li className="list-group-title">{obj.template.name}<i className="material-icons" style={{float: 'right', cursor: 'pointer', color: 'red'}}>delete_forever</i></li>
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
        <div className="project-container" style={styles.wrapper}>
            <h5 className="mdl-color-text--grey-800" style={styles.heading}>Custom Metadata</h5>
            {customMetadata}
        </div>
    )
});

const styles = {
    card: {
        padding: '10px 0px 10px 0px',
        marginTop: 0
    },
    heading: {
        paddingLeft: 0,
        marginTop: 15
    },
    list: {
        paddingTop: 5,
        clear: 'both'
    },
    wrapper: {
        marginTop: 0
    }
};

CustomMetadata.contextTypes = {
    muiTheme: React.PropTypes.object
};

CustomMetadata.propTypes = {
    objectMetadata: array
};

export default CustomMetadata;