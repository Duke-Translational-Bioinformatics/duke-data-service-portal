import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddCircle from 'material-ui/lib/svg-icons/content/add-circle';
import AutoComplete from 'material-ui/lib/auto-complete';
import IconButton from 'material-ui/lib/icon-button';
import LeftNav from 'material-ui/lib/left-nav';
import Help from 'material-ui/lib/svg-icons/action/help';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import RaisedButton from 'material-ui/lib/raised-button';

class TagManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: '',
            lastTag: null,
            timeout: null,
            searchText: '',
            tagsToAdd: []
        };
    }

    render() {
        let tags = this.state.tagsToAdd.length > 0 ? this.state.tagsToAdd.map((tag)=>{
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
        let name = this.props.entityObj && this.props.filesChecked < 1 ? this.props.entityObj.name : 'Selected Files';
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
                        <div className="mdl-cell mdl-cell--8-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" >
                            <h5 className="mdl-color-text--grey-600" style={styles.heading}>Add Tags to {name}
                                <IconButton tooltip={<span>Tag your files with relevant keywords<br/> that can help with search and organization of content</span>}
                                            tooltipPosition="bottom-center"
                                            iconStyle={{height: 20, width: 20}}
                                            style={styles.infoIcon}>
                                    <Help color={'#BDBDBD'}/>
                                </IconButton>
                            </h5>
                        </div>
                        <div className="mdl-cell mdl-cell--8-col mdl-color-text--grey-600" style={styles.autoCompleteContainer}>
                            <AutoComplete
                                ref={`autocomplete`}
                                fullWidth={true}
                                id="tagText"
                                style={{maxWidth: 'calc(100% - 5px)'}}
                                floatingLabelText="Type a Tag Label Here"
                                filter={AutoComplete.fuzzyFilter}
                                dataSource={autoCompleteData}
                                errorText={this.state.floatingErrorText}
                                onNewRequest={(value) => this.addTagToCloud(value)}
                                onUpdateInput={this.handleUpdateInput.bind(this)}
                                underlineStyle={styles.autoCompleteUnderline}/>
                            <IconButton onTouchTap={() => this.addTagToCloud(document.getElementById("tagText").value)}
                                        iconStyle={{width: 24, height: 24}}
                                        style={styles.addTagIconBtn}>
                                <AddCircle color={'#235F9C'}/>
                            </IconButton><br/>
                        </div>
                        <div className="mdl-cell mdl-cell--8-col mdl-color-text--grey-400" style={styles.tagLabelsContainer}>
                            <h6 style={styles.tagLabelsHeading}>Recently used tags <span style={styles.tagLabelsHeading.span}>(click on a tag to add it to {name})</span></h6>
                            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-400">
                                <ul style={styles.tagLabelList}>
                                    { tagLabels }
                                </ul>
                            </div>
                        </div>
                        <div className="mdl-cell mdl-cell--8-col mdl-color-text--grey-400" style={styles.chipWrapper}>
                            {this.state.tagsToAdd.length ? <h6 style={styles.chipHeader}>New Tags To Add</h6> : null}
                            <div className="chip-container" style={styles.chipContainer}>
                                { tags }
                            </div>
                        </div>
                        <div className="mdl-cell mdl-cell--8-col mdl-color-text--grey-400" style={styles.buttonWrapper}>
                            <RaisedButton label={'Cancel'} secondary={true}
                                          labelStyle={{fontWeight: 100}}
                                          style={{margin: '12px 24px 12px 12px', float: 'right'}}
                                          onTouchTap={() => this.toggleTagManager()}/>
                            <RaisedButton label={'Apply'} secondary={true}
                                          labelStyle={{fontWeight: 100}}
                                          style={{margin: '12px 12px 12px 12px', float: 'right'}}
                                          onTouchTap={() => this.addTagsToFiles()}/>
                        </div>
                    </div>
                </LeftNav>
            </div>
        )
    }

    addTagToCloud(label) {
        let id = this.props.params.id;
        let clearText = ()=> {
            this.refs[`autocomplete`].setState({searchText:''});
            this.refs[`autocomplete`].focus();
        };
        if(label && !label.indexOf(' ') <= 0) {
            if (this.state.tagsToAdd.some((el) => { return el.label === label.trim(); })) {
                this.setState({floatingErrorText: label + ' tag is already in the list'});
                setTimeout(()=>{
                    this.setState({floatingErrorText: ''});
                    clearText();
                }, 2000)
            } else {
                this.state.tagsToAdd.push({label: label.trim()});
                setTimeout(()=>{
                    clearText();
                }, 500);
                this.setState({tagsToAdd: this.state.tagsToAdd, floatingErrorText: ''})
            }
        }
    }

    addTagsToFiles() {
        let files = this.props.filesChecked;
        let id = this.props.params.id;
        let tags = this.state.tagsToAdd;
        if(!this.state.tagsToAdd.length) {
            this.setState({floatingErrorText: 'You must add tags to the list. Type a tag name and press enter.'});
        } else {
            if (this.props.filesChecked.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    ProjectActions.appendTags(files[i], 'dds-file', tags);
                }
            } else {
                ProjectActions.appendTags(id, 'dds-file', tags);
            }
            this.toggleTagManager();
            this.setState({floatingErrorText:''})
        }
    }

    deleteTag(id, label) {
        let fileId = this.props.params.id;
        let tags = this.state.tagsToAdd;
        tags = tags.filter(( obj ) => {
            return obj.label !== label;
        });
        this.setState({tagsToAdd: tags});
    }

    handleUpdateInput (text) {
        // Add 500ms lag to autocomplete so that it only makes a call after user is done typing
        let timeout = this.state.timeout;
        let textInput = document.getElementById('tagText');
        textInput.onkeyup = () => {
            clearTimeout(this.state.timeout);
            this.setState({
                timeout: setTimeout(() => {
                    if (!textInput.value.indexOf(' ') <= 0) {
                        ProjectActions.getTagAutoCompleteList(textInput.value);
                    }
                }, 500)
            })
        };
    }

    toggleTagManager() {
        ProjectActions.toggleTagManager();
        setTimeout(() => {
            if(document.getElementById("tagText").value !== '') this.refs[`autocomplete`].setState({searchText:''});
        }, 500);
        this.setState({tagsToAdd: []});
    }
}

var styles = {
    addTagIconBtn: {
        margin: '-30px 20px 0px 0px',
        float: 'right',
        width: 24,
        height: 24,
        padding: 0
    },
    autoCompleteContainer: {
        maxWidth: 'calc(100% - 42px)'
    },
    autoCompleteUnderline: {
        borderColor: '#0680CD',
        maxWidth: 'calc(100% - 42px)'
    },
    buttonWrapper: {
        textAlign: 'left'
    },
    chipWrapper: {
        textAlign: 'left'
    },
    chipContainer: {
        marginTop: 22
    },
    chipHeader: {
        margin: '10px 0px 10px 0px',
        paddingTop: 20
    },
    heading: {
        textAlign: 'center'
    },
    infoIcon: {
        verticalAlign: 8
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

TagManager.propTypes = {
    loading: bool,
    details: array,
    error: object
};

export default TagManager;