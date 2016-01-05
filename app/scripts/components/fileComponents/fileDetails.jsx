import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import FileOptionsMenu from './fileOptionsMenu.jsx';
import urlGen from '../../../util/urlGen.js';
import cookie from 'react-cookie';

var mui = require('material-ui'),
    TextField = mui.TextField,
    IconMenu = mui.IconMenu,
    Dialog = mui.Dialog;


class FileDetails extends React.Component {

    render() {
        let error = '';
        let loading = this.props.loading ?
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';
        let id = this.props.params.id;
        let ancestors = this.props.entityObj ? this.props.entityObj.ancestors : null;
        let parentKind = this.props.entityObj ? this.props.entityObj.parent.kind : null;
        let parentId = this.props.entityObj ? this.props.entityObj.parent.id : null;
        let name = this.props.entityObj ? this.props.entityObj.name : null;
        let projectName = this.props.entityObj && this.props.entityObj.ancestors ? this.props.entityObj.ancestors[0].name : null;
        let createdOn = this.props.entityObj && this.props.entityObj.audit ? this.props.entityObj.audit.created_on : null;
        let createdBy = this.props.entityObj && this.props.entityObj.audit ? this.props.entityObj.audit.created_by.full_name : null;
        let lastUpdatedOn = this.props.entityObj && this.props.entityObj.audit ? this.props.entityObj.audit.last_updated_on : null;
        let lastUpdatedBy = this.props.entityObj && this.props.entityObj.audit.last_updated_by ? this.props.entityObj.audit.last_updated_by.full_name : null;
        let storage =  this.props.entityObj && this.props.entityObj.audit ? this.props.entityObj.upload.storage_provider.description : null;

        function getFilePath() {
            if (ancestors != undefined) {
                let path = ancestors.map((path)=> {
                    return path.name + ' ' + '>' + ' ';
                });
                return path.join('');
            }else{
                return null
            }
        }

        function getUrlPath () {
            let urlPath = '';
            if (parentKind === 'dds-project') {
                urlPath = 'project/'
            } else {
                urlPath = 'folder/'
            }
            return urlPath;
        }


        return (
            <div className="project-container mdl-grid mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800"
                 style={styles.container}>
                <button
                    className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--colored"
                    style={styles.floatingButton}
                    onTouchTap={this.handleDownload.bind(this)}>
                    <i className="material-icons">get_app</i>
                </button>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div style={styles.menuIcon}>
                        <FileOptionsMenu {...this.props} {...this.state}/>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + '/' + getUrlPath() + parentId } style={styles.back}
                           className="mdl-color-text--grey-800 external">
                            <i className="material-icons"
                            style={styles.backIcon}>keyboard_backspace</i>Back</a>
                    </div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone" style={styles.detailsTitle}>
                            <span className="mdl-color-text--grey-800" style={styles.title}>{projectName}</span>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-color-text--grey-600" style={styles.details}>
                        <span style={styles.spanTitle}>{name}</span><span></span>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                        <div className="list-block">
                            <ul>
                                <li className="item-divider">Created By</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ createdBy }</div>
                                    </div>
                                </li>
                                <li className="item-divider">Created On</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ createdOn }</div>
                                    </div>
                                </li>
                                <li className="item-divider">File ID</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ id }</div>
                                    </div>
                                </li>
                                <li className="item-divider">Last Updated By</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ lastUpdatedBy === null ? 'N/A' : lastUpdatedBy}</div>
                                    </div>
                                </li>
                                <li className="item-divider">Last Updated On</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ lastUpdatedOn === null ? 'N/A' : lastUpdatedOn }</div>
                                    </div>
                                </li>
                                <li className="item-divider">Storage Location</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ storage }</div>
                                    </div>
                                </li>
                                <li className="item-divider">File Path</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ getFilePath() + name}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                { loading }
                { error }
            </div>
        );
    }
    handleDownload(){
        let id = this.props.params.id;
        ProjectActions.getDownloadUrl(id);
    }
}

var styles = {
    container: {
        marginTop: 30,
        position: 'relative',
        overflow: 'visible',
        padding: '10px 0px 10px 0px'
    },
    details: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 8,
        marginTop: 20
    },
    list: {
        paddingTop: 100
    },
    summary: {
        float: 'left',
        textAlign: 'left'
    },
    detailsButton: {
        align: 'center',
        clear: 'both',
        textAlign: 'center',
        marginBottom: -10
    },
    textStyles: {
        textAlign: 'left'
    },
    spanTitle: {
        fontSize: '1.5em'
    },
    moreDetails: {
        textAlign: 'left'
    },
    fileIcon: {
        fontSize: 36
    },
    backIcon: {
        fontSize: 24,
        float: 'left'
    },
    arrow: {
        textAlign: 'left',
        marginTop: -5
    },
    back: {
        verticalAlign:-7
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left'
    },
    title: {
        fontSize: 24,
    },
    folderName: {
        fontSize: 14
    },
    moreIcon: {
        fontSize: 36,
        verticalAlign: -11
    },
    floatingButton: {
        position: 'absolute',
        top: -20,
        right: '2%',
        zIndex: '2',
        color: '#ffffff'
    },
    fullView: {
        float: 'right'
    },
    menuIcon: {
        float: 'right',
        marginTop: 38
    }
};

FileDetails.contextTypes = {
    muiTheme: React.PropTypes.object
};

FileDetails.propTypes = {
    project: object.isRequired,
    loading: bool,
    details: array,
    error: string
};

export default FileDetails;