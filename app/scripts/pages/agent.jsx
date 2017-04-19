import React, { PropTypes } from 'react';
const { object } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import agentStore from '../stores/agentStore';
import authStore from '../stores/authStore';
import AgentOptionsMenu from '../components/globalComponents/agentOptionsMenu.jsx';
import Loaders from '../components/globalComponents/loaders.jsx';
import {UrlGen, Path} from '../util/urlEnum';
import Card from 'material-ui/Card';

@observer
class Agent extends React.Component {

    componentDidMount() {
        this._loadAgent();
    }

    _loadAgent() {
        let id = this.props.params.id;
        mainStore.getEntity(id, Path.AGENT);
        agentStore.getAgentKey(id);
        if(authStore.userKey.key) authStore.getUserKey();
    }

    render() {
        const { agentKey } = agentStore;
        const { entityObj } = mainStore;
        let key = agentKey ? agentKey.key : null;
        let id = entityObj ? entityObj.id : null;
        let name = entityObj ? entityObj.name : null;
        let description = entityObj ? entityObj.description : null;
        let crdOn = entityObj && entityObj.audit ? entityObj.audit.created_on : null;
        let x = new Date(crdOn);
        let createdOn = x.toString();
        let createdBy = entityObj && entityObj.audit ? entityObj.audit.created_by.full_name : null;
        let lastUpdatedOn = entityObj && entityObj.audit ? entityObj.audit.last_updated_on : null;
        let lastUpdatedBy = entityObj && entityObj.audit.last_updated_by ? entityObj.audit.last_updated_by.full_name : null;
        let repoUrl = entityObj ? entityObj.repo_url : null;
        let agent = <Card className="project-container mdl-color--white content mdl-color-text--grey-800"
                          style={{marginBottom: 30, overflow: 'visible', padding: '10px 0px 10px 0px'}}>
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <div style={styles.menuIcon}>
                    <AgentOptionsMenu {...this.props}/>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                    <a href={UrlGen.routes.agents() }
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
                                    <div>{ key }</div>
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
    entityObj: object,
    agentKey: object
};

export default Agent;