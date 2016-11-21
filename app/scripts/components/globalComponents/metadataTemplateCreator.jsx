import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BaseUtils from '../../../util/baseUtils'
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

class MetadataTemplateCreator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorText: 'This field is required',
            errorText2: 'This field is required'
        };
    }

    render() {
        let width = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.width : window.innerWidth;
        return (
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.wrapper}>
                <div className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" >
                    <h5 className="mdl-color-text--grey-600" style={styles.heading}>Create a New Template</h5>
                </div>
                <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-600">
                    <TextField
                        fullWidth={true}
                        id="templateName"
                        autoFocus={true}
                        hintText={width > 680 ? "Only alphanumerics and underscores (i.e. template_123_ABC)" : "Only alphanumerics and underscores"}
                        errorText={this.state.errorText}
                        floatingLabelText="Name"
                        onChange={this.handleInputValidation.bind(this)}/>
                    <TextField
                        fullWidth={true}
                        id="templateLabel"
                        hintText="A readable label for your template"
                        errorText={this.state.errorText2}
                        floatingLabelText="Display Label"
                        onChange={this.handleInputValidation2.bind(this)}/>
                    <TextField
                        fullWidth={true}
                        id="templateDesc"
                        hintText="Verbose template description"
                        floatingLabelText="Description"
                        multiLine={true}
                        rows={3}/>
                </div>
                <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-400">
                    <RaisedButton label={'Cancel'} secondary={true}
                                  labelStyle={{fontWeight: 100}}
                                  style={styles.cancelBtn}
                                  onTouchTap={() => this.toggleMetadataManager()}/>
                    <RaisedButton label={'Create'} secondary={true}
                                  labelStyle={{fontWeight: 100}}
                                  style={styles.addBtn}
                                  onTouchTap={() => this.createTemplate()}/>
                </div>
            </div>
        )
    }

    createTemplate() {
        let name = document.getElementById('templateName').value.trim();
        let label = document.getElementById('templateLabel').value;
        let desc = document.getElementById('templateDesc').value;
        if(!BaseUtils.validateTemplateName(name)) {
            this.setState({
                errorText: 'Invalid characters or spaces. Name must only consist of alphanumerics and underscores.'
            });
        } else {
            if (name !== '' && label !== '') {
                ProjectActions. createMetadataTemplate(name, label, desc);
            }
        }
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

    toggleMetadataManager() {
        ProjectActions.toggleMetadataManager();
        this.setState({
            errorText: 'This field is required.',
            errorText2: 'This field is required.'
        });
    }
}

var styles = {
    addBtn: {
        margin: '12px 12px 12px 12px',
        float: 'right'
    },
    cancelBtn: {
        margin: '12px 0px 12px 12px',
        float: 'right'
    },
    heading: {
        textAlign: 'center'
    },
    wrapper:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingLeft: 5
    }
};

MetadataTemplateCreator.contextTypes = {
    muiTheme: React.PropTypes.object
};

MetadataTemplateCreator.propTypes = {
    screenSize: object
};

export default MetadataTemplateCreator;