import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddAgentModal from '../../components/globalComponents/addAgentModal.jsx';
import BatchOps from '../../components/globalComponents/batchOps.jsx';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import ErrorModal from '../../components/globalComponents/errorModal.jsx';
import Header from '../../components/globalComponents/header.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import urlGen from '../../../util/urlGen.js';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

class AgentList extends React.Component {

    constructor() {
        this.state = {
            apiKeyOpen: false
        }
    }

    render() {
        let agents = [];
        let agentKey = this.props.agentKey ? this.props.agentKey.key : null;

        let keyActions = [
            <FlatButton
                label="OKAY"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="COPY KEY TO CLIPBOARD"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={this.handleCopyButton.bind(this)} />
        ];

        let modal = <Dialog
            style={styles.dialogStyles}
            title="Your API Key"
            autoDetectWindowHeight={true}
            autoScrollBodyContent={true}
            actions={keyActions}
            onRequestClose={() => this.handleClose()}
            open={this.state.apiKeyOpen}>
            <h6 style={{textAlign: 'center'}}>Here's your API key.</h6>
            <form action="#" id="apiKeyForm">
                <TextField
                    style={styles.keyModal}
                    defaultValue={agentKey}
                    floatingLabelText="Current Api Key"
                    id="keyText"
                    type="text"
                    multiLine={true}
                    /><br/>
            </form>
        </Dialog>;

        if (this.props.error && this.props.error.response) {
            this.props.error.response === 404 ? this.props.appRouter.transitionTo('/notFound') : null;
            this.props.error.response != 404 ? console.log(this.props.error.msg) : null;
        }

        agents = this.props.agents;

        let agentList = agents.map((agent) => {
            if (agent.audit.created_by.id === this.props.currentUser.id) {
                return (
                    <li key={ agent.id } className="hover">
                        <FlatButton label="get api key" primary={true} style={{float: 'right', marginTop: 15}} onTouchTap={() => this.handleTouchTapApiKey(agent.id)}/>
                        <a href={urlGen.routes.baseUrl + "agent/" + agent.id} className="item-content external">
                            <div className="item-media">
                                <i className="material-icons" style={styles.icon}>laptop_mac</i>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-text mdl-color-text--grey-800" style={styles.title}>{ agent.name }</div>
                                </div>
                                <div className="item-text mdl-color-text--grey-600">{ agent.description }</div>
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
                {modal}
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

    handleTouchTapApiKey(id) {
        ProjectActions.getAgentKey(id);
        setTimeout(() => {
            this.setState({apiKeyOpen: true});
            document.getElementById('keyText').select()
        }, 500);
    }

    handleCopyButton() {
        let copyTextArea = document.querySelector('#keyText');
        copyTextArea.select();
        let clipText = document.execCommand('copy');
        this.setState({
            apiKeyOpen: false
        });
    };

    handleClose() {
        this.setState({
            apiKeyOpen: false
        });
    };
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
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
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
    keyModal: {
        width: 300,
        textAlign: 'left'
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