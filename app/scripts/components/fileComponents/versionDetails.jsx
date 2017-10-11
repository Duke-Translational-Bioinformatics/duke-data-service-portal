import React, { PropTypes } from 'react';
const { object, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import VersionOptionsMenu from './versionOptionsMenu.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import { Color } from '../../theme/customTheme';
import { UrlGen, Path } from '../../util/urlEnum';
import BaseUtils from '../../util/baseUtils.js';
import Card from 'material-ui/Card';
import FileDownload from 'material-ui/svg-icons/file/file-download'
import RaisedButton from 'material-ui/RaisedButton';

@observer
class VersionDetails extends React.Component {

    render() {
        const {entityObj, loading, projPermissions} = mainStore;
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
        let dlButton = null;
        let optionsMenu = null;
        if (prjPrm !== null) {
            dlButton = prjPrm === 'viewOnly' || prjPrm === 'flUpload' ? null :  <RaisedButton label="Download"
                                                                                              labelPosition="before"
                                                                                              labelStyle={{color: Color.blue}}
                                                                                              style={styles.dlButton}
                                                                                              icon={<FileDownload color={Color.pink} />}
                                                                                              onTouchTap={() => this.handleDownload()}/>;
            optionsMenu = <VersionOptionsMenu {...this.props}/>;
        }
        let id = this.props.params.id;
        let parentId = entityObj && entityObj.file ? entityObj.file.id : null;
        let name = entityObj && entityObj.file ? entityObj.file.name : null;
        let label = entityObj && entityObj.label ? entityObj.label : null;
        let crdOn = entityObj && entityObj.audit ? entityObj.audit.created_on : null;
        let createdBy = entityObj && entityObj.audit ? entityObj.audit.created_by.full_name : null;
        let lastUpdatedOn = entityObj && entityObj.audit ? entityObj.audit.last_updated_on : null;
        let lastUpdatedBy = entityObj && entityObj.audit.last_updated_by ? entityObj.audit.last_updated_by.full_name : null;
        let storage =  entityObj && entityObj.upload ? entityObj.upload.storage_provider.description : null;
        let bytes = entityObj && entityObj.upload ? entityObj.upload.size : null;
        let hash = entityObj && entityObj.upload && entityObj.upload.hashes.length ? entityObj.upload.hashes[0].algorithm +': '+ entityObj.upload.hashes[0].value : null;
        let versNumber = entityObj && entityObj.version ? entityObj.version : '';

        let version = <Card className="project-container mdl-cell mdl-cell--12-col" style={styles.card}>
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                    <a href={UrlGen.routes.file(parentId)} style={styles.back} className="mdl-color-text--grey-800 external" onTouchTap={() => this.goBack()}>
                        <i className="material-icons" style={styles.backIcon}>keyboard_backspace</i>Back
                    </a>
                    <div style={styles.menuIcon}>
                        { optionsMenu }
                    </div>
                </div>
                <div className="mdl-cell mdl-cell--9-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style={styles.detailsTitle}>
                    <span className="mdl-color-text--grey-800" style={styles.title}>{ name }</span>
                </div>
                { label != null ? <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style={styles.subTitle}>
                    <span className="mdl-color-text--grey-600" style={styles.spanTitle}>{ label }</span>
                </div> : null }
                <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-color-text--grey-800" style={styles.subTitle}>
                    <span style={styles.spanTitle}>{ 'Version: ' + versNumber }</span>
                    <div style={styles.btnWrapper}>
                        { dlButton }
                    </div>
                </div>
                <div style={styles.loader}>
                    { loading ? <Loaders {...this.props}/> : null }
                </div>
                <div className="mdl-cell mdl-cell--12-col content-block"  style={styles.list}>
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
                                        <div>{ BaseUtils.formatDate(crdOn) }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Size</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ bytes !== null ? BaseUtils.bytesToSize(bytes) : '' }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Version ID</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ id }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Most Recent Version</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <a href={UrlGen.routes.file(parentId)} className="external">
                                            <div style={{color: Color.blue}}>
                                                <i className="material-icons" style={styles.linkIcon}>link</i>
                                                {name}
                                            </div>
                                        </a>
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
                                        <div>{ lastUpdatedOn === null ? 'N/A' : BaseUtils.formatDate(lastUpdatedOn)}</div>
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
                    </div>
                </div>
            </div>
        </Card>;
        return (
            <div>
                { version }
                <Loaders {...this.props}/>
            </div>
        )
    }

    goBack() {
        mainStore.showBackButton ? this.props.router.goBack() : null;
    }

    handleDownload(){
        let id = this.props.params.id;
        mainStore.getDownloadUrl(id, Path.FILE_VERSION);
    }
}

const styles = {
    arrow: {
        textAlign: 'left',
        marginTop: -5
    },
    back: {
        verticalAlign:-7
    },
    backIcon: {
        fontSize: 24,
        verticalAlign:-7
    },
    btnWrapper: {
        marginRight: 32,
        float: 'right'
    },
    dlButton: {
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
        marginLeft: 26
    },
    linkIcon: {
        color: Color.blue,
        transform: 'rotate(45deg)',
        transformOrigin: '20% 40%',
    },
    list: {
        paddingTop: 5,
        clear: 'both'
    },
    loader: {
        marginBottom: -35
    },
    menuIcon: {
        float: 'right',
        marginTop: -6,
        marginRight: 2
    },
    spanTitle: {
        fontSize: '1.2em',
        verticalAlign: -8
    },
    subTitle: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 25,
        marginTop: 6
    },
    title: {
        fontSize: 24,
        wordWrap: 'break-word'
    }
};

VersionDetails.contextTypes = {
    muiTheme: React.PropTypes.object
};

VersionDetails.propTypes = {
    entityObj: object,
    projectPermissions: string
};

export default VersionDetails;