import React from 'react';
import PropTypes from 'prop-types';
const { object, bool, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import BaseUtils from '../../util/baseUtils';
import { Kind } from '../../util/urlEnum';
import { Color } from '../../theme/customTheme';
import MetadataObjectCreator from '../globalComponents/metadataObjectCreator.jsx';
import MetadataTemplateList from '../globalComponents/metadataTemplateList.jsx';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import Help from 'material-ui/svg-icons/action/help';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';

@observer
class TagManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: '',
            timeout: null,
            searchText: ''
        };
        this.focusAutocomplete = _.debounce(this.focusAutocomplete ,500);
    }

    componentDidMount() {
        if (window.performance && mainStore.openTagManager) { // If page refreshed, close drawer
            if (performance.navigation.type == 1) {
                this.toggleTagManager();
            }
        }
    }

    componentDidUpdate() {
        if(mainStore.openTagManager && !mainStore.isFirefox) this.focusAutocomplete(); // Using _.debouce() here to avoid this being called twice from list item menu
    }

    render() {
        const {drawerLoading, entityObj, filesChecked, openTagManager, screenSize, selectedEntity, showTagCloud, showTemplateDetails, tagAutoCompleteList, tagLabels, tagsToAdd, toggleModal} = mainStore;
        const { activity, selectedNode } = provenanceStore;
        let autoCompleteData = tagAutoCompleteList && tagAutoCompleteList.length > 0 ? tagAutoCompleteList : [];
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let id = selectedNode && selectedNode.properties !== undefined ? selectedNode.properties.id : selectedEntity !== null ? selectedEntity.id : this.props.params.id;
        let name = entityObj && filesChecked < 1 ? selectedNode && selectedNode.properties !== undefined ? selectedNode.properties.name : this.props.location.pathname.includes('activity') && activity !== null ? activity.name : entityObj.name : 'selected files';
        let openDiscardTagsModal = toggleModal && toggleModal.id === 'discardTags' ? toggleModal.open : false;
        let width = window.innerWidth > 640 ? window.innerWidth*.8 : window.innerWidth;
        const modalActions = [
            <FlatButton
                label="DISCARD TAGS"
                secondary={true}
                onTouchTap={() => this.discardTags()} />,
            <FlatButton
                label="ADD TAGS"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.addTagsToResource(filesChecked, id, tagsToAdd, toggleModal)} />
        ];

        let tags = tagsToAdd && tagsToAdd.length > 0 ? tagsToAdd.map((tag)=>{
            return (<div key={BaseUtils.generateUniqueKey()} className="chip">
                <span className="chip-text">{tag.label}</span>
                <span className="closebtn" onTouchTap={() => this.deleteTag(tag.label)}>&times;</span>
            </div>)
        }) : null;

        let tagLbls = tagLabels.map((tag)=>{
            return (
                <li key={BaseUtils.generateUniqueKey()} style={styles.tagLabels} onTouchTap={() => this.addTagToCloud(tag.label)}>{tag.label}
                    <span className="mdl-color-text--grey-600">,</span>
                </li>
            )
        });

        return (
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <Drawer docked={false}
                        disableSwipeToOpen={true}
                        width={width}
                        openSecondary={true}
                        onRequestChange={() => this.toggleTagManager()}
                        open={openTagManager}>
                    <div className="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" style={styles.drawer}>
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
                                        <IconButton tooltip={<span>Tag your resources with relevant keywords<br/> that can help with search and organization of content</span>}
                                                    tooltipPosition="bottom-center"
                                                    iconStyle={styles.infoIcon.size}
                                                    style={styles.infoIcon}>
                                            <Help color={Color.ltGrey}/>
                                        </IconButton>
                                    </h5>
                                </div>
                                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.autoCompleteContainer}>
                                    <AutoComplete
                                        ref={(input) => this.tagAutocomplete = input}
                                        fullWidth={true}
                                        style={styles.autoComplete}
                                        floatingLabelText="Type a label or comma separated list of labels"
                                        filter={AutoComplete.fuzzyFilter}
                                        dataSource={autoCompleteData}
                                        errorText={this.state.floatingErrorText}
                                        onNewRequest={(value) => this.addTagToCloud(value)}
                                        onUpdateInput={this.handleUpdateInput.bind(this)}
                                        underlineStyle={styles.autoCompleteUnderline}/>
                                    <IconButton onTouchTap={() => this.addTagToCloud(this.tagAutocomplete.state.searchText)}
                                                iconStyle={styles.addTagIconBtn.size}
                                                style={styles.addTagIconBtn}>
                                        <AddCircle color={Color.blue}/>
                                    </IconButton><br/>
                                </div>
                                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.tagLabelsContainer}>
                                    <h6 style={styles.tagLabelsHeading}>Recently used tags</h6>
                                    <i className="material-icons" style={styles.toggleTagBtn} onTouchTap={()=>this.toggleTagCloud()}>{showTagCloud ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
                                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={{display: showTagCloud ? 'block' : 'none', marginTop: 0}}>
                                        <span className="mdl-cell mdl-cell--12-col" style={styles.tagLabelsHeading.span}>
                                            {'(click on a tag to add it to '+name+')'}
                                        </span>
                                        <ul style={styles.tagLabelList}>
                                            { tagLbls }
                                        </ul>
                                    </div>
                                </div>
                                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.chipWrapper}>
                                    {tagsToAdd.length ? <h6 className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.chipHeader}>New Tags To Add</h6> : null}
                                    <div className="chip-container" style={styles.chipContainer}>
                                        { tags }
                                    </div>
                                </div>
                                <div className="mdl-cell mdl-cell--12-col" style={styles.buttonWrapper}>
                                    <RaisedButton label={'Add Tags'}
                                                  labelStyle={styles.buttonLabel}
                                                  style={styles.applyBtn}
                                                  onTouchTap={() => this.addTagsToResource(filesChecked, id, tagsToAdd, toggleModal)}/>
                                    <RaisedButton label={'Cancel'}
                                                  labelStyle={styles.buttonLabel}
                                                  style={styles.cancelBtn}
                                                  onTouchTap={() => this.toggleTagManager()}/>
                                </div>
                            </Tab>
                            <Tab label="Advanced" style={styles.tabStyles} onActive={() => this.activeTab()}>
                                {drawerLoading ? <CircularProgress size={80} thickness={5} style={styles.drawerLoader}/> : <span>
                                    {showTemplateDetails ? <MetadataObjectCreator {...this.props}/> : <MetadataTemplateList {...this.props}/>}
                                </span>}
                            </Tab>
                        </Tabs>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={dialogWidth}
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
                </Drawer>
            </div>
        )
    }

    focusAutocomplete() {
        this.tagAutocomplete.refs.searchTextField.input.focus()
    }

    activeTab() {
        if(mainStore.tagsToAdd.length) mainStore.toggleModals('discardTags');
        if(!mainStore.metaTemplates.length) mainStore.loadMetadataTemplates('');
    }

    checkIfTagAlreadyUsed(tag) {
        let tags = mainStore.tagsToAdd;
        let clearText = ()=> {
            this.tagAutocomplete.setState({searchText:''});
            this.tagAutocomplete.refs.searchTextField.input.focus()
        };
        if (tags.some((el) => { return el.label === tag.trim(); })) {
            this.setState({floatingErrorText: tag + ' tag is already in the list'});
            setTimeout(()=>{
                this.setState({floatingErrorText: ''});
                clearText();
            }, 2000)
        } else {
            tags.push({label: tag.trim()});
            mainStore.defineTagsToAdd(tags);
            setTimeout(()=>clearText(), 500);
            this.setState({floatingErrorText: ''})
        }
    }

    addTagToCloud(tag) {
        if(tag && !tag.indexOf(' ') <= 0) {
            if (tag.indexOf(',') > -1) tag = tag.split(',');
            if(tag && tag.constructor === Array) {
                tag.forEach((label) => this.checkIfTagAlreadyUsed(label))
            } else {
                this.checkIfTagAlreadyUsed(tag);
            }
        }
    }

    addTagsToResource(filesChecked, id, tagsToAdd, toggleModal) {
        const { selectedNode } = provenanceStore;
        const kind = selectedNode && selectedNode.properties !== undefined && selectedNode.properties.kind === Kind.DDS_ACTIVITY || this.props.location.pathname.includes('activity') ? Kind.DDS_ACTIVITY : Kind.DDS_FILE;
        if(!tagsToAdd.length) {
            this.setState({floatingErrorText: 'You must add tags to the list. Type a tag name and press enter.'});
        } else {
            if (filesChecked.length > 0) {
                for (let i = 0; i < filesChecked.length; i++) {
                    mainStore.appendTags(filesChecked[i], 'dds-file', tagsToAdd);
                }
            } else {
                mainStore.appendTags(id, kind, tagsToAdd);
            }
            if(toggleModal && toggleModal.id === 'discardTags') {
                this.discardTags();
            } else {
                this.toggleTagManager();
                this.setState({floatingErrorText: ''})
            }
            if(mainStore.showTagCloud) this.toggleTagCloud();
        }
    }

    deleteTag(label) {
        let tags = mainStore.tagsToAdd;
        tags = tags.filter(( obj ) => {
            return obj.label !== label;
        });
        mainStore.defineTagsToAdd(tags);
    }

    discardTags() {
        mainStore.defineTagsToAdd([]);
        mainStore.toggleModals('discardTags');
    }

    handleClose() {
        mainStore.toggleModals();
    };

    handleUpdateInput (text) {
        clearTimeout(this.state.timeout);
        this.setState({
            timeout: setTimeout(() => {
                let value = text;
                if (!value.indexOf(' ') <= 0) {
                    mainStore.getTagAutoCompleteList(value);
                }
            }, 500)
        });
    }

    toggleTagCloud() {
        mainStore.toggleTagCloud();
    }

    toggleTagManager() {
        mainStore.toggleTagManager();
        mainStore.defineTagsToAdd([]);
        if(mainStore.showTagCloud) this.toggleTagCloud();
        if(this.tagAutocomplete.state.searchText !== '') this.tagAutocomplete.setState({searchText:''});
    }
}

