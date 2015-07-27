import React from 'react';
import ProjectListActions from '../actions/projectListActions';
import AccountOverview from '../components/accountOverview.jsx';
var mui = require('material-ui');

class ProjectList extends React.Component {

    constructor() {
    }

    render() {
        var error = '';
        if(this.props.error)
            error = (<h4>{this.props.error}</h4>);
            let projects = this.props.projects.map((project) => {
                return (
                    <div key={ project.id } style={styles.cardSquare}
                         className="mdl-card mdl-shadow--3dp mdl-cell mdl-cell--4-col">
                        <div className="title mdl-card__title mdl-card--expand">
                            <i className="material-icons mdl-color-text--grey-800">folder</i>
                            <h1 className="mdl-card__title-text content mdl-color-text--grey-800" style={styles.cardHeader} >{ project.name }</h1>
                        </div>
                        <div className="mdl-card__supporting-text mdl-color-text--grey-800">
                            <p>ID: {project.id}</p>
                            <p>Description: { project.description } </p>
                        </div>
                    </div>
                );
            });

        let loading = this.props.loading ? <div class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';

        return (
                <div className="demo mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.projectListTitle}>
                        <div style={styles.projectListTitle}>
                            <h4>Projects</h4>
                        </div>
                        <div style={styles.addProject}>
                        <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary" style={styles.addProject}>
                            ADD PROJECT
                        </button>
                        </div>
                    </div>
                    { error }
                    { loading }
                    { projects }
                </div>

        );
    }

}


ProjectList.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    cardSquare: {
        width: 320,
        height: 220,
        margin: 20,
        display: 'inline-block'
    },
    addProject: {
        float: 'right',
        position: 'relative',
        margin: '20px 36px 0px 0px'
    },
    projectListTitle: {
        margin: 20,
        marginBottom: -5,
        textAlign: 'left',
        overflow: 'auto',
        float: 'left',
        paddingLeft: 20
    }
};

ProjectList.propTypes = {
    loading: React.PropTypes.bool,
    projects: React.PropTypes.array,
    error: React.PropTypes.string,
    //showDetailItem: React.PropTypes.object
};

export default ProjectList;

