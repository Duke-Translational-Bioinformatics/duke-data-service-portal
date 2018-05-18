import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import provenanceStore from '../../stores/provenanceStore';
import BaseUtils from '../../util/baseUtils.js';
import { Color } from '../../theme/customTheme';
import { UrlGen } from '../../util/urlEnum';
const { object } = PropTypes;

@observer
class ProvenanceDetails extends React.Component {

    render() {
        const { onClickProvNode } = provenanceStore;
        let details = null;
        if (onClickProvNode && onClickProvNode.properties.hasOwnProperty('audit')) {
            let id = this.props.params.id;
            let versionId = onClickProvNode !== null ? onClickProvNode.id : null;
            let activityName = onClickProvNode !== null && onClickProvNode.properties.kind === 'dds-activity' ? onClickProvNode.properties.name : null;
            let activityId = onClickProvNode !== null && onClickProvNode.properties.kind === 'dds-activity' ? onClickProvNode.properties.id : null;
            let activityDescription = onClickProvNode !== null && onClickProvNode.properties.kind === 'dds-activity' ? onClickProvNode.properties.description : null;
            let fileName = onClickProvNode !== null && onClickProvNode.properties.file ? onClickProvNode.properties.file.name : null;
            if (fileName === null && onClickProvNode !== null && onClickProvNode.properties.current_version) fileName = onClickProvNode.properties.name;
            let fileId = onClickProvNode !== null && onClickProvNode.properties.file ? onClickProvNode.properties.file.id : null;
            if (fileId === null && onClickProvNode !== null && onClickProvNode.properties.current_version) versionId = onClickProvNode.properties.current_version.id;
            let createdOn = onClickProvNode !== null && onClickProvNode.properties.audit ? onClickProvNode.properties.audit.created_on : null;
            let createdBy = onClickProvNode !== null && onClickProvNode.properties.audit ? onClickProvNode.properties.audit.created_by.full_name : null;
            let lastUpdatedOn = onClickProvNode !== null && onClickProvNode.properties.audit ? onClickProvNode.properties.audit.last_updated_on : null;
            let lastUpdatedBy = onClickProvNode !== null && onClickProvNode.properties.audit.last_updated_by ? onClickProvNode.properties.audit.last_updated_by.full_name : null;
            let storage = null;
            if (onClickProvNode !== null && onClickProvNode.properties.kind !== 'dds-activity') {
                storage = onClickProvNode.properties && onClickProvNode.properties.upload ?
                    onClickProvNode.properties.upload.storage_provider.description :
                    onClickProvNode.properties.current_version.upload.storage_provider.description;
            }
            let link = null;
            if (fileName !== null || activityName !== null) {
                link = <span>
                    <i className="material-icons" style={styles.link.linkIcon}>link</i>
                    <a href={fileName !== null ? UrlGen.routes.version(versionId) : UrlGen.routes.activities(activityId)}
                       style={styles.link}
                       className="external link"
                    >
                        {fileName !== null ? fileName : activityName}
                    </a>
                </span>
            }
            if (fileId === id || versionId === id) link = <span className="mdl-color-text--grey-800">{fileName}</span>;
            let bytes = onClickProvNode !== null && onClickProvNode.properties.upload ? onClickProvNode.properties.upload.size : null;
            if (bytes === null && onClickProvNode !== null && onClickProvNode.properties.kind !== 'dds-activity') bytes = onClickProvNode.properties.current_version.upload.size;
            details = <div className="mdl-cell mdl-cell--12-col" style={styles.details}>
                <h6 style={styles.listHeader}>
                    {link}
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
                                    <div>{BaseUtils.formatDate(createdOn)}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {lastUpdatedBy !== null ? <div className="list-group">
                        <ul style={{position: 'static'}}>
                            <li className="list-group-title" style={styles.listGroupTitle}>Last Updated</li>
                            <li className="item-content" style={styles.listItem}>
                                <div className="item-inner">
                                    <div>{'Last Updated By ' + lastUpdatedBy + ' on ' + BaseUtils.formatDate(lastUpdatedOn)}</div>
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
}

const styles = {
    details: {
        padding: 20,
        width: '100%',
        margin: 0,
        color: Color.dkGrey
    },
    link: {
        color: Color.blue,
        linkIcon: {
            verticalAlign: -6,
            color: Color.blue
        }
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
        minWidth: 172,
        wordWrap: 'break-word'
    },
    listItem: {
        padding: '0px 5px 0px 5px',
        fontSize: 12
    }
};

ProvenanceDetails.propTypes = {
    onClickProvNode: object
};

export default ProvenanceDetails;