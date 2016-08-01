import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddCircle from 'material-ui/lib/svg-icons/content/add-circle';
import AutoComplete from 'material-ui/lib/auto-complete';
import Divider from 'material-ui/lib/divider';
import IconButton from 'material-ui/lib/icon-button';
import LeftNav from 'material-ui/lib/left-nav';
import Info from 'material-ui/lib/svg-icons/action/info';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import RaisedButton from 'material-ui/lib/raised-button';
import Tooltip from '../../../util/tooltip.js';

class TagManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: 'This field is required.',
            lastTag: null,
            timeout: null,
            tagsToAdd: [],
            value: null
        };
    }

    componentDidUpdate(prevState) {
    }

    render() {
        //let tags = this.props.objectTags.length > 0 ? this.props.objectTags.map((tag)=>{
        //    return (<div key={tag.id} className="chip">
        //        <span className="chip-text">{tag.label}</span>
        //        <span className="closebtn" onTouchTap={() => this.deleteTag(tag.id, tag.label)}>&times;</span>
        //    </div>)
        //}) : null;
        let tags = this.state.tagsToAdd.length > 0 ? this.state.tagsToAdd.map((tag)=>{
            return (<div key={Math.random()} className="chip">
                <span className="chip-text">{tag.label}</span>
                <span className="closebtn" onTouchTap={() => this.deleteTag(tag.id, tag.label)}>&times;</span>
            </div>)
        }) : null;
        let tagLabels = this.props.tagLabels.map((label)=>{
            return (
                <li key={label.label+Math.random()} style={styles.tagLabels} onTouchTap={() => this.addTagFromList(label.label)}>{label.label}
                    <span className="mdl-color-text--grey-600">,</span>
                </li>
            )
        });
        let name = this.props.entityObj ? this.props.entityObj.name : '';
        let autoCompleteData = this.props.tagAutoCompleteList && this.props.tagAutoCompleteList.length > 0 ? this.props.tagAutoCompleteList : [];
        let height = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.height : window.innerHeight;
        let width = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.width : window.innerWidth;
        return (
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <LeftNav disableSwipeToOpen={true} width={width > 640 ? width*.80 : width} openRight={true} open={this.props.openTagManager} style={styles.tagManager}>
                    <div className="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" >
                        <IconButton style={styles.toggleBtn}
                                    onTouchTap={() => this.toggleTagManager()}>
                            <NavigationClose />
                        </IconButton>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" >
                        <h5 className="mdl-color-text--grey-600" style={styles.heading}>Add Tags to {name}
                            <IconButton tooltip={<span>Tag your files with relevant keywords<br/> that can help with search and organization of content</span>}
                                        tooltipPosition="bottom-center"
                                        iconStyle={{ height: 20, width: 20}}
                                        style={styles.infoIcon}>
                                <Info color={'#BDBDBD'}/>
                            </IconButton>
                        </h5>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.autoCompleteContainer}>
                        <AutoComplete
                            id="tagText"
                            floatingLabelText="Type a Tag Label Here"
                            filter={AutoComplete.fuzzyFilter}
                            dataSource={autoCompleteData}
                            onNewRequest={(value) => this.addTagToCloud(value)}
                            onUpdateInput={this.handleUpdateInput.bind(this)}
                            underlineStyle={{borderColor: '#0680CD'}} />
                        <IconButton onTouchTap={() => this.addTagToCloud()} iconStyle={{width: 24, height: 24}} style={{marginLeft: 0, width: 24, height: 24, padding: 0}}>
                            <AddCircle color={'#235F9C'} />
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
                    <h6 style={styles.chipHeader}>Current Tags</h6>
                        <div className="chip-container" style={styles.chipContainer}>
                            { tags }
                        </div>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-400" style={styles.buttonWrapper}>
                        <RaisedButton label="Okay" secondary={true}
                                      labelStyle={{fontWeight: 100}}
                                      style={{margin: '12px 24px 12px 12px', float: 'right'}}
                                      onTouchTap={() => this.toggleTagManager()}/>
                    </div>
                </LeftNav>
            </div>
        )
    }

    addTagToCloud() {
        let id = this.props.params.id;
        if(document.getElementById("tagText").value !== '') {
            let label = document.getElementById("tagText").value;
            if(this.props.filesChecked.length < 1){
                ProjectActions.addNewTag(id, 'dds-file', label);
                setTimeout(() => {
                    // Todo: this is temporary. There's a bug in AutoComplete that makes the input repopulate with the old text.
                    // Todo: using timeout doesn't solve the problem reliably. For now using select() until we update to MUI v16
                    document.getElementById("tagText").select();
                }, 500)
            } else {
                this.state.tagsToAdd.push({label: label}); // Todo: Do this in store
            }
        }
    }

    addTagFromList(label) {
        let id = this.props.params.id;
        ProjectActions.addNewTag(id, 'dds-file', label);
        this.state.tagsToAdd.push({label: label});
        setTimeout(() => {
            // Todo: this is temporary. There's a bug in AutoComplete that makes the input repopulate with the old text.
            // Todo: using timeout doesn't solve the problem reliably. For now using select() until we update MUI@v0.16
            document.getElementById("tagText").select();
        }, 500)
    }

    deleteTag(id, label) {
        let fileId = this.props.params.id;
        let tags = this.state.tagsToAdd;
        tags = tags.filter(( obj ) => {
            return obj.label !== label;
        });
        this.setState({tagsToAdd: tags});
       // ProjectActions.deleteTag(id, label, fileId);
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
    };

    toggleTagManager() {
        ProjectActions.toggleTagManager();
    }
}

var styles = {
    autoCompleteContainer: {
        textAlign: 'center',
        clear: 'both',
        marginLeft: 15,
        marginBottom: 40
    },
    buttonWrapper: {
        textAlign: 'left',
        clear: 'both'
    },
    chipWrapper: {
        textAlign: 'left',
        clear: 'both'
    },
    chipContainer: {
        marginTop: 22
    },
    chipHeader: {
        margin: '10px  0px 10px 16px',
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
        color: '#0680CD',
        float: 'left'
    },
    tagLabelsContainer: {
        textAlign: 'left',
        clear: 'both',
        marginBottom: 40
    },
    tagLabelsHeading: {
        margin: '10px 0px 10px 16px',
        span: {
            fontSize: '.7em'
        }
    },
    tagLabelList: {
        listStyleType: 'none',
        padding: '5px 5px 25px 5px',
        marginTop: 0
    },
    tagManager: {
        marginTop: 80,
        paddingBottom: 90
    },
    toggleBtn: {
        margin: '92px 0px 5px 0px',
        zIndex: 9999
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