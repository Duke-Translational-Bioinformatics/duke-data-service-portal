import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import AddProjectModal from '../projectComponents/addProjectModal.jsx';
import AccountOverview from '../../components/globalComponents/accountOverview.jsx';
import Header from '../../components/globalComponents/header.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import urlGen from '../../../util/urlGen.js';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import CardTitle from 'material-ui/lib/card/card-title';
import LinearProgress from 'material-ui/lib/linear-progress';

class ProjectList extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        if (this.props.error && this.props.error.response){
            this.props.error.response === 404 ? this.props.appRouter.transitionTo('/notFound') : null;
            this.props.error.response != 404 ? console.log(this.props.error.msg) : null;
        }
        let projects = this.props.projects.map((project) => {
            if (!project.is_deleted){
                return (
                    <Card key={ project.id } className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet" style={styles.card}>
                        <i className="material-icons mdl-color-text--grey-700" style={styles.icon}>content_paste</i>
                        <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + "/project/" + project.id} className="external">
                            <CardTitle title={project.name} subtitle={'ID: ' + project.id} titleColor="#424242" style={styles.cardTitle}/>
                        </a>
                        <CardText>
                            <span className="mdl-color-text--grey-900">Description:</span>{ project.description.length > 300 ? project.description.substring(0,300)+'...' : project.description }
                        </CardText>
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
                    <Loaders {...this.props}/>
                </div>
                { projects }
            </div>
        );
    }
}

ProjectList.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    card: {
        minHeight: 260,
        padding: 10
    },
    cardTitle: {
        fontWeight: 200,
        marginBottom: -15
    },
    icon: {
        fontSize: 36,
        float: 'left',
        margin: '20px 15px 0px 13px'
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
    error: React.PropTypes.object,
    is_deleted: React.PropTypes.bool
};

export default ProjectList;