import React from 'react';
import PropTypes from 'prop-types';
const { object, bool, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore'
import authStore from '../../stores/authStore'
import { Color } from '../../theme/customTheme';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import Help from 'material-ui/svg-icons/action/help';
import IconButton from 'material-ui/IconButton';
import Loaders from '../../components/globalComponents/loaders.jsx';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Search from 'material-ui/svg-icons/action/search';
import Close from 'material-ui/svg-icons/navigation/close';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

@observer
class MetadataTemplateList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchMode: false,
            searchValue: '',
            timeout: null,
            toggleSwitch: false
        };
        this.search = _.debounce(this.search ,600);
    }

    render() {
        const { metaTemplates, loading } = mainStore;
        const { currentUser } = authStore;
        let route = this.props.location.pathname.split('/').splice([1], 1).toString();
        let showSearch = this.state.searchMode ? 'block' : 'none';
        let switchColor = this.state.toggleSwitch ? {track: {backgroundColor: Color.blue}, thumb: {backgroundColor: Color.ltBlue2}} :
            {track: {backgroundColor: Color.ltGrey}, thumb: {backgroundColor: Color.dkGrey}};
        let templateList = metaTemplates && metaTemplates !== null && currentUser !== null ? metaTemplates.map((obj) => {
            if(this.state.toggleSwitch){
                return (
                    <li key={ obj.id } className="hover" style={styles.listItem}>
                        <a className="item-content external" onTouchTap={()=> this.viewTemplate(obj.id)}>
                            <div className="item-media">
                                <FontIcon className="material-icons" style={styles.icon}>info_outline</FontIcon>
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
                                    <FontIcon className="material-icons" style={styles.icon}>info_outline</FontIcon>
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
                            onTouchTap={() => this.openMetadataManager()} /> : null}
                        <h4>Metadata Templates
                            <IconButton tooltip={tooltip}
                                        tooltipPosition="bottom-center"
                                        iconStyle={styles.infoIcon.size}
                                        style={styles.infoIcon}>
                                <Help color={Color.ltGrey}/>
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
                                onKeyUp={() => this.search()}/>
                        </Paper>
                    </div>
                </div>
                <div className="mdl-cell mdl-cell--12-col" style={styles.loading}>
                    {loading && route === 'metadata' ? <Loaders {...this.props}/> : null}
                    {loading && route !== 'metadata' ? <CircularProgress size={80} thickness={5} style={styles.drawerLoader}/> : null}
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

    search() {
        let value = this.refs.searchInput.getValue();
        if (!value.indexOf(' ') <= 0) {
            mainStore.loadMetadataTemplates(value);
        }
    }

    openMetadataManager() {
        mainStore.toggleMetadataManager();
    }

    toggleSearch(close) {
        if(!close) {
            setTimeout(()=> {
                let searchInput = this.refs.searchInput;
                searchInput.focus();
                if (this.state.searchValue !== ('' || 'search')) this.setState({searchValue: ''});
            }, 100);
        } else {
            mainStore.loadMetadataTemplates(null);
        }
        this.setState({searchMode: !this.state.searchMode});
    }

    toggleSwitch() {
        this.setState({toggleSwitch: !this.state.toggleSwitch})
    }

    viewTemplate(id) {
        mainStore.getMetadataTemplateDetails(id);
        mainStore.getMetadataTemplateProperties(id);
    }
}

const styles = {
    addTemplateBtn: {
        float: 'right',
        marginTop: 10,
        label: {
            color: Color.blue
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
        color: Color.dkGrey2
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
    metaTemplates: array,
    currentUser: object,
    loading: bool
};

export default MetadataTemplateList;