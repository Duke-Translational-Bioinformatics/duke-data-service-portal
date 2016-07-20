import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
const { object, bool, array, string } = PropTypes;
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import ErrorModal from '../../components/globalComponents/errorModal.jsx';
import FileOptionsMenu from './fileOptionsMenu.jsx';
import FileVersionsList from './fileVersionsList.jsx';
import VersionUpload from './versionUpload.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import urlGen from '../../../util/urlGen.js';
import Tooltip from '../../../util/tooltip.js';
import BaseUtils from '../../../util/baseUtils.js';
import BorderColor from 'material-ui/lib/svg-icons/editor/border-color.js';
import Card from 'material-ui/lib/card/card';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';

class FileDetails extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.error && this.props.error.response){
            this.props.error.response === 404 ? this.props.appRouter.transitionTo('/notFound') : null;
            this.props.error.response != 404 ? console.log(this.props.error.msg) : null;
        }
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        let dlButton = null;
        let optionsMenu = null;
        if (prjPrm !== null) {
            dlButton = prjPrm === 'viewOnly' || prjPrm === 'flUpload' ? null :
                <button
                    title="Download File"
                    rel="tooltip"
                    className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--colored"
                    style={styles.floatingButton}
                    onTouchTap={() => this.handleDownload()}>
                    <i className="material-icons">get_app</i>
                </button>;
            optionsMenu = <FileOptionsMenu {...this.props} />;
        }
        let id = this.props.params.id;
        let ancestors = this.props.entityObj ? this.props.entityObj.ancestors : null;
        let parentKind = this.props.entityObj ? this.props.entityObj.parent.kind : null;
        let parentId = this.props.entityObj ? this.props.entityObj.parent.id : null;
        let name = this.props.entityObj ? this.props.entityObj.name : null;
        let label = this.props.entityObj && this.props.entityObj.current_version.label ? this.props.entityObj.current_version.label : null;
        let projectName = this.props.entityObj && this.props.entityObj.ancestors ? this.props.entityObj.ancestors[0].name : null;
        let crdOn = this.props.entityObj && this.props.entityObj.audit ? this.props.entityObj.audit.created_on : null;
        let x = new Date(crdOn);
        let createdOn = x.toString();
        let createdBy = this.props.entityObj && this.props.entityObj.audit ? this.props.entityObj.audit.created_by.full_name : null;
        let lastUpdatedOn = this.props.entityObj && this.props.entityObj.audit ? this.props.entityObj.audit.last_updated_on : null;
        let lastUpdatedBy = this.props.entityObj && this.props.entityObj.audit.last_updated_by ? this.props.entityObj.audit.last_updated_by.full_name : null;
        let storage =  this.props.entityObj && this.props.entityObj.current_version.upload ? this.props.entityObj.current_version.upload.storage_provider.description : null;
        let bytes = this.props.entityObj && this.props.entityObj.current_version.upload ? this.props.entityObj.current_version.upload.size : null;
        let hash = this.props.entityObj && this.props.entityObj.current_version.upload.hash ? this.props.entityObj.current_version.upload.hash.algorithm +': '+ this.props.entityObj.current_version.upload.hash.value : null;
        let currentVersion = this.props.entityObj && this.props.entityObj.current_version.version ? this.props.entityObj.current_version.version : null;
        let versionsButton = null;
        let versions = null;
        let versionCount = [];

        let provAlert = this.props.showProvAlert ? <Card style={styles.provAlert} zDepth={1}>
            <div style={styles.provAlert.wrapper}>Would you like to add provenance for this file?</div>
            <IconButton style={styles.button} onTouchTap={() => this.dismissAlert()}>
                <NavigationClose color="#E8F5E9"/>
            </IconButton>
            <FlatButton
                label="Yes"
                labelStyle={styles.provAlert.alertButton.label}
                style={styles.provAlert.alertButton}
                hoverColor="#4CAF50"
                onTouchTap={() => this.openProv()}
                />
        </Card> : '';

        if(this.props.fileVersions && this.props.fileVersions != undefined && this.props.fileVersions.length > 1) {
            versions = this.props.fileVersions.map((version) => {
                return version.is_deleted;
            });
            for (let i = 0; i < versions.length; i++) {
                if (versions[i] === false) {
                    versionCount.push(versions[i]);
                    if (versionCount.length > 1) {
                        versionsButton = <RaisedButton
                            label="FILE VERSIONS"
                            labelStyle={{fontWeight: 100}}
                            secondary={true}
                            style={styles.button}
                            onTouchTap={() => this.openModal()}
                            />
                    }
                }
            }
        }

        Tooltip.bindEvents();

        let file = <Card className="project-container mdl-color--white content mdl-color-text--grey-800" style={styles.container}>
            { dlButton }
            <div id="tooltip"></div>
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <div style={styles.menuIcon}>
                    { optionsMenu }
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                    <a href={'/#/' + BaseUtils.getUrlPath(parentKind) + parentId } style={styles.back}
                       className="mdl-color-text--grey-800 external">
                        <i className="material-icons"
                           style={styles.backIcon}>keyboard_backspace</i>Back</a>
                </div>
                <div className="mdl-cell mdl-cell--9-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style={styles.detailsTitle}>
                    <span className="mdl-color-text--grey-800" style={styles.title}>{ name }</span>
                </div>
                { label != null ? <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style={styles.subTitle}>
                    <span className="mdl-color-text--grey-600" style={styles.spanTitle}>{ label }</span>
                </div> : null }
                <div className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-color-text--grey-600" style={styles.subTitle}>
                    <span style={styles.spanTitle}>{ 'Version: ' + currentVersion }</span>
                </div>
                <div className="mdl-cell mdl-cell--8-col mdl-cell--8-col-tablet mdl-color-text--grey-600" style={styles.subTitle}>
                    <span style={styles.spanTitle}>{ BaseUtils.getFilePath(ancestors) + name }</span>
                </div>
                <div className="mdl-cell mdl-cell--3-col mdl-cell--8-col-tablet mdl-color-text--grey-600" style={styles.btnWrapper}>
                    { versionsButton }
                </div>
                <FileVersionsList {...this.props}/>
                <VersionUpload {...this.props}/>
                <div style={styles.uploadProg}>
                    { this.props.uploads ? <Loaders {...this.props}/> : null }
                </div>
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    { provAlert }
                    <div className="list-block">
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Created By</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ createdBy }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Created On</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ createdOn }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Size</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ BaseUtils.bytesToSize(bytes) }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">File ID</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ id }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Hash</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ hash }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Last Updated By</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ lastUpdatedBy === null ? 'N/A' : lastUpdatedBy}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Last Updated On</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ lastUpdatedOn === null ? 'N/A' : new Date(lastUpdatedOn).toString() }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Storage Location</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ storage }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">File Path</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{BaseUtils.getFilePath(ancestors) + name}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Card>;
        return (
            <div>
                <ErrorModal {...this.props}/>
                {file}
            </div>
        )
    }

    dismissAlert(){
        ProjectActions.hideProvAlert();
    }

    handleDownload(){
        let id = this.props.params.id;
        let kind = 'files/';
        ProjectActions.getDownloadUrl(id, kind);
    }

    openModal() {
        ProjectActions.openModal()
    }

    openProv() {
        ProjectActions.toggleProvView();
        ProjectActions.toggleProvEditor();
        ProjectActions.hideProvAlert();
    }
}

