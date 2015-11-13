import React from 'react';
import { RouteHandler, Link } from 'react-router';
import MainStore from '../../stores/mainStore';
import MainActions from '../../actions/mainActions';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import cookie from 'react-cookie';

let mui = require('material-ui'),
    RaisedButton = mui.RaisedButton,
    TextField = mui.TextField,
    Snackbar = mui.Snackbar,
    Dialog = mui.Dialog;

class NavChildren extends React.Component {

    constructor(props, context) {
        super(props);
    }

    render() {
        let standardActions = [
            {text: 'DELETE', onTouchTap: this.handleDeleteButton.bind(this)},
            {text: 'CANCEL'}
        ];

        let currentPath = window.location.hash.split('/').slice(1, 2).toString();

        if (currentPath === 'home') {
            return (
                <span>
                    <!--<p><Link to="home"><i className="material-icons" style={styles.navIcon}>add_circle</i>Add New Project</Link></p>-->
                </span>
            );
        } else {
            return (
                <span>
                    <div style={styles.addProject}>
                        <Dialog
                            style={styles.dialogStyles}
                            title="Are you sure you want to delete this project?"
                            actions={standardActions}
                            ref="deleteProject">
                        </Dialog>
                    </div>
                    <p><Link to="home"><i className="material-icons" style={styles.navIcon}>home</i>Home</Link></p>
                    <!--<p><a href="#" onTouchTap={this.handleTouchTap.bind(this)}><i className="material-icons" style={styles.navIcon}>delete</i>Delete Project</a></p>-->
                </span>
            );
        }
    }

    handleTouchTap() {
        this.refs.deleteProject.show();
    }

    handleDeleteButton() {
        new Framework7().closePanel();
        ProjectActions.deleteProject();
        this.refs.deleteProject.dismiss();
    }
}

var styles = {
    navIcon: {
        paddingRight: 5,
        verticalAlign: -6
    }
};


export default NavChildren;
