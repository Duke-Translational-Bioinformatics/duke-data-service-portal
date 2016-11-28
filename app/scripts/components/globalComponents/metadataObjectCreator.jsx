import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import MetadataTemplateProperties from '../globalComponents/metadataTemplateProperties.jsx';
import BaseUtils from '../../../util/baseUtils'
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import TextField from 'material-ui/lib/text-field';
import Theme from '../../theme/customTheme.js';

class MetadataObjectCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorText: {},
            metaProps: [],
            noValueWarning: false
        };
    }

    render() {

        function formatDate(date) {
            return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        }

        function showTemplate({id, name, label, description}) {
            return (
                <span id={id}>
                    <dl>
                        <dt className="mdl-color-text--grey-800" style={styles.tableKey}>Name</dt>
                        <dd className="mdl-color-text--grey-600" style={styles.tableValue}>{name}</dd>
                        <dt className="mdl-color-text--grey-800" style={styles.tableKey}>Display Label</dt>
                        <dd className="mdl-color-text--grey-600" style={styles.tableValue}>{label}</dd>
                        <dt className="mdl-color-text--grey-800" style={styles.tableKey}>Description</dt>
                        <dd className="mdl-color-text--grey-600" style={styles.tableValue}>{description}</dd>
                    </dl>
                </span>
            );
        }
        let currentUser = this.props.currentUser && this.props.currentUser !== null ? this.props.currentUser : null;
        let name = this.props.entityObj && this.props.filesChecked < 1 ? this.props.entityObj.name : 'selected files';
        let properties = this.props.templateProperties && this.props.templateProperties.length !== 0 ? this.props.templateProperties.map((obj)=>{
            let type = BaseUtils.getTemplatePropertyType(obj.type);
            return (
                <TableRow  key={obj.id}>
                    <TableRowColumn style={styles.tableHead1}>{obj.key}</TableRowColumn>
                    <TableRowColumn style={styles.tableHead2}>{type}</TableRowColumn>
                    <TableRowColumn style={styles.tableHead3}>
                        {type !== 'date' ? <TextField
                            fullWidth={true}
                            id={obj.key}
                            ref={obj.key}
                            title={type}
                            style={styles.textField}
                            underlineStyle={styles.textField.underline}
                            hintText={"Must be a "+type}
                            errorText={this.state.errorText && this.state.errorText.hasOwnProperty(obj.key) ? this.state.errorText[obj.key].text : ''}
                            floatingLabelText="Value"
                            floatingLabelStyle={styles.textField.floatingLabel}
                            onBlur={this.addToPropertyList.bind(this, obj.key, type)}
                            onChange={this.handleInputValidation.bind(this)}
                            /> : <DatePicker hintText="Value" container="inline"
                                             id={obj.key}
                                             formatDate={formatDate}
                                             mode="portrait" onChange={(x, event) => this.addDateProperty(x, event, obj.key)}
                                             underlineStyle={styles.datePicker.underline} style={styles.datePicker}/>}
                    </TableRowColumn>
                </TableRow>
            )
        }) : null;
        let showWarning = this.state.noValueWarning ? 'block' : 'none';
        let templateDesc = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.description : null;
        let templateId = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.id : null;
        let templateInfo = this.props.metadataTemplate && this.props.metadataTemplate !== null ? showTemplate(this.props.metadataTemplate) : null;
        let templateLabel = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.label : null;
        let templateName = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.name : null;

        return (
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.wrapper}>
                <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" style={styles.backButtonWrapper}>
                    <a className="external mdl-color-text--grey-800"
                       onTouchTap={() => this.goBack()} style={styles.backButton}>
                        <i className="material-icons" style={styles.backBtnIcon}>keyboard_backspace</i>
                        Back
                    </a>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" style={styles.headingWrapper}>
                    <h5 className="mdl-color-text--grey-600" style={styles.title}>
                        {"Create a metadata object for "+name+" using the "+templateLabel+" template"}
                    </h5>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.detailsWrapper}>
                    {templateInfo}
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.btnWrapper}>
                    {this.props.templateProperties && this.props.templateProperties.length ?
                    <h5 className="mdl-color-text--grey-600" style={styles.heading}>
                        Properties
                    </h5> :
                    <Paper className="mdl-cell mdl-cell--12-col"
                           style={styles.warningDiv}
                           zDepth={1}>
                        <span>You must add properties to this template before you can use it.
                        Go to the Annotations option in the main side menu at the top left of the screen to do this.
                    </span>
                    </Paper>
                        }
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.listWrapper}>
                    {this.props.templateProperties && this.props.templateProperties.length ? <Table selectable={false}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn style={styles.tableHead1}>Key</TableHeaderColumn>
                                <TableHeaderColumn style={styles.tableHead2}>Datatype</TableHeaderColumn>
                                <TableHeaderColumn style={styles.tableHead3}>Value</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                                {properties}
                        </TableBody>
                    </Table> : null}
                </div>
                <div className="mdl-cell mdl-cell--12-col" style={styles.btnWrapper}>
                    <Paper className="mdl-cell mdl-cell--12-col"
                           style={{backgroundColor: '#ef5350', color: '#EEEEEE', height: 40, marginBottom: 10, marginTop: 10, padding: 10, textAlign: 'center', display: showWarning}}
                           zDepth={1}>
                       <span>You must add at least one value</span>
                    </Paper>
                    <RaisedButton label={'Cancel'} secondary={true}
                                  labelStyle={styles.button.label}
                                  style={styles.button.cancel}
                                  onTouchTap={() => this.toggleTagManager()}/>
                    {this.props.templateProperties && this.props.templateProperties.length ?
                    <RaisedButton label={'Apply'} secondary={true}
                                  labelStyle={styles.button.label}
                                  style={styles.button.apply}
                                  onTouchTap={() => this.createMetadataObject(templateId)}/> : null}
                </div>
            </div>
        )
    }

    replacePropertyValue(metaProps, id, value) {
        metaProps = metaProps.filter(( obj ) => {
            return obj.key !== id;
        });
        metaProps.push({key: id, value: value});
        this.setState({metaProps: metaProps});
    }

    addDateProperty(x, date, id) { // x is event which is always null. This is MUI behavior
        let metaProps = this.state.metaProps;
        if(!BaseUtils.objectPropInArray(this.state.metaProps, 'key', id)) { //If not in array, add object
            metaProps.push({key: id, value: date});
            this.setState({metaProps: metaProps});
        } else {
            if(BaseUtils.objectPropInArray(this.state.metaProps, 'key', id)) { //If in array, value changed, replace obj
                this.replacePropertyValue(metaProps, id, date);
            }
        }
    }

    addToPropertyList(id) {
        let value = this.refs[id].getValue();
        let metaProps = this.state.metaProps;
        if(this.refs[id].getValue() !== '' && !BaseUtils.objectPropInArray(this.state.metaProps, 'key', id)) {
            metaProps.push({key: id, value: value});
            this.setState({metaProps: metaProps});
        } else {
            if(BaseUtils.objectPropInArray(this.state.metaProps, 'key', id)) {
                this.replacePropertyValue(metaProps, id, value);
            }
        }
    }

    createMetadataObject(templateId) {
        let kind = 'dds-file';
        let files = this.props.filesChecked;
        let fileId = this.props.params.id;
        let properties = this.state.metaProps;
        let errors = this.state.errorText;
        if(Object.keys(errors).length === 0 && errors.constructor === Object) {
            if(properties.length) {
                if (this.props.filesChecked.length > 0) {
                    for (let i = 0; i < files.length; i++) {
                        ProjectActions.createMetadataObject(kind, files[i], templateId, properties);
                        if(!!document.getElementById(files[i])) document.getElementById(files[i]).checked = false;
                    }
                } else {
                    ProjectActions.createMetadataObject(kind, fileId, templateId, properties);
                }
                this.toggleTagManager();
            } else {
                this.setState({noValueWarning:true});
            }
        }
    }

    goBack() {
        ProjectActions.showMetadataTemplateList();
    }

    handleInputValidation(e) {
        let id = e.target.id; // Using e.target.id here because MUI textfield doesn't support refs in the event
        let type = e.target.title;
        let value = e.target.value;
        let pass = value !== '' ? BaseUtils.validatePropertyDatatype(value, type) : true;
        if(pass || value === '') {
            if(this.state.errorText.hasOwnProperty(id)) {
                delete this.state.errorText[id];
            }
        }
        if(!pass && type === 'boolean') this.state.errorText[id] = {type: type, text: 'must be a true or false value'};
        if(!pass && type === 'number') this.state.errorText[id] = {type: type, text: 'must contain only numbers'};
        if(!pass && type === 'decimal') this.state.errorText[id] = {type: type, text: 'must contain a decimal point'};
        if(!pass && type === 'text') this.state.errorText[id] = {type: type, text: 'must contain text'};
        this.setState({ errorText: this.state.errorText, noValueWarning: false});
        if(value === '') { // If value is deleted then remove property from metaProps
            let properties = this.state.metaProps;
            properties = properties.filter((obj) => {
                return obj.key !== id;
            });
            this.setState({metaProps: properties});
        }
    }

    toggleTagManager() {
        ProjectActions.toggleTagManager();
        if(this.props.showTemplateDetails) ProjectActions.showMetadataTemplateList();
        this.setState({tagsToAdd: [], metaProps: []});
    }
}

