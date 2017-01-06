import React from 'react';
import ReactDOM from 'react-dom';
import { RouteHandler } from 'react-router';
import MainActions from '../../actions/mainActions';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddAgentModal from '../../components/globalComponents/addAgentModal.jsx';
import CircularProgress from 'material-ui/lib/circular-progress';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';
import Help from 'material-ui/lib/svg-icons/action/help';
import IconButton from 'material-ui/lib/icon-button';
import Loaders from '../../components/globalComponents/loaders.jsx';
import LinearProgress from 'material-ui/lib/linear-progress';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import Search from 'material-ui/lib/svg-icons/action/search';
import Close from 'material-ui/lib/svg-icons/navigation/close';
import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';

class MetadataTemplateList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchMode: false,
            searchValue: null,
            timeout: null,
            toggleSwitch: false
        };
    }

    render() {
        if (this.props.error && this.props.error.response) {
            this.props.error.response === 404 ? this.props.appRouter.transitionTo('/notFound') : null;
            this.props.error.response != 404 ? console.log(this.props.error.msg) : null;
        }
        let currentUser = this.props.currentUser && this.props.currentUser !== null ? this.props.currentUser : null;
        let route = this.props.routerPath.split('/').splice([1], 1).toString();
        let showSearch = this.state.searchMode ? 'block' : 'none';
        let switchColor = this.state.toggleSwitch ? {track: {backgroundColor: '#235F9C'}, thumb: {backgroundColor: '#003366'}} :
            {track: {backgroundColor: '#BDBDBD'}, thumb: {backgroundColor: '#9E9E9E'}};
        let templateList = this.props.metaTemplates && this.props.metaTemplates !== null && currentUser !== null ? this.props.metaTemplates.map((obj) => {
            if(this.state.toggleSwitch){
                return (
                    <li key={ obj.id } className="hover" style={styles.listItem}>
                        <a className="item-content external" onTouchTap={()=> this.viewTemplate(obj.id)}>
                            <div className="item-media">
                                <FontIcon className="material-icons" style={styles.icon}>view_list</FontIcon>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-text mdl-color-text--grey-800" style={styles.title}>{ obj.label }</div>
                                </div>
                                <div className="item-text mdl-color-text--grey-600">{ obj.description }</div>
                            </div>
                        </a>
                    </li>
                );
            } else {
                if (obj.audit.created_by.id === currentUser.id) {
                    return (
                        <li key={ obj.id } className="hover" style={styles.listItem}>
                            <a className="item-content external aTag" onTouchTap={()=> this.viewTemplate(obj.id)}>
                                <div className="item-media">
                                    <FontIcon className="material-icons" style={styles.icon}>view_list</FontIcon>
                                </div>
                                <div className="item-inner">
                                    <div className="item-title-row">
                                        <div className="item-text mdl-color-text--grey-800"
                                             style={styles.title}>{ obj.label }</div>
                                    </div>
                                    <div className="item-text mdl-color-text--grey-600">{ obj.description }</div>
                                </div>
                            </a>
                        </li>
                    );
                }
            }
        }) : '';
        let tooltip = <span>Metadata templates allow you<br/>  to define a group of key-value pairs
            <br/> and then apply them to a file to create <br/> custom metadata. Metadata properties in the
            <br/> form of key-value pairs can help facilitate<br/> powerful and accurate search queries.</span>;

        return (
            <div className="list-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.list}>
                    <div className="mdl-cell mdl-cell--12-col" style={styles.headerWrapper}>
                        {route === 'metadata' ? <RaisedButton
                            style={styles.addTemplateBtn}
                            label="Add New Template"
                            labelStyle={styles.addTemplateBtn.label}
                            secondary={true}
                            onTouchTap={() => this.openMetadataManager()} /> : null}
                        <h4>Metadata Templates
                            <IconButton tooltip={tooltip}
                                        tooltipPosition="bottom-center"
                                        iconStyle={styles.infoIcon.size}
                                        style={styles.infoIcon}>
                                <Help color={'#BDBDBD'}/>
                            </IconButton>
                        </h4>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col">
                        {!this.state.searchMode ?
                            <IconButton
                                tooltip="Search Templates"
                                style={styles.searchIcon} onTouchTap={()=>this.toggleSearch(false)}>
                            <Search />
                        </IconButton> :
                        <IconButton
                            style={styles.searchIcon} onTouchTap={()=>this.toggleSearch(true)}>
                            <Close />
                        </IconButton>}
                        <Toggle
                            label="Show All Templates"
                            labelPosition="right"
                            style={!this.state.searchMode ? styles.toggleSearch : {display: 'none'}}
                            trackStyle={switchColor.track}
                            thumbStyle={switchColor.thumb}
                            onToggle={()=>this.toggleSwitch()}/>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col" style={styles.searchWrapper}>
                        <Paper className="mdl-cell mdl-cell--12-col"
                               style={{height: 40, marginBottom: -10, marginTop: 20, display: showSearch}}
                               zDepth={1}>
                            <TextField
                                id="searchInput"
                                ref="searchInput"
                                hintText="Search"
                                value={this.state.searchValue}
                                style={styles.searchInput}
                                underlineStyle={styles.textField.underline}
                                underlineFocusStyle={styles.textField.underline}
                                onChange={this.handleChange.bind(this)}
                                onKeyUp={() => this.onSearchChange()}/>
                        </Paper>
                    </div>
                </div>
                <div className="mdl-cell mdl-cell--12-col" style={styles.loading}>
                    {this.props.loading && route === 'metadata' ? <Loaders {...this.props}/> : null}
                    {this.props.loading && route !== 'metadata' ? <CircularProgress size={1.5} style={styles.drawerLoader}/> : null}
                </div>
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block media-list">
                        <ul>
                            {templateList}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    handleChange(e) {
        this.setState({searchValue: e.target.value});
    }

    onSearchChange() {
        let searchInput = this.refs.searchInput;
        let timeout = this.state.timeout;
        let value = searchInput.getValue();
        clearTimeout(timeout);
        this.setState({timeout: setTimeout(() => {
            let value = searchInput.getValue();
            if (!value.indexOf(' ') <= 0) {
                ProjectActions.loadMetadataTemplates(value);
            }
        }, 600)
        });
    }


    openMetadataManager() {
        ProjectActions.toggleMetadataManager();
    }

    toggleSearch(close) {
        if(!close) {
            setTimeout(()=> {
                let searchInput = this.refs.searchInput;
                searchInput.focus();
                if (this.state.searchValue !== ('' || 'search')) this.setState({searchValue: ''});
            }, 100);
        } else {
            ProjectActions.loadMetadataTemplates(null);
        }
        this.setState({searchMode: !this.state.searchMode});
    }

    toggleSwitch() {
        this.setState({toggleSwitch: !this.state.toggleSwitch})
    }

    viewTemplate(id) {
        ProjectActions.getMetadataTemplateDetails(id);
        ProjectActions.getMetadataTemplateProperties(id);
    }

    handleClose() {
        ProjectActions.closeModal();
    }
}

MetadataTemplateList.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    addTemplateBtn: {
        float: 'right',
        label: {
            fontWeight: 100
        }
    },
    drawerLoader: {
        position: 'absolute',
        margin: '0 auto',
        top: 200,
        left: 0,
        right: 0
    },
    headerTitle: {
        float: 'left',
        margin: '10px 0px 0px 14px'
    },
    headerWrapper: {
        padding: '0px 8px'
    },
    icon: {
        fontSize: 36,
        color: '#616161'
    },
    infoIcon: {
        verticalAlign: 8,
        size: {
            height: 20,
            width: 20
        }
    },
    list: {
        float: 'right',
        marginTop: -10
    },
    listItem: {
        cursor: 'pointer'
    },
    loaders: {
        paddingTop: 40
    },
    searchIcon: {
        float: 'right',
        marginTop: 0
    },
    searchInput: {
        width: '80%',
        marginLeft: 10,
        marginTop: -3
    },
    searchWrapper: {
        width: '100%',
        paddingRight: 16
    },
    textField: {
      underline: {
          display: 'none'
      }
    },
    title: {
        marginRight: 40
    },
    toggleSearch: {
        marginLeft: 10,
        float: 'left',
        width: '20%',
        marginTop: 12
    },
    uploader: {
        width: '95%',
        margin: '0 auto'
    }
};

MetadataTemplateList.propTypes = {
    metaTemplates: React.PropTypes.array,
    currentUser: React.PropTypes.object,
    screenSize: React.PropTypes.object
};

export default MetadataTemplateList;