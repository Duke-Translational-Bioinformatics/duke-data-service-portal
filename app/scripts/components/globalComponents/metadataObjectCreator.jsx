import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import EditTemplateModal from '../globalComponents/editTemplateModal.jsx';
import DeleteTemplateModal from '../globalComponents/deleteTemplateModal.jsx';
import MetadataTemplateProperties from '../globalComponents/metadataTemplateProperties.jsx';
import BaseUtils from '../../../util/baseUtils'
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import RaisedButton from 'material-ui/lib/raised-button';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import TextField from 'material-ui/lib/text-field';

class MetadataObjectCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorText: {},
            metaProps: []
        };
    }

    render() {
        function formatDate(date) {
            let d = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
            return d;
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
        let file = this.props.entityObj && this.props.entityObj !== null ? this.props.entityObj : null;
        let properties = this.props.templateProperties && this.props.templateProperties.length !== 0 ? this.props.templateProperties.map((obj)=>{
            let type = BaseUtils.getTemplatePropertyType(obj.type);
            return (
                <TableRow  key={obj.id}>
                    <TableRowColumn style={{padding: 0}}>{obj.key}</TableRowColumn>
                    <TableRowColumn style={{paddingLeft: 20}}>{type}</TableRowColumn>
                    <TableRowColumn style={{minWidth: 178, padding: 0}}>
                        {type !== 'date' ? <TextField
                            fullWidth={true}
                            id={obj.key}
                            title={type}
                            style={{minWidth: 178, marginTop: -20}}
                            underlineStyle={{display: 'none'}}
                            hintText={"Must be a "+type}
                            errorText={this.state.errorText && this.state.errorText.hasOwnProperty(obj.key) ? this.state.errorText[obj.key].text : ''}
                            floatingLabelText="Value"
                            floatingLabelStyle={{marginTop: 4}}
                            onBlur={this.addToPropertyList.bind(this, obj.key, type)}
                            onChange={this.handleInputValidation.bind(this)}
                            /> : <DatePicker hintText="Value" container="inline"
                                             id={obj.key}
                                             formatDate={formatDate}
                                             mode="portrait" onChange={(x, event) => this.addDateProperty(x, event, obj.key)}
                                             underlineStyle={{display: 'none'}} style={{marginBottom: -10}}/>}
                    </TableRowColumn>
                </TableRow>
            )
        }) : null;
        let height = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.height : window.innerHeight;
        let templateDesc = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.description : null;
        let templateId = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.id : null;
        let templateInfo = this.props.metadataTemplate && this.props.metadataTemplate !== null ? showTemplate(this.props.metadataTemplate) : null;
        let templateLabel = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.label : null;
        let templateName = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.name : null;
        let width = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.width : window.innerWidth;

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
                        {"Create a metadata object for "+file.name+" using the "+templateLabel+" template"}
                    </h5>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.detailsWrapper}>
                    {templateInfo}
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.btnWrapper}>
                    <h5 className="mdl-color-text--grey-600" style={styles.heading}>
                        Properties
                    </h5>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.listWrapper}>
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn style={{padding: 0}}>Key</TableHeaderColumn>
                                <TableHeaderColumn style={{paddingLeft: 20}}>Datatype</TableHeaderColumn>
                                <TableHeaderColumn style={{minWidth: 178, padding: 0}}>Value</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                                {properties}
                        </TableBody>
                    </Table>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.btnWrapper}>
                    <RaisedButton label={'Cancel'} secondary={true}
                                  labelStyle={{fontWeight: 100}}
                                  style={{margin: '12px 0px 12px 12px', float: 'right'}}
                                  onTouchTap={() => this.toggleTagManager()}/>
                    <RaisedButton label={'Apply'} secondary={true}
                                  labelStyle={{fontWeight: 100}}
                                  style={{margin: '12px 12px 12px 12px', float: 'right'}}
                                  onTouchTap={() => this.createMetadataObject(file, templateId)}/>
                </div>
            </div>
        )
    }

    addDateProperty(x, date, id) { // x is event which is always null. This is MUI behavior
        if(!BaseUtils.objectPropInArray(this.state.metaProps, 'key', id)) { //If not in array, add object
            this.state.metaProps.push({key: id, value: date});
        }
    }

    addToPropertyList(id, type) {
        if(document.getElementById(id).value !== '' && !BaseUtils.objectPropInArray(this.state.metaProps, 'key', id)) {
            let value = document.getElementById(id).value;
            this.state.metaProps.push({key: id, value: value});
        }
    }

    createMetadataObject(file, templateId) {
        let kind = file.kind;
        let fileId = file.id;
        let properties = this.state.metaProps;
        let errors = this.state.errorText;
        if(Object.keys(errors).length === 0 && errors.constructor === Object) {
            console.log(properties)
        }
    }

    deleteTemplateModal() {
        ProjectActions.toggleModals('dltTemplate');
    }

    editTemplateModal() {
        ProjectActions.toggleModals('editTemplate');
        setTimeout(()=>{
            document.getElementById('templateLabel').select();
        },350);
    }

    goBack() {
        ProjectActions.showMetadataTemplateList();
    }

    handleInputValidation(e) {
        let id = e.target.id;
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
        if(!pass && type === 'date') this.state.errorText[id] = {type: type, text: 'must be a valid date'};
        this.setState({ errorText: this.state.errorText});
        if(value === '') {
            let properties = this.state.metaProps;
            properties = properties.filter((obj) => {
                return obj.key !== id;
            });
            this.setState({metaProps: properties});
        }
    }

    toggleMetadataManager() {
        ProjectActions.toggleMetadataManager();
        this.setState({
            errorText: 'This field is required',
            errorText2: 'This field is required'
        });
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
    btn: {
        margin: '12px 0px 12px 12px',
        float: 'right'
    },
    btnWrapper: {
        marginBottom: -10,
        maxWidth: 670
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
    tableKey: {
        fontSize: 12,
        fontWeight: 200
    },
    tableValue: {
        fontSize: 16,
        marginLeft: 0,
        marginBottom: 10
    },
    title: {
        textAlign: 'left',
        marginBottom: 0
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
    metaTemplates: React.PropTypes.array,
    metadataTemplate: React.PropTypes.object,
    screenSize: React.PropTypes.object
};

export default MetadataObjectCreator;