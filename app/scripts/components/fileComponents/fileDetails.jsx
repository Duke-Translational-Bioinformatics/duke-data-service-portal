import React from 'react';
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

    constructor() {
        this.state = {
            projectObj: ProjectStore.projectObj,
            objName: ProjectStore.objName,
            projName: cookie.load('projName')
        }
    }

    render() {
        let error = '';
        let loading = this.props.loading ?
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';
        let id = this.props.params.id;
        let details = ProjectStore.project;
        let parentKind = ProjectStore.parentObj.kind;
        let parentId = ProjectStore.parentObj.id;
        let name = ProjectStore.objName;
        let projectName = cookie.load('projName');
        let createdOn = ProjectStore.createdOn;
        let createdBy = ProjectStore.createdBy;
        let lastUpdatedOn = ProjectStore.lastUpdatedOn;
        let storage = ProjectStore.storage;

        function updatedBy () {
                if(ProjectStore.lastUpdatedBy != null){
                    var lastUpdatedBy = ProjectStore.lastUpdatedBy;
                } else {
                    return 'N/A';
                }
            return lastUpdatedBy.full_name;
        };

        function getFilePath () {
            if (ProjectStore.ancestors != undefined) {
                var ancestors = ProjectStore.ancestors;
            } else {
                return null
            }
            let path = ancestors.map((path)=> {
                return path.name + ' ' + '>' + ' ';
            });
            return path.join('');
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
                    style={styles.floatingButton}>
                    <i className="material-icons">get_app</i>
                </button>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div style={styles.menuIcon}>
                        <FileOptionsMenu {...this.props} {...this.state}/>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href={urlGen.routes.baseUrl + getUrlPath() + parentId } style={styles.back}
                           className="mdl-color-text--grey-800 external"
                           onTouchTap={this.handleTouchTap.bind(this, parentKind, parentId)}><i
                            className="material-icons"
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
                                        <div>{ updatedBy() }</div>
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

    //handleTouchTapDetails() {
    //    if (!this.state.showDetails) {
    //        this.setState({showDetails: true})
    //    } else {
    //        this.setState({showDetails: false})
    //    }
    //}
    //
    handleTouchTap(parentKind, parentId) {
        let id = parentId;
        if (parentKind === 'dds-project') {
            ProjectActions.loadProjectChildren(id);
        } else {
            ProjectActions.loadFolderChildren(id, ProjectActions.getParent(id));
        }
    }
}
//<button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
//        onClick={this.handleTouchTapDetails.bind(this)}>
//    {!this.state.showDetails ? 'FILE HISTORY' : 'HIDE HISTORY'}
//</button>

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
    loading: React.PropTypes.bool,
    details: React.PropTypes.array,
    error: React.PropTypes.string
};


export default FileDetails;

//<button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
//        style={styles.fullView}>
//    FULL VIEW
//</button>
//<div className="project-container mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800"
//style={styles.container}>
//</div>color-text--grey-600" style={styles.folderName}>KOMP Data</span>
//
//<i className="material-icons mdl-color-text--grey-600" style={styles.moreIcon}>keyboard_arrow_right</i>
//<span className="mdl-color-text--grey-600" style={styles.folderName}><a href="#" className="mdl-color-text--grey-600">KOMP
//    Data</a></span><i className="material-icons mdl-color-text--grey-600"
//                      style={styles.moreIcon}>keyboard_arrow_right</i>
//<span className="mdl-color-text--grey-600" style={styles.folderName}>KOMP Data</span>