var styles = {
    arrow: {
        textAlign: 'left',
        marginTop: -5
    },
    backIcon: {
        fontSize: 24,
        verticalAlign:-7
    },
    back: {
        verticalAlign:-7
    },
    btnWrapper: {
        marginTop: 11,
        marginRight: 25,
        float: 'right'
    },
    button: {
        float: 'right'
    },
    container: {
        marginTop: 30,
        marginBottom: 30,
        position: 'relative',
        overflow: 'visible',
        padding: '10px 0px 10px 0px'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 25
    },
    floatingButton: {
        position: 'absolute',
        top: -20,
        right: '2%',
        zIndex: '2',
        color: '#ffffff'
    },
    list: {
        paddingTop: 5,
        clear: 'both'
    },
    menuIcon: {
        float: 'right',
        marginTop: 30,
        marginBottom: -3,
        marginRight: 2
    },
    provAlert: {
        display: 'block',
        backgroundColor: '#66BB6A',
        alertButton: {
            float: 'right', margin: 6,
            label: {
                color: '#E8F5E9',
                fontWeight: 100
            }
        },
        wrapper: {
            float: 'left',
            color: '#E8F5E9',
            margin: '14px 10px 10px 10px'
        }
    },
    subTitle: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 25,
        marginTop: 18
    },
    spanTitle: {
        fontSize: '1.2em'
    },
    title: {
        fontSize: 24,
        wordWrap: 'break-word'
    },
    uploadProg: {
        marginBottom: -35
    }
};

FileDetails.contextTypes = {
    muiTheme: React.PropTypes.object
};

FileDetails.propTypes = {
    loading: bool,
    details: array,
    error: object
};

export default FileDetails;