import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import BaseUtils from '../../../util/baseUtils.js';
import {UrlGen} from '../../../util/urlEnum';

@observer
class ProvenanceDetails extends React.Component {

    render() {
        const { onClickProvNode } = provenanceStore;
        const { entityObj } = mainStore;
        let details = null;
        if (onClickProvNode && onClickProvNode.properties.hasOwnProperty('audit')) {
            function createdOnDate(created) {
                let x = new Date(created);
                let createdOn = x.toString();
                return createdOn;
            }
            let id = this.props.params.id;
            let versionId = null;
            let activityName = onClickProvNode !== null && onClickProvNode.properties.kind === 'dds-activity' ? onClickProvNode.properties.name : null;
            let activityDescription = onClickProvNode !== null && onClickProvNode.properties.kind === 'dds-activity' ? onClickProvNode.properties.description : null;
            let fileName = onClickProvNode !== null && onClickProvNode.properties.file ? onClickProvNode.properties.file.name : null;
            if (fileName === null && onClickProvNode !== null && onClickProvNode.properties.current_version) fileName = onClickProvNode.properties.name;
            let fileId = onClickProvNode !== null && onClickProvNode.properties.file ? onClickProvNode.properties.file.id : null;
            if (fileId === null && onClickProvNode !== null && onClickProvNode.properties.current_version) versionId = onClickProvNode.properties.current_version.id;
            let projectName = entityObj && entityObj.ancestors ? entityObj.ancestors[0].name : null;
            let crdOn = onClickProvNode !== null && onClickProvNode.properties.audit ? onClickProvNode.properties.audit.created_on : null;
            let createdOn = createdOnDate(crdOn);
            let createdBy = onClickProvNode !== null && onClickProvNode.properties.audit ? onClickProvNode.properties.audit.created_by.full_name : null;
            let lastUpdatedOn = onClickProvNode !== null && onClickProvNode.properties.audit ? onClickProvNode.properties.audit.last_updated_on : null;
            let lastUpdatedBy = onClickProvNode !== null && onClickProvNode.properties.audit.last_updated_by ? onClickProvNode.properties.audit.last_updated_by.full_name : null;
            let storage = null;
            if (onClickProvNode !== null && onClickProvNode.properties.kind !== 'dds-activity') {
                storage = onClickProvNode.properties && onClickProvNode.properties.upload ?
                    onClickProvNode.properties.upload.storage_provider.description :
                    onClickProvNode.properties.current_version.upload.storage_provider.description;
            }
            let fileLink = null;
            if (fileName !== null) {
                fileLink = <a href={fileId !== null ?
                UrlGen.routes.file(fileId) :
                UrlGen.routes.version(versionId)} className="external mdl-color-text--grey-600"
                              onTouchTap={() => this.toggleProv()}>
                    {fileName}
                </a>
            }
            if (fileId === id || versionId === id) fileLink =
                <span className="mdl-color-text--grey-600">{fileName}</span>;
            let bytes = onClickProvNode !== null && onClickProvNode.properties.upload ? onClickProvNode.properties.upload.size : null;
            if (bytes === null && onClickProvNode !== null && onClickProvNode.properties.kind !== 'dds-activity') bytes = onClickProvNode.properties.current_version.upload.size;
            details = <div className="mdl-cell mdl-cell--12-col" style={styles.details}>
                <h6 style={styles.listHeader}>
                    {fileName !== null ? fileLink : activityName}
                </h6>

                <div className="list-block" style={styles.listBlock}>
                    {fileName !== null ? <div className="list-group">
                        <ul style={{position: 'static'}}>
                            <li className="list-group-title" style={styles.listGroupTitle}>Size</li>
                            <li className="item-content" style={styles.listItem}>
                                <div className="item-inner">
                                    <div>{BaseUtils.bytesToSize(bytes)}</div>
                                </div>
                            </li>
                        </ul>
                    </div> : null}
                    <div className="list-group">
                        <ul style={{position: 'static'}}>
                            <li className="list-group-title" style={styles.listGroupTitle}>Created By</li>
                            <li className="item-content" style={styles.listItem}>
                                <div className="item-inner">
                                    <div>{createdBy}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="list-group">
                        <ul style={{position: 'static'}}>
                            <li className="list-group-title" style={styles.listGroupTitle}>Created On</li>
                            <li className="item-content" style={styles.listItem}>
                                <div className="item-inner">
                                    <div>{createdOn}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {lastUpdatedBy !== null ? <div className="list-group">
                        <ul style={{position: 'static'}}>
                            <li className="list-group-title" style={styles.listGroupTitle}>Last Updated</li>
                            <li className="item-content" style={styles.listItem}>
                                <div className="item-inner">
                                    <div>{'Last Updated By ' + lastUpdatedBy + ' on ' + lastUpdatedOn}</div>
                                </div>
                            </li>
                        </ul>
                    </div> : null}
                    {storage !== null ? <div className="list-group">
                        <ul style={{position: 'static'}}>
                            <li className="list-group-title" style={styles.listGroupTitle}>Storage Location</li>
                            <li className="item-content" style={styles.listItem}>
                                <div className="item-inner">
                                    <div>{storage}</div>
                                </div>
                            </li>
                        </ul>
                    </div> : null}
                    {activityDescription !== null ? <div className="list-group">
                        <ul style={{position: 'static'}}>
                            <li className="list-group-title" style={styles.listGroupTitle}>Description</li>
                            <li className="item-content" style={styles.listItem}>
                                <div className="item-inner">
                                    <div>{activityDescription}</div>
                                </div>
                            </li>
                        </ul>
                    </div> : null}
                </div>
            </div>;
        }
        return (
            <div>
                {details}
            </div>
        )
    }

    toggleProv() {
        if(provenanceStore.toggleProvEdit && provenanceStore.toggleProv) provenanceStore.toggleProvEditor();
        provenanceStore.toggleProvView();
    }
}

var styles = {
    details: {
        padding: 20,
        width: '100%',
        margin: 0,
        color:'#757575'
    },
    listBlock: {
        margin: 0
    },
    listGroupTitle: {
        padding: '0px 5px 0px 5px',
        height: 24,
        lineHeight: '175%'
    },
    listHeader: {
        margin: '20px 0px 5px 0px',
        maxWidth: 172,
        wordWrap: 'break-word'
    },
    listItem: {
        padding: '0px 5px 0px 5px',
        fontSize: 12
    }
};

ProvenanceDetails.contextTypes = {
    muiTheme: React.PropTypes.object
};

ProvenanceDetails.propTypes = {
    entityObj: object,
    onClickProvNode: object
};

export default ProvenanceDetails;