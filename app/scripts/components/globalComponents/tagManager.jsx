import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import MetadataObjectCreator from '../globalComponents/metadataObjectCreator.jsx';
import MetadataPropertyManager from '../globalComponents/metadataPropertyManager.jsx';
import MetadataTemplateCreator from '../globalComponents/metadataTemplateCreator.jsx';
import MetadataTemplateList from '../globalComponents/metadataTemplateList.jsx';
import MetadataTemplateManager from '../globalComponents/metadataTemplateManager.jsx';
import MetadataTemplateOptions from '../globalComponents/metadataTemplateOptions.jsx';
import AddCircle from 'material-ui/lib/svg-icons/content/add-circle';
import AutoComplete from 'material-ui/lib/auto-complete';
import CircularProgress from 'material-ui/lib/circular-progress';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import LeftNav from 'material-ui/lib/left-nav';
import Help from 'material-ui/lib/svg-icons/action/help';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import RaisedButton from 'material-ui/lib/raised-button';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

class TagManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: '',
            timeout: null,
            searchText: ''
        };
    }

    componentDidMount() {
        if (window.performance && this.props.openTagManager) { // If page refreshed, close drawer
            if (performance.navigation.type == 1) {
                this.toggleTagManager();
            }
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.openTagManager !== this.props.openTagManager) {
            if(this.props.openTagManager) this.autocomplete.focus();
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="No"
                secondary={true}
                onTouchTap={() => this.handleCloseAll()} />,
            <FlatButton
                label="Yes"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleClose()} />
        ];
        const modalActions = [
            <FlatButton
                label="DISCARD TAGS"
                secondary={true}
                onTouchTap={() => this.discardTags()} />,
            <FlatButton
                label="ADD TAGS"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.addTagsToFiles()} />
        ];
        let tags = this.props.tagsToAdd && this.props.tagsToAdd.length > 0 ? this.props.tagsToAdd.map((tag)=>{
            return (<div key={Math.random()} className="chip">
                <span className="chip-text">{tag.label}</span>
                <span className="closebtn" onTouchTap={() => this.deleteTag(tag.id, tag.label)}>&times;</span>
            </div>)
        }) : null;
        let tagLabels = this.props.tagLabels.map((label)=>{
            return (
                <li key={label.label+Math.random()} style={styles.tagLabels} onTouchTap={() => this.addTagToCloud(label.label)}>{label.label}
                    <span className="mdl-color-text--grey-600">,</span>
                </li>
            )
        });
        let autoCompleteData = this.props.tagAutoCompleteList && this.props.tagAutoCompleteList.length > 0 ? this.props.tagAutoCompleteList : [];
        let height = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.height : window.innerHeight;
        let name = this.props.entityObj && this.props.filesChecked < 1 ? this.props.entityObj.name : 'selected files';
        let openDiscardTagsModal = this.props.toggleModal && this.props.toggleModal.id === 'discardTags' ? this.props.toggleModal.open : false;
        let openCreateAnotherObjectModal = this.props.toggleModal && this.props.toggleModal.id === 'metaDataObjectConfirm' ? this.props.toggleModal.open : false;
        let width = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.width : window.innerWidth;
        return (
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <LeftNav disableSwipeToOpen={true} width={width > 640 ? width*.80 : width} openRight={true} open={this.props.openTagManager}>
                    <div className="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800"
                         style={{marginTop: width > 680 ? 65 : 85}}>
                        <IconButton style={styles.toggleBtn}
                                    onTouchTap={() => this.toggleTagManager()}>
                            <NavigationClose />
                        </IconButton>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.wrapper}>
                        <Tabs inkBarStyle={styles.tabInkBar} className="mdl-cell mdl-cell--8-col mdl-cell--8-col-tablet">
                            <Tab label="Tags" style={styles.tabStyles}>
                                <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" >
                                    <h5 className="mdl-color-text--grey-600" style={styles.heading}>Add Tags to {name}
                                        <IconButton tooltip={<span>Tag your files with relevant keywords<br/> that can help with search and organization of content</span>}
                                                    tooltipPosition="bottom-center"
                                                    iconStyle={styles.infoIcon.size}
                                                    style={styles.infoIcon}>
                                            <Help color={'#BDBDBD'}/>
                                        </IconButton>
                                    </h5>
                                </div>
                                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.autoCompleteContainer}>
                                    <AutoComplete
                                        //ref="autocomplete"
                                        ref={(input) => this.autocomplete = input}
                                        fullWidth={true}
                                        style={styles.autoComplete}
                                        floatingLabelText="Type a Tag Label Here"
                                        filter={AutoComplete.fuzzyFilter}
                                        dataSource={autoCompleteData}
                                        errorText={this.state.floatingErrorText}
                                        onNewRequest={(value) => this.addTagToCloud(value)}
                                        onUpdateInput={this.handleUpdateInput.bind(this)}
                                        underlineStyle={styles.autoCompleteUnderline}/>
                                    <IconButton onTouchTap={() => this.addTagToCloud(this.state.searchText)}
                                                iconStyle={styles.addTagIconBtn.size}
                                                style={styles.addTagIconBtn}>
                                        <AddCircle color={'#235F9C'}/>
                                    </IconButton><br/>
                                </div>
                                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-400" style={styles.tagLabelsContainer}>
                                    <h6 style={styles.tagLabelsHeading}>Recently used tags <span style={styles.tagLabelsHeading.span}>(click on a tag to add it to {name})</span></h6>
                                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-400">
                                        <ul style={styles.tagLabelList}>
                                            { tagLabels }
                                        </ul>
                                    </div>
                                </div>
                                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-400" style={styles.chipWrapper}>
                                    {this.props.tagsToAdd.length ? <h6 style={styles.chipHeader}>New Tags To Add</h6> : null}
                                    <div className="chip-container" style={styles.chipContainer}>
                                        { tags }
                                    </div>
                                </div>
                                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-400" style={styles.buttonWrapper}>
                                    <RaisedButton label={'Cancel'} secondary={true}
                                                  labelStyle={styles.buttonLabel}
                                                  style={styles.cancelBtn}
                                                  onTouchTap={() => this.toggleTagManager()}/>
                                    <RaisedButton label={'Apply'} secondary={true}
                                                  labelStyle={styles.buttonLabel}
                                                  style={styles.applyBtn}
                                                  onTouchTap={() => this.addTagsToFiles()}/>
                                </div>
                            </Tab>
                            <Tab label="Advanced" style={styles.tabStyles} onActive={() => this.activeTab()}>
                                {this.props.drawerLoading ? <CircularProgress size={1.5} style={styles.drawerLoader}/> : <span>
                                    {this.props.showTemplateDetails ? <MetadataObjectCreator {...this.props}/> : <MetadataTemplateList {...this.props}/>}
                                </span>}
                            </Tab>
                        </Tabs>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.props.screenSize.width < 580 ? {width: '100%'} : {}}
                            title="Would you like to add these tags?"
                            autoDetectWindowHeight={true}
                            actions={modalActions}
                            modal={true}
                            open={openDiscardTagsModal}>
                            <div className="chip-container" style={styles.chipContainer}>
                                {tags}
                            </div>
                        </Dialog>
                    </div>
                </LeftNav>
            </div>
        )
    }

    activeTab() {
        if(this.props.tagsToAdd.length) ProjectActions.toggleModals('discardTags');
        if(!this.props.metaTemplates) ProjectActions.loadMetadataTemplates('');
    }

    addTagToCloud(label) {
        let clearText = ()=> {
            this.autocomplete.setState({searchText:''});
            this.autocomplete.focus();
        };
        if(label && !label.indexOf(' ') <= 0) {
            let tags = this.props.tagsToAdd;
            if (tags.some((el) => { return el.label === label.trim(); })) {
                this.setState({floatingErrorText: label + ' tag is already in the list'});
                setTimeout(()=>{
                    this.setState({floatingErrorText: ''});
                    clearText();
                }, 2000)
            } else {
                tags.push({label: label.trim()});
                ProjectActions.defineTagsToAdd(tags);
                setTimeout(()=>clearText(), 500);
                this.setState({floatingErrorText: ''})
            }
        }
    }

    addTagsToFiles() {
        let files = this.props.filesChecked;
        let id = this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.params.id;
        let tags = this.props.tagsToAdd;
        if(!tags.length) {
            this.setState({floatingErrorText: 'You must add tags to the list. Type a tag name and press enter.'});
        } else {
            if (this.props.filesChecked.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    ProjectActions.appendTags(files[i], 'dds-file', tags);
                    if(!!this.refs[files[i]]) this.refs[files[i]].checked = false;
                }
            } else {
                ProjectActions.appendTags(id, 'dds-file', tags);
            }
            if(this.props.toggleModal && this.props.toggleModal.id === 'discardTags') {
                this.discardTags();
            } else {
                this.toggleTagManager();
                this.setState({floatingErrorText: ''})
            }
        }
    }

    deleteTag(id, label) {
        let fileId = this.props.selectedEntity !== null ? this.props.selectedEntity.id : this.props.params.id;
        let tags = this.props.tagsToAdd;
        tags = tags.filter(( obj ) => {
            return obj.label !== label;
        });
        ProjectActions.defineTagsToAdd(tags);
    }

    discardTags() {
        ProjectActions.defineTagsToAdd([]);
        ProjectActions.toggleModals('discardTags');
    }

    handleClose() {
        ProjectActions.toggleModals();
    };

    handleUpdateInput (text) {
        let timeout = this.state.timeout;
        let searchInput = this.autocomplete;
        clearTimeout(this.state.timeout);
        this.setState({
            timeout: setTimeout(() => {
                let value = text;
                if (!value.indexOf(' ') <= 0) {
                    ProjectActions.getTagAutoCompleteList(value);
                }
            }, 500)
        });
    }

    toggleTagManager() {
        ProjectActions.toggleTagManager();
        ProjectActions.defineTagsToAdd([]);
        if(this.autocomplete.state.searchText !== '') this.autocomplete.setState({searchText:''});
    }
}

