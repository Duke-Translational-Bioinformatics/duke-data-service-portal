import React from 'react';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import MainActions from '../../actions/mainActions';
import MainStore from '../../stores/mainStore';
import ProjectOptionsMenu from './projectOptionsMenu.jsx';
import UploadModal from '../globalComponents/uploadModal.jsx';
import urlGen from '../../../util/urlGen.js';

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
        let createdOn = this.props.project && this.props.project.audit ? this.props.project.audit.created_on : null;
        let error = '';

        return (
            <div
                className="project-container mdl-color--white mdl-shadow--2dp mdl-color-text--grey-800"
                style={styles.container}>
                <UploadModal {...this.props}/>

                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div style={styles.menuIcon}>
                        <ProjectOptionsMenu {...this.props} />
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + '/home'} style={styles.back}
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
                        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--colored"
                                onClick={this.handleTouchTapDetails.bind(this)}>
                            {!this.state.showDetails ? 'MORE DETAILS' : 'LESS DETAILS'}
                        </button>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                        <div style={styles.moreDetails} className={!this.state.showDetails ? 'less' : 'more'}>
                            { this.state.showDetails ? <Details {...this.props} {...this.state}/> : null }
                        </div>
                    </div>
                </div>
                { error }
            </div>
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

var Details = React.createClass({
    render() {
        let description = this.props.project ? this.props.project.description : null;
        let projectId =  this.props.project ? this.props.project.id : null;
        let createdById = this.props.project && this.props.project.audit ? this.props.project.audit.created_by.id : null;
        let lastUpdatedOn = this.props.project && this.props.project.audit ? this.props.project.audit.last_updated_on : null;
        let lastUpdatedBy = this.props.project && this.props.project.audit ? this.props.project.audit.last_updated_by : null;
        let users = this.props.projectMembers ? this.props.projectMembers : null;
        let currentUserId = this.props.currentUser ? this.props.currentUser.id : null;

        let members = users.map((users)=> {
            return <li key={users.user.id}>
                <div className="item-content">
                    <div className="item-media"><i className="material-icons">face</i></div>
                    <div className="item-inner">
                        <div className="item-title-row">
                            <div className="item-title">{users.user.full_name}</div>
                            <span className="mdl-color-text--grey-600">{ users.auth_role.name }</span>
                        </div>
                        <div className="item-after"><a href="#" onTouchTap={() => this.handleTouchTap(users.user.id, users.user.full_name)}>
                            {users.user.id != currentUserId && users.user.id != createdById ? <i className="material-icons" style={styles.deleteIcon}>cancel</i> : ''}</a>
                        </div>
                    </div>
                </div>
            </li>
        });

        return (
            <div>
                <div className="list-block">
                    <ul>
                        <li className="item-divider">Project ID</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div className="item-title">{ projectId }</div>
                            </div>
                        </li>
                        <li className="item-divider">Last Updated By</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div className="item-title">{ lastUpdatedBy.full_name }</div>
                            </div>
                        </li>
                        <li className="item-divider">Last Updated On</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div className="item-title">{ lastUpdatedOn }</div>
                            </div>
                        </li>
                        <li className="item-divider">Description</li>
                        <li className="item-content">
                            <div className="item-inner">
                                <div>{ description }</div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="list-block">
                    <ul>
                        <li className="item-divider">Project Members</li>
                        { members }
                    </ul>
                </div>
            </div>
        )
    },
    handleTouchTap(userId, userName){
        let id = this.props.params.id;
        ProjectActions.deleteProjectMember(id, userId, userName);
    }
});


var styles = {
    container: {
        marginTop: 30,
        position: 'relative',
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
    deleteIcon: {
        fontSize: 18,
        color: '#F44336',
        verticalAlign: -5

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
    textStyles: {
        textAlign: 'left'
    },
    moreDetails: {
        textAlign: 'left'
    },
    menuIcon: {
        float: 'right',
        marginTop: 38
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
    floatingButton: {
        position: 'absolute',
        top: -20,
        right: '2%',
        zIndex: '2',
        color: '#ffffff'
    },
    span: {
        color: '#212121'
    }
};

ProjectDetails.contextTypes = {
    muiTheme: React.PropTypes.object
};

ProjectDetails.propTypes = {
    loading: React.PropTypes.bool,
    details: React.PropTypes.array,
    error: React.PropTypes.string
};

export default ProjectDetails;