const styles = {
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
        borderColor: Color.ltBlue,
        maxWidth: 'calc(100% - 22px)'
    },
    buttonLabel: {
        color: Color.blue
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
        margin: '20px 0px 20px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        zIndex: '5000'
    },
    drawer: {
        marginTop: 45
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
    tabInkBar: {
        backgroundColor: Color.pink,
        paddingTop: 3,
        marginTop: -3
    },
    tabStyles: {
        fontWeight: 200
    },
    tagLabels: {
        margin: 3,
        cursor: 'pointer',
        color: Color.blue,
        float: 'left'
    },
    tagLabelsContainer: {
        textAlign: 'left',
        overflow: 'auto'
    },
    tagLabelsHeading: {
        marginLeft: '10px 0px 10px 0px',
        float: 'left',
        span: {
            fontSize: '.9em',
            float: 'left',
            marginLeft: -8,
            marginTop: 0
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
    toggleTagBtn: {
        color: Color.blue,
        marginTop: 24
    },
    wrapper:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingLeft: 5
    }
};

TagManager.propTypes = {
    drawerLoading: bool,
    openTagManager: bool,
    showTemplateDetails: bool,
    screenSize: object,
    entityObj: object,
    selectedEntity: object,
    toggleModal: object,
    tagAutoCompleteList: array,
    tagLabels: array,
    tagsToAdd: array,
};

export default TagManager;