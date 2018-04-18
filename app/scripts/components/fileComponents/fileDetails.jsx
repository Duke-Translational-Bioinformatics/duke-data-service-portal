import React from 'react';
import PropTypes from 'prop-types';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import { Color } from '../../theme/customTheme';
import { Kind, Path, UrlGen } from '../../util/urlEnum';
import { Roles } from '../../enum';
import CustomMetadata from './customMetadata.jsx';
import FileOptionsMenu from './fileOptionsMenu.jsx';
import FileVersionsList from './fileVersionsList.jsx';
import VersionUpload from './versionUpload.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import TagCloud from '../../components/globalComponents/tagCloud.jsx';
import BaseUtils from '../../util/baseUtils.js';
import Card from 'material-ui/Card';
import FileDownload from 'material-ui/svg-icons/file/file-download'
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

@observer
class FileDetails extends React.Component {

    componentDidUpdate() {
        const {entityObj} = mainStore;
        const {drawerLoading, generatedByActivity} = provenanceStore;
        const versionId = entityObj !== null && entityObj.current_version ? entityObj.current_version.id : null;
        if(versionId !== null && !drawerLoading && !generatedByActivity) {
            provenanceStore.getGeneratedByActivity(versionId);
        }
    }

    render() {
        const {entityObj, fileVersions, loading, objectMetadata, projectRole, screenSize, uploads} = mainStore;
        const {generatedByActivity, showProvAlert} = provenanceStore;

        let file = entityObj !== null && entityObj.parent && entityObj.current_version && entityObj.audit ? <Card className="item-info mdl-cell mdl-cell--12-col" style={styles.card}>
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                    <a href={'/#/' + BaseUtils.getUrlPath(entityObj.parent.kind) + entityObj.parent.id } style={styles.back} className="mdl-color-text--grey-800 external" onTouchTap={() => this.goBack()}>
                        <i className="material-icons" style={styles.backIcon}>keyboard_backspace</i>
                        Back
                    </a>
                    <div style={styles.menuIcon}>
                        <FileOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity()}/>
                    </div>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style={styles.detailsTitle}>
                    <span className="mdl-color-text--grey-800" style={styles.title}>{ entityObj.name }</span>
                </div>
                { entityObj.current_version.label ? <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style={styles.subTitle}>
                    <span className="mdl-color-text--grey-800" style={styles.spanTitle}>{ entityObj.current_version.label ? entityObj.current_version.label : '' }</span>
                </div> : null }
                <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-color-text--grey-800" style={styles.subTitle}>
                    <span style={styles.spanTitle}>{ 'Version: ' + entityObj.current_version.version }</span>
                </div>
                <div className="mdl-cell mdl-cell--8-col mdl-cell--8-col-tablet mdl-color-text--grey-800" style={styles.breadcrumbs}>
                    <span style={styles.spanTitle}>{entityObj.ancestors !== null ? BaseUtils.getFilePath(entityObj.ancestors) : ''}  {' '+entityObj.name}</span>
                </div>
                <div className="mdl-cell mdl-cell--3-col mdl-cell--8-col-tablet" style={styles.btnWrapper}>
                    { projectRole !== null && projectRole !== Roles.project_viewer && projectRole !== Roles.file_uploader ?
                        <RaisedButton label="Download"
                            labelPosition="before"
                            labelStyle={{color: Color.blue}}
                            style={styles.dlButton}
                            icon={<FileDownload color={Color.pink} />}
                            onTouchTap={() => this.handleDownload()}/> : '' }
                    { fileVersions.filter(v => !v.is_deleted).length > 1 ?
                        <RaisedButton
                            label="FILE VERSIONS"
                            style={styles.button}
                            labelStyle={{color: Color.blue}}
                            onTouchTap={() => this.openModal('fileVersions')} /> : '' }
                </div>
                { screenSize.width >  300 ? <TagCloud {...this.props}/> : null }
                <FileVersionsList {...this.props}/>
                <VersionUpload {...this.props}/>
                <div style={styles.uploadProg}>
                    { uploads || loading ? <Loaders {...this.props}/> : null }
                </div>
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    { showProvAlert ? <Paper style={styles.provAlert} zDepth={1}>
                        <div style={styles.provAlert.wrapper}>Would you like to add provenance for this file?</div>
                        <FlatButton
                            label="No"
                            labelStyle={styles.provAlert.alertButton.label}
                            style={styles.provAlert.alertButton}
                            hoverColor="#4CAF50"
                            onTouchTap={() => this.dismissAlert()}
                        />
                        <FlatButton
                            label="Yes"
                            labelStyle={styles.provAlert.alertButton.label}
                            style={styles.provAlert.alertButton}
                            hoverColor="#4CAF50"
                            onTouchTap={() => this.openProv()}
                        />
                    </Paper> : '' }
                    <div className="list-block">
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Created By</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ entityObj.audit.created_by.full_name }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Original File Created On</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ entityObj.audit.created_on ? BaseUtils.formatDate(entityObj.audit.created_on) : '' }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Was Generated By</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        { generatedByActivity ?
                                        <div>
                                            <i className="material-icons" style={styles.link.linkIcon}>link</i>
                                            <a href={UrlGen.routes.activities(generatedByActivity.properties.to.id)}
                                               style={styles.link}
                                               className="external link"
                                            >
                                                {generatedByActivity.properties.to.name}
                                            </a>
                                        </div> :
                                        <div>{ 'N/A' }</div> }
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Last Updated By</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ entityObj.audit.last_updated_by ? entityObj.audit.last_updated_by.full_name : 'N/A' }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Last Updated On</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ entityObj.audit.last_updated_on ? BaseUtils.formatDate(entityObj.audit.last_updated_on) : 'N/A' }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Size</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ entityObj.current_version.upload.size ? BaseUtils.bytesToSize(entityObj.current_version.upload.size) : '' }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">File ID</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ entityObj.current_version.id }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Hash</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ entityObj.current_version.upload.hashes[0].algorithm +': '+ entityObj.current_version.upload.hashes[0].value }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Storage Location</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ entityObj.current_version.upload.storage_provider.description }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">File Path</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{entityObj.ancestors ? BaseUtils.getFilePath(entityObj.ancestors) : ''}  {' '+entityObj.name }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Card> : null;
        return (
            <div>
                {file}
                {objectMetadata && objectMetadata.length ? <CustomMetadata {...this.props}/> : null}
            </div>
        )
    }

    dismissAlert(){
        provenanceStore.hideProvAlert();
    }

    goBack() {
        mainStore.showBackButton ? this.props.router.goBack() : null;
    }

    handleDownload(){
        const id = this.props.params.id;
        mainStore.getDownloadUrl(id, Path.FILE);
    }

    openModal(id) {
        mainStore.toggleModals(id)
    }

    openProv() {
        const versionId = mainStore.entityObj.current_version.id;
        // provenanceStore.getWasGeneratedByNode(versionId); // Todo: changed this here
        provenanceStore.getProvenance(versionId, Kind.DDS_FILE_VERSION, null);
        provenanceStore.toggleProvView();
        provenanceStore.toggleProvEditor();
        provenanceStore.hideProvAlert();
    }

    setSelectedEntity() {
        const id = this.props.params.id;
        const isListItem = false;
        mainStore.setSelectedEntity(id, Path.FILE, isListItem);
    }
}

