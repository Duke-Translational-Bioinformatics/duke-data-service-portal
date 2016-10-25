import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import ProjectOptionsMenu from './projectOptionsMenu.jsx';
import Details from './details.jsx';
import UploadManager from '../globalComponents/uploadManager.jsx';
import urlGen from '../../../util/urlGen.js';
import baseUtils from '../../../util/baseUtils.js';
import FlatButton from 'material-ui/lib/flat-button';
import Card from 'material-ui/lib/card/card';

class ProjectDetails extends React.Component {

    constructor() {
        this.state = {
            showDetails: false
        }
    }

    render() {
        let id = this.props.params.id;
        let createdBy = this.props.project && this.props.project.audit ? this.props.project.audit.created_by.full_name : null;
        let projectName = this.props.project ? this.props.project.name : null;
        let crdOn = this.props.project && this.props.project.audit ? this.props.project.audit.created_on : null;
        let x = new Date(crdOn);
        let createdOn = x.toString();
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        let uploadMdl = null;
        let optionsMenu = null;
        if (prjPrm !== null) {
            uploadMdl = prjPrm === 'viewOnly' || prjPrm === 'flDownload' ? null : <UploadManager {...this.props}/>;
            optionsMenu = prjPrm === 'prjCrud' ? <ProjectOptionsMenu {...this.props} /> : null;
        }
        return (
            <Card
                className="project-container mdl-color--white mdl-color-text--grey-800"
                style={{marginTop: this.props.windowWidth > 680 ? 115 : 40,
                        overflow: 'visible', padding: '10px 0px 10px 0px'}}>
                { uploadMdl }
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div style={styles.menuIcon}>
                        { optionsMenu }
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href={urlGen.routes.home()} style={styles.back}
                           className="external mdl-color-text--grey-800"><i
                            className="material-icons mdl-color-text--grey-800" style={styles.backIcon}>keyboard_backspace</i>Back</a>
                    </div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone"
                         style={styles.detailsTitle}>
                        <h4>{ projectName }</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--3-col mdl-cell--8-col-tablet" style={styles.details}>
                        <p><span className="mdl-color-text--grey-900"
                                 style={styles.span}>Created By:</span> { createdBy } </p>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet" style={styles.details2}>
                        <p><span className="mdl-color-text--grey-900"
                                 style={styles.span}>Created On:</span> { createdOn } </p>
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
        marginTop: -15,
        float: 'left',
        marginLeft: 8
    },
    details: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 7,
        marginTop: 16
    },
    details2: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 7,
        marginRight: -20,
        marginTop: 16
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
    muiTheme: React.PropTypes.object
};

ProjectDetails.propTypes = {
    project: React.PropTypes.object
};

export default ProjectDetails;