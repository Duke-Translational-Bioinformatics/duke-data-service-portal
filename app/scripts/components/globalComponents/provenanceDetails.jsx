import React, { PropTypes } from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BaseUtils from '../../../util/baseUtils.js';
import urlGen from '../../../util/urlGen.js';

class ProvenanceDetails extends React.Component {

    render() {
        function createdOnDate(created) {
            let x = new Date(created);
            let createdOn = x.toString();
            return createdOn;
        }
        let id = this.props.params.id;
        let versionId = null;
        let activityName = this.props.node !== null && this.props.node.properties.kind === 'dds-activity' ? this.props.node.properties.name : null;
        let activityDescription = this.props.node !== null && this.props.node.properties.kind === 'dds-activity' ? this.props.node.properties.description : null;
        let fileName = this.props.node !== null && this.props.node.properties.file ? this.props.node.properties.file.name : null;
        if (fileName === null && this.props.node !== null && this.props.node.properties.current_version) fileName = this.props.node.properties.name;
        let fileId = this.props.node !== null && this.props.node.properties.file ? this.props.node.properties.file.id : null;
        if (fileId === null && this.props.node !== null && this.props.node.properties.current_version) versionId = this.props.node.properties.current_version.id;
        let projectName = this.props.entityObj && this.props.entityObj.ancestors ? this.props.entityObj.ancestors[0].name : null;
        let crdOn = this.props.node !== null && this.props.node.properties.audit ? this.props.node.properties.audit.created_on : null;
        let createdOn = createdOnDate(crdOn);
        let createdBy = this.props.node !== null && this.props.node.properties.audit ? this.props.node.properties.audit.created_by.full_name : null;
        let lastUpdatedOn = this.props.node !== null && this.props.node.properties.audit ? this.props.node.properties.audit.last_updated_on : null;
        let lastUpdatedBy = this.props.node !== null && this.props.node.properties.audit.last_updated_by ? this.props.node.properties.audit.last_updated_by.full_name : null;
        let storage =  null;
        if(this.props.node !== null && this.props.node.properties.kind !== 'dds-activity'){
            storage = this.props.node.properties && this.props.node.properties.upload ?
                this.props.node.properties.upload.storage_provider.description :
                this.props.node.properties.current_version.upload.storage_provider.description;
        }
        let fileLink = fileName !== null ? <a href={fileId !== null ? urlGen.routes.file(fileId) : urlGen.routes.version(versionId)}
                                                                                             className="external mdl-color-text--grey-600"
                                                                                             onTouchTap={() => this.toggleProv()}>
            {fileName}
        </a> : null;
        let bytes =  this.props.node !== null && this.props.node.properties.upload ? this.props.node.properties.upload.size : null;
        if (bytes === null && this.props.node !== null && this.props.node.properties.kind !== 'dds-activity') bytes = this.props.node.properties.current_version.upload.size;
        let details = <div className="mdl-cell mdl-cell--12-col" style={styles.details}>
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
                                <div>{'Last Updated By '+lastUpdatedBy+' on '+ lastUpdatedOn}</div>
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
        return (
            <div>
                {details}
            </div>
        )
    }

    toggleProv() {
        if(this.props.toggleProvEdit && this.props.toggleProv) ProjectActions.toggleProvEditor();
        ProjectActions.toggleProvView();
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

export default ProvenanceDetails;