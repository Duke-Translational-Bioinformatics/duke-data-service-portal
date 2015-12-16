import React from 'react'
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import FolderOptionsMenu from './folderOptionsMenu.jsx';
import UploadModal from '../globalComponents/uploadModal.jsx';
import urlGen from '../../../util/urlGen.js';
import cookie from 'react-cookie';

class FolderPath extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let id = this.props.params.id;
        let entityObj = this.props.entityObj ? this.props.entityObj : null;
        let projectName = this.props.entityObj && this.props.entityObj.ancestors ? this.props.entityObj.ancestors[0].name : null;
        let ancestors = this.props.entityObj ? this.props.entityObj.ancestors : null;
        let parentKind = this.props.entityObj ? this.props.entityObj.parent.kind : null;
        let parentId = this.props.entityObj ? this.props.entityObj.parent.id : null;
        let name = this.props.entityObj ? this.props.entityObj.name : null;

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

        function getUrlPath() {
            let urlPath = '';
            if (parentKind === 'dds-project') {
                urlPath = 'project/'
            } else {
                urlPath = 'folder/'
            }
            return urlPath;
        }

        return (
            <div className="project-container group mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800"
                 style={styles.container}>
                <UploadModal {...this.props} />
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div style={styles.menuIcon}>
                        <FolderOptionsMenu {...this.props} />
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + '/' +  getUrlPath() + parentId }
                           className="mdl-color-text--grey-800 external"><i
                            className="material-icons"
                            style={styles.backIcon}>keyboard_backspace</i>Back</a>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone"
                         style={styles.detailsTitle}>
                        <h4>{ projectName }</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.breadcrumbs}>
                        <h5><i className="material-icons" style={styles.folderIcon}>folder_open</i>{ name }</h5>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.breadcrumbs}>
                        <h6>{ getFilePath() + name }</h6>
                    </div>
                </div>
            </div>
        );
    }
}

var styles = {
    container: {
        marginTop: 30,
        position: 'relative',
        overflow: 'visible',
        padding: '10px 0px 10px 0px',
        minHeight: 160
    },
    arrow: {
        textAlign: 'left'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left',
        marginTop: -20
    },
    breadcrumbs: {
        marginTop: -30,
        float: 'left'
    },
    folderName: {
        fontSize: 14
    },
    folderIcon: {
        fontSize: 36,
        verticalAlign: -7,
        marginRight: 10
    },
    moreIcon: {
        fontSize: 36,
        verticalAlign: -11
    },
    backIcon: {
        fontSize: 24,
        verticalAlign: -7
    },
    menuIcon: {
        float: 'right',
        marginTop: 38
    },
    floatingButton: {
        position: 'absolute',
        top: -20,
        right: '2%',
        zIndex: '2',
        color: '#ffffff'
    }
};

export default FolderPath;