var styles = {
    backButton: {
        float: 'left',
        cursor: 'pointer'
    },
    backButtonWrapper: {
        margin: '10px 16px 0px 0px'
    },
    backBtnIcon: {
        verticalAlign: -7,
        marginLeft: 5
    },
    button: {
        apply: {
            margin: '12px 12px 12px 12px',
            float: 'right'
        },
        cancel: {
            margin: '12px 0px 12px 12px',
            float: 'right'
        },
        label: {
            fontWeight: 100
        }
    },
    btnWrapper: {
        marginBottom: -10,
        maxWidth: 670
    },
    datePicker: {
        marginBottom: -10,
        underline: {
            display: 'none'
        }
    },
    detailsWrapper: {
        maxWidth: 670,
        margin: 0
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    heading: {
        textAlign: 'left',
        float: 'left',
        marginTop: 0,
        marginBottom: 4
    },
    headingWrapper: {
        maxWidth: 670,
        margin: 0
    },
    listHeader: {
        float: 'right',
        paddingLeft: 60
    },
    listWrapper: {
        maxWidth: 670
    },
    tableHead1: {
        padding: 0
    },
    tableHead2: {
        paddingLeft: 20
    },
    tableHead3: {
        minWidth: 178,
        padding: 0
    },
    tableKey: {
        fontSize: 12,
        fontWeight: 200
    },
    tableValue: {
        fontSize: 16,
        marginLeft: 0,
        marginBottom: 10
    },
    textField: {
        minWidth: 178,
        marginTop: -20,
        floatingLabel: {
            marginTop: 4
        },
        underline: {
            display: 'none'
        }
    },
    title: {
        textAlign: 'left',
        marginBottom: 0
    },
    warningDiv: {
        backgroundColor: '#ef5350',
        color: '#EEEEEE',
        padding: 10,
        textAlign: 'left'
    },
    wrapper:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingLeft: 5
    }
};

MetadataObjectCreator.contextTypes = {
    muiTheme: React.PropTypes.object
};

MetadataObjectCreator.propTypes = {
    currentUser: React.PropTypes.object,
    entityObj: React.PropTypes.object,
    filesChecked: React.PropTypes.array,
    metaTemplates: React.PropTypes.array,
    metadataTemplate: React.PropTypes.object
};

export default MetadataObjectCreator;