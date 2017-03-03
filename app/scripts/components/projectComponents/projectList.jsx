import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import AddProjectModal from '../projectComponents/addProjectModal.jsx';
import Loaders from '../globalComponents/loaders.jsx';
import BaseUtils from '../../../util/baseUtils.js';
import {UrlGen} from '../../../util/urlEnum';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

@observer
class ProjectList extends React.Component {

    render() {
        const {loading, projects, responseHeaders} = mainStore;
        let headers = responseHeaders && responseHeaders !== null ? responseHeaders : null;
        let nextPage = headers !== null && !!headers['x-next-page'] ? headers['x-next-page'][0] : null;
        let totalProjects = headers !== null && !!headers['x-total'] ? headers['x-total'][0] : null;
        let projectList = projects ? projects.map((project) => {
            return (
                <Card key={ project.id } className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet" style={styles.card}>
                    <FontIcon className="material-icons" style={styles.icon}>content_paste</FontIcon>
                    <a href={UrlGen.routes.project(project.id)} className="external">
                        <CardTitle title={project.name} subtitle={'Created On: ' + BaseUtils.formatDate(project.audit.created_on)} titleColor="#424242" style={styles.cardTitle}/>
                    </a>
                    <CardText>
                        <span className="mdl-color-text--grey-900">Description:</span>{ project.description.length > 300 ? ' ' + project.description.substring(0,300)+'...' : ' ' + project.description }
                    </CardText>
                </Card>
            );
        }) : null;

        return (
            <div className="project-container mdl-grid">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                    <div style={styles.title}>
                        <h4>Projects</h4>
                    </div>
                    <AddProjectModal {...this.props} />
                    <Loaders {...this.props} />
                </div>
                { projectList }
                {projects && projects.length < totalProjects ? <div className="mdl-cell mdl-cell--12-col">
                    <RaisedButton
                        label={loading ? "Loading..." : "Load More"}
                        secondary={true}
                        disabled={loading ? true : false}
                        onTouchTap={()=>this.loadMore(nextPage)}
                        fullWidth={true}
                        style={loading ? {backgroundColor: '#69A3DD'} : {}}
                        labelStyle={loading ? {color: '#235F9C'} : {fontWeight: '100'}}/>
                    </div> : null}
            </div>
        );
    }

    loadMore(page) {
        mainStore.getProjects(page);
    }
}

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
        margin: '20px 15px 0px 13px',
        color: '#616161'
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

ProjectList.contextTypes = {
    muiTheme: React.PropTypes.object
};

ProjectList.propTypes = {
    loading: React.PropTypes.bool,
    projects: React.PropTypes.array,
    error: React.PropTypes.object
};

export default ProjectList;