import React from 'react';
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import urlGen from '../../../util/urlGen.js';

var mui = require('material-ui'),
    TextField = mui.TextField,
    IconMenu = mui.IconMenu,
    Dialog = mui.Dialog;


class MemberManagement extends React.Component {

    constructor() {
        this.state = {

        }
    }

    render() {
        let description = ProjectStore.project.description;
        let projectId = ProjectStore.project.id;
        let lastUpdatedOn = ProjectStore.lastUpdatedOn;
        let lastUpdatedBy = ProjectStore.lastUpdatedBy;
        let users = ProjectStore.projectMembers;
        console.log(users);
        let members = ProjectStore.projectMembers.map((users)=>{
            return <li key={users.user.id}>
                <a href="#" className="item-link item-content">
                    <div className="item-media"><i className="material-icons">face</i></div>
                    <div className="item-inner">
                        <div className="item-title">{users.user.full_name}</div>
                    </div>
                </a>
            </li>
        });
        return (
            <div className="project-container mdl-color--white mdl-shadow--2dp mdl-color-text--grey-800"
                 style={styles.container}>
                <p><span className="mdl-color-text--grey-900">Project ID:</span> { projectId }</p>
                <p><span className="mdl-color-text--grey-900">Last Updated By:</span> { lastUpdatedBy }</p>
                <p><span className="mdl-color-text--grey-900">Last Updated On:</span> { lastUpdatedOn }</p>
                <p><span className="mdl-color-text--grey-900">Project Description:</span> { description }</p>
                <div className="list-block">
                    <ul>
                        <li className="item-divider">Project Members</li>
                        { members }
                    </ul>
                </div>
            </div>
        )
    }

}


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
    summary: {
        float: 'left',
        textAlign: 'left'
    },
    detailsButton: {
        align: 'center',
        clear: 'both',
        textAlign: 'center'
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
    }
};


export default MemberManagement;

