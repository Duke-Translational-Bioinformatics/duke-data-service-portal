import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import MetadataTemplateProperties from '../globalComponents/metadataTemplateProperties.jsx';
import BaseUtils from '../../../util/baseUtils'
import AddCircle from 'material-ui/lib/svg-icons/content/add-circle';
import IconButton from 'material-ui/lib/icon-button';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import TextField from 'material-ui/lib/text-field';

class MetadataPropertyManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorText: 'This field is required',
            errorText2: 'This field is required',
            errorText3: 'This field is required',
            errorText4: 'This field is required',
            value: null
        };
    }

    render() {
        let height = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.height : window.innerHeight;
        let templateCreator = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.audit.created_by.id : null;
        let templateDesc = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.description : null;
        let templateId = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.id : null;
        let templateLabel = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.label : null;
        let templateName = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.name : null;
        let width = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.width : window.innerWidth;

        return (
            <div className="mdl-grid" style={styles.wrapper}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-400" style={styles.backButtonWrapper}>
                    <a className="external mdl-color-text--grey-800"
                       onTouchTap={() => this.goBack()} style={styles.backButton}>
                        <i className="material-icons" style={styles.backBtnIcon}>keyboard_backspace</i>
                        Back
                    </a>
                    <h5 className="mdl-color-text--grey-600" style={styles.title}>Add Properties to {templateLabel}</h5>
                </div>
                <div className="mdl-cell mdl-cell--8-col mdl-cell--8-col-tablet">
                    <TextField
                            fullWidth={true}
                            id="propertyName"
                            autoFocus={true}
                            hintStyle={{fontSize: 12}}
                            hintText={width > 680 ? "Only alphanumerics and underscores (i.e. template_123_ABC)" : "Only alphanumerics and underscores"}
                            errorText={this.state.errorText}
                            floatingLabelText="Key"
                            style={{marginRight: 32}}
                            onChange={this.handleInputValidation.bind(this)}/>
                </div>
                <div className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
                    <SelectField value={this.state.value}
                                 fullWidth={true}
                                 id="selectRelation"
                                 onChange={this.handleSelectValueChange.bind(this, 'value')}
                                 floatingLabelText="Data Type"
                                 errorText={this.state.errorText4}
                                 errorStyle={{bottom: 20}}
                                 labelStyle={{paddingRight: 0, color: '#235F9C' }}
                                 style={styles.selectStyles}>
                        <MenuItem style={styles.menuItemStyle} value={0} primaryText='text'/>
                        <MenuItem style={styles.menuItemStyle} value={1} primaryText='number'/>
                        <MenuItem style={styles.menuItemStyle} value={2} primaryText='decimal'/>
                        <MenuItem style={styles.menuItemStyle} value={3} primaryText='date'/>
                        <MenuItem style={styles.menuItemStyle} value={4} primaryText='boolean'/>
                        <MenuItem style={styles.menuItemStyle} value={5} primaryText='binary'/>
                    </SelectField>
                </div>
                <div className="mdl-cell mdl-cell--12-col" style={styles.propTextField}>
                    <TextField
                            fullWidth={true}
                            id="propertyLabel"
                            hintText="A readable label for your template property"
                            errorText={this.state.errorText2}
                            floatingLabelText="Display Label"
                            onChange={this.handleInputValidation2.bind(this)}/>
                </div>
                <div className="mdl-cell mdl-cell--12-col" style={styles.descTextField}>
                    <TextField
                        fullWidth={true}
                        id="propertyDesc"
                        hintText="Verbose template property description"
                        errorText={this.state.errorText3}
                        onChange={this.handleInputValidation3.bind(this)}
                        floatingLabelText="Description"
                        multiLine={true}
                        rows={2}/>
                </div>
                <div className="mdl-cell mdl-cell--12-col" style={styles.btnWrapper}>
                    <h5 className="mdl-color-text--grey-600" style={styles.heading}>Properties</h5>
                    <RaisedButton label={'Create Property'} secondary={true}
                                  labelStyle={{fontWeight: 100}}
                                  style={styles.addPropBtn}
                                  onTouchTap={() => this.createProperty(templateId)}/>
                </div>
                <div className="mdl-cell mdl-cell--12-col" style={styles.listWrapper}>
                    <MetadataTemplateProperties {...this.props} />
                </div>
            </div>
        )
    }

    createProperty(id) {
        let label = document.getElementById('propertyLabel').value;
        let name = document.getElementById('propertyName').value.trim();
        let desc = document.getElementById('propertyDesc').value;
        let type = this.getSelectValue();
        if(!BaseUtils.validateTemplateName(name)) {
            this.setState({
                errorText: 'Invalid characters or spaces. Name must only consist of alphanumerics and underscores.'
            });
        } else {
            if (name !== '' && label !== '' && desc !== '' && type !== null) {
                ProjectActions. createMetadataProperty(id, name, label, desc, type);
                document.getElementById('propertyName').value = '';
                document.getElementById('propertyLabel').value = '';
                document.getElementById('propertyDesc').value = '';
                this.setState({
                    errorText: 'This field is required.',
                    errorText2: 'This field is required.',
                    errorText3: 'This field is required.',
                    errorText4: 'This field is required.',
                    value: null
                });
            }
        }
    }

    getSelectValue() {
        let type = null;
        switch(this.state.value){
            case 0:
                type = 'string';
                break;
            case 1:
                type = 'long';
                break;
            case 2:
                type = 'double';
                break;
            case 3:
                type = 'date';
                break;
            case 4:
                type = 'boolean';
                break;
            case 5:
                type = 'binary';
                break;
        }
        return type;
    }

    goBack() {
        ProjectActions.showMetaDataTemplateDetails();
    }

    handleInputValidation(e) {
        let name = e.target.value;
        if(BaseUtils.validateTemplateName(name)) {
            this.setState({
                errorText: e.target.value ? '' : 'This field is required.'
            });
        } else {
            this.setState({
                errorText: !BaseUtils.validateTemplateName(name) ? 'Invalid characters or spaces. Name must only' +
                ' consist of alphanumerics and underscores.' : 'This field is required.'
            });
        }
    }

    handleInputValidation2(e) {
        this.setState({
            errorText2: e.target.value ? '' : 'This field is required.'
        });
    }

    handleInputValidation3(e) {
        this.setState({
            errorText3: e.target.value ? '' : 'This field is required.'
        });
    }

    handleSelectValueChange(index, event, value) {
        this.setState({
            value: value,
            errorText4: ''
        });
    }
}

