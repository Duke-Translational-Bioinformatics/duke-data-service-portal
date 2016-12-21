import React from 'react'
import FolderOptionsMenu from './folderOptionsMenu.jsx';
import UploadModal from '../globalComponents/uploadModal.jsx';
import UploadManager from '../globalComponents/uploadManager.jsx';
import BaseUtils from '../../../util/baseUtils';
import Card from 'material-ui/lib/card/card';
import FontIcon from 'material-ui/lib/font-icon';

class FolderPath extends React.Component {
    
    render() {
        let id = this.props.params.id;
        let entityObj = this.props.entityObj ? this.props.entityObj : null;
        let projectName = this.props.entityObj && this.props.entityObj.ancestors ? this.props.entityObj.ancestors[0].name : null;
        let ancestors = this.props.entityObj ? this.props.entityObj.ancestors : null;
        let parentKind = this.props.entityObj ? this.props.entityObj.parent.kind : null;
        let parentId = this.props.entityObj ? this.props.entityObj.parent.id : null;
        let name = this.props.entityObj ? this.props.entityObj.name : '';
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        
        let uploadMdl = null;
        let optionsMenu = null;
        if (prjPrm !== null) {
            uploadMdl = prjPrm === 'viewOnly' || prjPrm === 'flDownload' ? null : <UploadManager {...this.props}/>;
            optionsMenu = prjPrm === 'prjCrud' || prjPrm === 'flCrud' ? optionsMenu = <FolderOptionsMenu {...this.props} /> : null;
        }
        let path = ancestors !== null ? BaseUtils.getFilePath(ancestors) : '';
        return (
            <Card className="project-container group mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800"
                  style={{marginTop: this.props.windowWidth > 680 ? 115 : 40,
                        overflow: 'visible', padding: '10px 0px 10px 0px'}}>
                { uploadMdl }
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div style={styles.menuIcon}>
                        { optionsMenu }
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href={'/#/' + BaseUtils.getUrlPath(parentKind) + parentId }
                           className="mdl-color-text--grey-800 external"><i
                            className="material-icons"
                            style={styles.backIcon}>keyboard_backspace</i>Back</a>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800"
                         style={styles.detailsTitle}>
                        <h4 style={styles.heading}>{ projectName }</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.breadcrumbs}>
                        <h5 style={styles.heading}><FontIcon className="material-icons" style={styles.folderIcon}>folder_open</FontIcon>{ name }</h5>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.breadcrumbs}>
                        <h6 style={styles.breadcrumbHeading}>{path}  {' '+name}</h6>
                    </div>
                </div>
            </Card>
        );
    }
}

var styles = {
    arrow: {
        textAlign: 'left'
    },
    backIcon: {
        fontSize: 24,
        verticalAlign: -7
    },
    breadcrumbs: {
        float: 'left'
    },
    breadcrumbHeading: {
        marginTop: 0,
        marginBottom: 6,
        fontWeight: 200
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left'
    },
    folderIcon: {
        fontSize: 36,
        verticalAlign: -7,
        marginRight: 10,
        marginLeft: -2,
        color: '#616161'
    },
    heading: {
        margin: 0,
        fontWeight: 200
    },
    menuIcon: {
        float: 'right',
        marginTop: 32,
        marginRight: -5
    }
};

export default FolderPath;