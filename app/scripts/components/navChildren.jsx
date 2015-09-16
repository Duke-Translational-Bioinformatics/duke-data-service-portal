import React from 'react';
import { RouteHandler, Link } from 'react-router';
import MainStore from '../stores/mainStore';
import MainActions from '../actions/mainActions';
import ProjectListActions from '../actions/projectListActions';
import ProjectStore from '../stores/projectStore';
import cookie from 'react-cookie';

class NavChildren extends React.Component {

    constructor(props, context) {
        super(props);
    }

    render() {
        let currentPath = window.location.hash.split('/').slice(1, 2).toString();
        console.log(currentPath);
        if (currentPath === 'home') {
            return (
                <span>
                    <p><Link to="home"><i className="material-icons" style={styles.navIcon}>add_circle</i>Add New Project</Link></p>
                </span>
            );
        } else {
            return (
                <span>
                    <p><Link to="home"><i className="material-icons" style={styles.navIcon}>home</i>Home</Link></p>
                    <p><Link to="home" onTouchTap={this.handleDeleteButton}><i className="material-icons" style={styles.navIcon}>delete</i>Delete Project</Link></p>
                </span>
            );
        }
    }

    handleDeleteButton(projectId) {
        ProjectListActions.deleteProject(projectId);
    }

}

var styles = {
    navIcon: {
        paddingRight: 5,
        verticalAlign: -6
    }
};


export default NavChildren;