var styles = {
    addPropBtn: {
        margin: '12px -24px 12px 0px',
        float: 'right'
    },
    backButton: {
        float: 'left',
        cursor: 'pointer'
    },
    backButtonWrapper: {
        margin: '0px 16px 0px 0px'
    },
    backBtnIcon: {
        verticalAlign: -7,
        marginLeft: 5
    },
    btnWrapper: {
        float: 'left',
        margin: '0px 0px 0px -17px'
    },
    descTextField: {
        float: 'left',
        margin: '-10px 10px 0px 10px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    heading: {
        textAlign: 'left',
        float:'left',
        paddingLeft: 26
    },
    listWrapper: {
        float: 'left',
        margin: '-17px 10px 0px 10px'
    },
    menuItemStyle: {
        width: 213
    },
    propTextField: {
        float: 'left',
        margin: '0px 10px 0px 10px'
    },
    selectStyles: {
        maxWidth: 213,
        textAlign: 'left',
        color: '#757575'
    },
    title: {
        textAlign: 'center'
    },
    wrapper:{
        maxWidth: 700
    }
};

MetadataPropertyManager.contextTypes = {
    muiTheme: React.PropTypes.object
};

MetadataPropertyManager.propTypes = {
    loading: bool,
    error: object
};

export default MetadataPropertyManager;