var styles = {
    addTagIconBtn: {
        margin: '-30px 0px 0px 0px',
        float: 'right',
        width: 24,
        height: 24,
        padding: 0,
        size: {
            height: 24,
            width: 24
        }
    },
    applyBtn: {
        margin: '12px 12px 12px 12px',
        float: 'right'
    },
    autoComplete: {
        maxWidth: '100%'
    },
    autoCompleteContainer: {
        maxWidth: '100%'
    },
    autoCompleteUnderline: {
        borderColor: '#0680CD',
        maxWidth: 'calc(100% - 42px)'
    },
    buttonLabel: {
        fontWeight: 100
    },
    buttonWrapper: {
        textAlign: 'left'
    },
    cancelBtn: {
        margin: '12px 0px 12px 12px',
        float: 'right'
    },
    chipWrapper: {
        textAlign: 'left'
    },
    chipContainer: {
        marginTop: 22,
        padding: 0
    },
    chipHeader: {
        margin: '10px 0px 10px 0px',
        paddingTop: 20
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    drawerLoader: {
        position: 'absolute',
        margin: '0 auto',
        top: 200,
        left: 0,
        right: 0
    },
    heading: {
        textAlign: 'left'
    },
    infoIcon: {
        verticalAlign: 8,
        size: {
            height: 20,
            width: 20
        }
    },
    modalIcon: {
        fontSize: 48,
        textAlign: 'center',
        color: '#4CAF50'
    },
    tabInkBar: {
        backgroundColor: '#EC407A',
        paddingTop: 3,
        marginTop: -3
    },
    tabStyles: {
        fontWeight: 200
    },
    tagLabels: {
        margin: 3,
        cursor: 'pointer',
        color: '#235F9C',
        float: 'left'
    },
    tagLabelsContainer: {
        textAlign: 'left'
    },
    tagLabelsHeading: {
        margin: '10px 0px 10px 0px',
        span: {
            fontSize: '.7em'
        }
    },
    tagLabelList: {
        listStyleType: 'none',
        padding: '5px 0px 5px 0px',
        margin: '0px 0px 0px -10px'
    },
    toggleBtn: {
        margin: '25px 0px 15px 0px',
        zIndex: 9999
    },
    wrapper:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingLeft: 5
    }
};

TagManager.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default TagManager;