const styles = {
    arrow: {
        textAlign: 'left',
        marginTop: -5
    },
    backIcon: {
        fontSize: 24,
        verticalAlign:-7
    },
    back: {
        verticalAlign:-7,
        cursor: 'pointer'
    },
    breadcrumbs: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 25,
        marginTop: 8
    },
    btnWrapper: {
        minWidth: 280,
        margin: '0px 25px 20px 8px',
        float: 'right'
    },
    button: {
        float: 'right'
    },
    card: {
        paddingBottom: 30,
        overflow: 'auto',
        padding: '10px 0px 10px 0px',
        margin: '0 auto'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 25
    },
    dlButton: {
        float: 'right',
        marginLeft: 15
    },
    link: {
        color: Color.blue,
        linkIcon: {
            transform: 'rotate(45deg)',
            transformOrigin: '20% 40%',
            color: Color.blue
        }
    },
    list: {
        paddingTop: 5,
        clear: 'both'
    },
    menuIcon: {
        float: 'right',
        marginTop: -6,
        marginRight: -6
    },
    provAlert: {
        display: 'block',
        overflow: 'auto',
        backgroundColor: Color.green,
        minHeight: 48,
        alertButton: {
            float: 'right',
            margin: 6,
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
        marginTop: 0
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

FileDetails.propTypes = {
    loading: bool,
    showProvAlert: bool,
    fileVersions: array,
    objectMetadata: array,
    projectRole: string,
    uploads: array,
    entityObj: object,
    screenSize: object
};

export default FileDetails;