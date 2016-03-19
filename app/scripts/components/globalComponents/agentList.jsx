import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddAgentModal from '../../components/globalComponents/addAgentModal.jsx';
import BatchOps from '../../components/globalComponents/batchOps.jsx';
import ErrorModal from '../../components/globalComponents/errorModal.jsx';
import Header from '../../components/globalComponents/header.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import urlGen from '../../../util/urlGen.js';
import Badge from 'material-ui/lib/badge';
import LinearProgress from 'material-ui/lib/linear-progress';
import RaisedButton from 'material-ui/lib/raised-button';

class AgentList extends React.Component {

    constructor() {
        this.state = {
            page: 0
        }
    }

    render() {
        let agents = [];
        if (this.props.error && this.props.error.response) {
            this.props.error.response === 404 ? this.props.appRouter.transitionTo('/notFound') : null;
            this.props.error.response != 404 ? console.log(this.props.error.msg) : null;
        }

        agents = this.props.agents;

        let agentList = agents.map((agent) => {
            if (agent.audit.created_by.id === this.props.currentUser.id) {
                return (
                    <li key={ agent.id } className="hover">
                        <a href={urlGen.routes.baseUrl + urlGen.routes.prefix  + "/agent/" + agent.id} className="item-content external">
                            <div className="item-media">
                                <i className="material-icons" style={styles.icon}>laptop_mac</i>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800" style={styles.title}>{ agent.name }</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">{ agent.description && agent.description.length > 180 ? agent.description.substring(0, 181) + '...' : agent.description }</div>
                                <div className="item-subtitle mdl-color-text--grey-600">ID: { agent.id }</div>
                            </div>
                        </a>
                    </li>
                );
            } else {
                return (
                    null
                );
            }
        });

        return (
            <div className="list-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    <div style={styles.headerTitle}>
                        <h4>Software Agents</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col">
                        <AddAgentModal {...this.props}/>
                    </div>
                    <ErrorModal {...this.props}/>
                </div>
                { this.props.uploads || this.props.loading ? <Loaders {...this.props}/> : null }
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block list-block-search searchbar-found media-list">
                        <ul>
                            {agentList}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

AgentList.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    checkBox: {
        width: 16,
        height: 16,
        marginBottom: 21
    },
    checkboxLabel: {
        borderRadius: 35,
        paddingRight: 20
    },
    dlIcon: {
        float: 'right',
        fontSize: 18,
        color: '#EC407A',
        marginTop: 6,
        marginLeft: 15,
        padding: '08px 08px 08px 08px',
        zIndex: 100
    },
    fillerDiv: {
        height: 24,
        width: 32,
        float: 'right',
        marginLeft: 32,
        padding: '08px 08px 08px 08px'
    },
    headerTitle: {
        float: 'left',
        margin: '10px 0px 0px 14px'
    },
    icon: {
        fontSize: 36
    },
    list: {
        float: 'right',
        marginTop: -10
    },
    title: {
        marginRight: 40
    }
};

AgentList.propTypes = {
    loading: React.PropTypes.bool,
    agents: React.PropTypes.array,
    error: React.PropTypes.object
};

export default AgentList;