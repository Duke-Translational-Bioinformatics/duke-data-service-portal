import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import AccountOverview from '../../components/globalComponents/accountOverview.jsx';
import Header from '../../components/globalComponents/header.jsx';
import AddProjectModal from '../projectComponents/addProjectModal.jsx';
import urlGen from '../../../util/urlGen.js';
import LinearProgress from 'material-ui/lib/linear-progress';
import Card from 'material-ui/lib/card/card';

class ProjectList extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        let loading = this.props.loading ? <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate loader"></div> : '';
        var error = '';
        if(this.props.error)
            error = (<p className="mdl-color-text--grey-400">{this.props.error}</p>);
        let projects = this.props.projects.map((project) => {
            if (!project.is_deleted){
                return (
                    <Card key={ project.id } style={styles.cardSquare} className="card mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                        <div className="mdl-card__title mdl-card--expand">
                            <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>content_paste</i>
                            <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + "/project/" + project.id} className="external">
                                <h1 className="mdl-card__title-text mdl-color-text--grey-800"
                                    style={styles.cardHeader} projectId={project.id}>{ project.name.length > 35 ? project.name.substring(0,35)+'...' : project.name }</h1>
                            </a>
                        </div>
                        <div className="mdl-card__supporting-text mdl-color-text--grey-800">
                            <p>ID: {project.id}</p>
                            <p>Description: { project.description.length > 150 ? project.description.substring(0,150)+'...' : project.description }</p>
                        </div>
                    </Card>
                );
            }
        });

        return (
            <div className="project-container mdl-grid">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                    <div style={styles.title}>
                        <h4>Projects</h4>
                    </div>
                    <AddProjectModal {...this.props} />
                    { loading }
                </div>
                { error }
                { projects }
            </div>
        );
    }
}

ProjectList.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    cardHeader: {
        paddingLeft: 15
    },
    cardSquare: {
        height: 260,
        textAlign: 'left',
        display: 'inline-block',
        overflow: 'hidden',
        padding: 10
    },
    icon: {
        fontSize: 36
    },
    listTitle: {
        margin: '0px 0px 0px 0px',
        textAlign: 'left',
        float: 'left',
        paddingLeft: 20
    },
    title: {
        margin: '-10px 0px 0px 0px',
        textAlign: 'left',
        float: 'left',
        marginLeft: -14
    }
};

ProjectList.propTypes = {
    loading: React.PropTypes.bool,
    projects: React.PropTypes.array,
    error: React.PropTypes.string,
    is_deleted: React.PropTypes.bool
};

export default ProjectList;