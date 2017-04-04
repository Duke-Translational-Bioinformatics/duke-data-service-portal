import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import ProjectOptionsMenu from './projectOptionsMenu.jsx';
import Details from './details.jsx';
import UploadManager from '../globalComponents/uploadManager.jsx';
import {UrlGen} from '../../util/urlEnum';
import BaseUtils from '../../util/baseUtils.js';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';

@observer
class ProjectDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showDetails: false
        }
    }

    render() {
        const { project, projPermissions } = mainStore;
        let id = this.props.params.id;
        let createdBy = project && project.audit ? project.audit.created_by.full_name : null;
        let crdOn = project && project.audit ? project.audit.created_on : null;
        let projectName = project ? project.name : null;
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
        let uploadMdl = null;
        let optionsMenu = null;
        if (prjPrm !== null) {
            uploadMdl = prjPrm === 'viewOnly' || prjPrm === 'flDownload' ? null : <UploadManager {...this.props}/>;
            optionsMenu = prjPrm === 'prjCrud' ? <ProjectOptionsMenu {...this.props} /> : null;
        }
        return (
            <Card
                className="project-container mdl-color--white mdl-color-text--grey-800"
                style={{overflow: 'visible', padding: '10px 0px 10px 0px'}}>
                { uploadMdl }
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div style={styles.menuIcon}>
                        { optionsMenu }
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href={UrlGen.routes.home()} style={styles.back}
                           className="external mdl-color-text--grey-800"><i
                            className="material-icons mdl-color-text--grey-800" style={styles.backIcon}>keyboard_backspace</i>Back</a>
                    </div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone"
                         style={styles.detailsTitle}>
                        <h4 style={styles.projectName}>{ projectName }</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--8-col-tablet" style={styles.details}>
                        <span className="mdl-color-text--grey-900"
                                 style={styles.span}>Created By: {' '+ createdBy }</span>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet" style={styles.details2}>
                        <span className="mdl-color-text--grey-900"
                                 style={styles.span}>Created On: {' '+ BaseUtils.formatDate(crdOn) }</span>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.detailsButton}>
                        <FlatButton
                            label={!this.state.showDetails ? 'MORE DETAILS' : 'LESS DETAILS'}
                            secondary={true}
                            onTouchTap={this.handleTouchTapDetails.bind(this)}/>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                        <div style={styles.moreDetails} className={!this.state.showDetails ? 'less' : 'more'}>
                            { this.state.showDetails ? <Details {...this.props} {...this.state}/> : null }
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    handleTouchTapDetails() {
        if (!this.state.showDetails) {
            this.setState({showDetails: true})
        } else {
            this.setState({showDetails: false})
        }
    }
}

var styles = {
    container: {
        marginTop: 40,
        overflow: 'visible',
        padding: '10px 0px 10px 0px'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 8,
        fontWeight: 200
    },
    details: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 7,
        marginTop: 19
    },
    details2: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 7,
        marginTop: 19
    },
    summary: {
        float: 'left',
        textAlign: 'left'
    },
    detailsButton: {
        align: 'center',
        clear: 'both',
        textAlign: 'right'
    },
    moreDetails: {
        textAlign: 'left'
    },
    menuIcon: {
        float: 'right',
        marginTop: 32,
        marginRight: -5
    },
    projectName: {
        margin: 0,
        fontWeight: 200
    },
    backIcon: {
        fontSize: 24,
        float: 'left'
    },
    arrow: {
        textAlign: 'left'
    },
    back: {
        verticalAlign: -2
    },
    span: {
        color: '#212121'
    }
};

ProjectDetails.contextTypes = {
    muiTheme: object
};

ProjectDetails.propTypes = {
    project: object,
    projPermissions: string
};

export default ProjectDetails;