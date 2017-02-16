import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import MetadataTemplateProperties from '../globalComponents/metadataTemplateProperties.jsx';
import BaseUtils from '../../../util/baseUtils'
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

class MetadataPropertyManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorText: 'This field is required',
            errorText2: 'This field is required',
            errorText3: 'This field is required',
            errorText4: 'This field is required',
            nameText: '',
            labelText: '',
            descripText: '',
            value: null
        };
    }

    render() {
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
                            ref="propertyName"
                            value={this.state.nameText}
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
                    </SelectField>
                </div>
                <div className="mdl-cell mdl-cell--12-col" style={styles.propTextField}>
                    <TextField
                            fullWidth={true}
                            ref="propertyLabel"
                            value={this.state.labelText}
                            hintText="A readable label for your template property"
                            errorText={this.state.errorText2}
                            floatingLabelText="Display Label"
                            onChange={this.handleInputValidation2.bind(this)}/>
                </div>
                <div className="mdl-cell mdl-cell--12-col" style={styles.descTextField}>
                    <TextField
                        fullWidth={true}
                        ref="propertyDesc"
                        value={this.state.descripText}
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
        let label = this.refs.propertyLabel.getValue();
        let name = this.refs.propertyName.getValue();
        let desc = this.refs.propertyDesc.getValue();
        let type = this.getSelectValue();
        if(!BaseUtils.validateTemplateName(name)) {
            this.setState({
                errorText: 'Invalid characters or spaces. Name must only consist of alphanumerics and underscores.'
            });
        } else {
            if (name !== '' && label !== '' && desc !== '' && type !== null) {
                ProjectActions. createMetadataProperty(id, name, label, desc, type);
                this.setState({
                    errorText: 'This field is required.',
                    errorText2: 'This field is required.',
                    errorText3: 'This field is required.',
                    errorText4: 'This field is required.',
                    nameText: '',
                    labelText: '',
                    descripText: '',
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
        }
        return type;
    }

    goBack() {
        ProjectActions.showMetaDataTemplateDetails();
    }

    handleInputValidation(e) {
        let name = e.target.value;
        let errorText = '';
        if(name.length > 60){
            errorText = 'Property key can only be 60 characters maximum';
            this.setState({nameText: name.slice(0,-1)});
            this.setErrorText(errorText);
        } else {
            if (BaseUtils.validateTemplateName(name)) {
                errorText = e.target.value ? '' : 'This field is required';
                this.setErrorText(errorText);
            } else {
                errorText = !BaseUtils.validateTemplateName(name) ? 'Invalid characters or spaces. Name must only' +
                ' consist of alphanumerics and underscores.' : 'This field is required';
                this.setErrorText(errorText);
            }
            this.setState({nameText: name})
        }
    }

    handleInputValidation2(e) {
        this.setState({
            errorText2: e.target.value ? '' : 'This field is required',
            labelText: e.target.value
        });
    }

    handleInputValidation3(e) {
        this.setState({
            errorText3: e.target.value ? '' : 'This field is required',
            descripText: e.target.value
        });
    }

    handleSelectValueChange(index, event, value) {
        this.setState({
            value: value,
            errorText4: ''
        });
    }

    setErrorText(errorText) {
        this.setState({
            errorText: errorText
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
    metadataTemplate: React.PropTypes.object,
    screenSize: React.PropTypes.object
};

export default MetadataPropertyManager;