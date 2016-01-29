import React from 'react';
import { RouteHandler, Link } from 'react-router';
import MainStore from '../../stores/mainStore';
import MainActions from '../../actions/mainActions';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';

class NavChildren extends React.Component {

    constructor(props, context) {
        super(props);
    }

    render() {
        let currentPath = window.location.hash.split('/').slice(1, 2).toString();

        if (currentPath === 'home') {
            return (
                <span>
                </span>
            );
        } else {
            return (
                <span>
                    <p><Link to="home"><i className="material-icons" style={styles.navIcon}>home</i>Home</Link></p>
                </span>
            );
        }
    }
}

var styles = {
    navIcon: {
        paddingRight: 5,
        verticalAlign: -6
    }
};

export default NavChildren;
