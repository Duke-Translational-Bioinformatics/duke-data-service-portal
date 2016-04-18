import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { Link } from 'react-router';
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import AgentOptionsMenu from '../components/globalComponents/agentOptionsMenu.jsx';
import Loaders from '../components/globalComponents/loaders.jsx';
import BaseUtils from '../../util/baseUtils.js';
import urlGen from '../../util/urlGen.js';
import Card from '../../../node_modules/material-ui/lib/card/card';

class Agent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            agent: ProjectStore.agent,
            loading: false,
            errorModal: ProjectStore.errorModal,
            error: ProjectStore.error
        };
    }

    componentDidMount() {
        let id = this.props.params.id;
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        this._loadAgent(id);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _loadAgent(id) {
        let kind = 'software_agents';
        ProjectActions.getEntity(id, kind);
        ProjectActions.getAgentKey(id);
        ProjectActions.getUserKey();
    }

    render() {
        if (this.state.error && this.state.error.response){
            this.state.error.response === 404 ? this.state.appRouter.transitionTo('/notFound') : null;
            this.state.error.response != 404 ? console.log(this.state.error.msg) : null;
        }
        let agentKey = this.state.agentKey ? this.state.agentKey.key : null;
        let id = this.state.entityObj ? this.state.entityObj.id : null;
        let name = this.state.entityObj ? this.state.entityObj.name : null;
        let description = this.state.entityObj ? this.state.entityObj.description : null;
        let crdOn = this.state.entityObj && this.state.entityObj.audit ? this.state.entityObj.audit.created_on : null;
        let x = new Date(crdOn);
        let createdOn = x.toString();
        let createdBy = this.state.entityObj && this.state.entityObj.audit ? this.state.entityObj.audit.created_by.full_name : null;
        let lastUpdatedOn = this.state.entityObj && this.state.entityObj.audit ? this.state.entityObj.audit.last_updated_on : null;
        let lastUpdatedBy = this.state.entityObj && this.state.entityObj.audit.last_updated_by ? this.state.entityObj.audit.last_updated_by.full_name : null;
        let repoUrl = this.state.entityObj ? this.state.entityObj.repo_url : null;
        let agent = <Card className="project-container mdl-color--white content mdl-color-text--grey-800"
                          style={styles.container}>
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <div style={styles.menuIcon}>
                    <AgentOptionsMenu {...this.props} {...this.state}/>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                    <a href={urlGen.routes.agents() }
                       className="mdl-color-text--grey-800 external">
                        <i className="material-icons"
                           style={styles.backIcon}>keyboard_backspace</i>Back</a>
                </div>
                <div className="mdl-cell mdl-cell--9-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                    <p className="mdl-color-text--grey-800" style={styles.title}><i className="material-icons" style={styles.icon}>laptop_mac</i>{name}</p>
                </div>
                <div className="mdl-cell mdl-cell--9-col mdl-cell--8-col-tablet mdl-color-text--grey-600">
                    <p style={styles.subTitle}>{ description }</p>
                </div>
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block">
                        <ul>
                            <li className="item-divider">Software Agent API Key</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ agentKey }</div>
                                </div>
                            </li>
                            <li className="item-divider">Software Agent ID</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ id }</div>
                                </div>
                            </li>
                            <li className="item-divider">Repository URL</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    {repoUrl === null ? <span>N/A</span> : <a className="external mdl-color-text--grey-800" href={ repoUrl } >{ repoUrl }</a>}
                                </div>
                            </li>
                            <li className="item-divider">Created By</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ createdBy }</div>
                                </div>
                            </li>
                            <li className="item-divider">Created On</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ createdOn }</div>
                                </div>
                            </li>
                            <li className="item-divider">Last Updated By</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ lastUpdatedBy === null ? 'N/A' : lastUpdatedBy}</div>
                                </div>
                            </li>
                            <li className="item-divider">Last Updated On</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ lastUpdatedOn === null ? 'N/A' : lastUpdatedOn }</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </Card>;
        return (
            <div>
                {agent}

            </div>
        )
    }
    handleDownload(){
        let id = this.props.params.id;
        ProjectActions.getDownloadUrl(id);
    }
}

var styles = {
    arrow: {
        textAlign: 'left'
    },
    backIcon: {
        fontSize: 24,
        verticalAlign:-7
    },
    container: {
        marginTop: 30,
        marginBottom: 30,
        position: 'relative',
        overflow: 'visible',
        padding: '10px 0px 10px 0px'
    },
    floatingButton: {
        position: 'absolute',
        top: -20,
        right: '2%',
        zIndex: '2',
        color: '#ffffff'
    },
    icon: {
        fontSize: 28,
        marginRight: 8,
        verticalAlign: -6
    },
    menuIcon: {
        float: 'right',
        marginTop: 30
    },
    subTitle: {
        fontSize: '1.1em',
        marginLeft: 16,
        marginRight: 10
    },
    title: {
        fontSize: 24,
        marginLeft: 16,
        marginTop: 20
    }
};

Agent.contextTypes = {
    muiTheme: React.PropTypes.object
};

Agent.propTypes = {
    loading: bool,
    details: array,
    error: object
};

export default Agent;