import React from 'react';
import ProjectListActions from '../actions/projectListActions';
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
                    <div key={ project.id } style={styles.demoCardSquare}
                         className="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col">
                        <div className="mdl-card__title mdl-card--expand">
                            <i className="material-icons">folder</i>

                            <h1 style={styles.cardHeader} className="mdl-card__title-text">{ project.name }</h1>
                        </div>
                        <div className="mdl-card__supporting-text">
                            <p>ID: {project.id}</p>

                            <p>Description: {project.description} </p>
                        </div>
                    </div>
                );
            });

        let loading = this.props.loading ? <div className="loading-label">Loading...</div> : '';

        return (
            <div>
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
    demoCardSquare: {
        width: 320,
        height: 220,
        margin: 20
    },
    cardHeader: {
        margin: 20
    }
};

ProjectList.propTypes = {
    loading: React.PropTypes.bool,
    projects: React.PropTypes.array,
    error: React.PropTypes.string,
    //showDetailItem: React.PropTypes.object
};

export default ProjectList;

