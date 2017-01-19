import React from 'react';
import { RouteHandler } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BaseUtils from '../../../util/baseUtils';
import Checkbox from 'material-ui/lib/checkbox';
import IconButton from 'material-ui/lib/icon-button';
import LeftNav from 'material-ui/lib/left-nav';
import RaisedButton from 'material-ui/lib/raised-button';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

class SearchFilters extends React.Component {

    componentDidUpdate(prevProps) {
        if(prevProps.searchResults !== this.props.searchResults){
            if(this.props.showFilters && (!this.props.searchResultsFiles.length && !this.props.searchResultsFolders.length || !this.props.searchResultsProjects.length)) this.toggleFilters();
        }
    }

    render() {
        let results = this.props.searchResults;
        let folders = this.props.searchResultsFolders;
        let files = this.props.searchResultsFiles;
        let includeKinds = this.props.includeKinds && this.props.includeKinds !== null ? this.props.includeKinds : [];
        let uniqueProjects = this.props.searchResultsProjects;
        let projectCount = results.reduce((sums,obj) => {
            sums[obj.ancestors[0].id] = (sums[obj.ancestors[0].id] || 0) + 1;
            return sums;
        },{});
        let projects = uniqueProjects.map((obj) => {
            let count = projectCount.hasOwnProperty(obj.id) ? projectCount[obj.id] : 0;
            return <span key={obj.id}>
                <ListItem primaryText={obj.name + " ("+count+")"}
                          leftCheckbox={<Checkbox style={styles.checkbox} checked={this.props.includeProjects.includes(obj.id)}/>}
                          style={{textAlign: 'right'}}
                          onClick={() => this.setIncludeProjects(obj.id)}/>
            </span>
        });


        return (
            <div>
                <LeftNav open={this.props.showFilters} width={this.props.showFilters ? 320 : null} zDepth={1}>
                    <div style={styles.spacer}></div>
                        <div style={styles.drawer}>
                            {projects.length ? <div className="mdl-cell mdl-cell--12-col" style={styles.button.wrapper}>
                                <p style={styles.listHeader}>Project</p>
                                <Divider style={styles.listDivider}/>
                                <List>
                                    {projects}
                                </List>
                            </div> : null}
                            {files.length || folders.length ? <div className="mdl-cell mdl-cell--12-col" style={styles.button.wrapper}>
                                <p style={styles.listHeader}>Type</p>
                                <Divider style={styles.listDivider}/>
                                <List>
                                    {files.length ? <ListItem primaryText={"Files ("+files.length+")"}
                                              leftCheckbox={<Checkbox style={styles.checkbox} checked={includeKinds.includes('dds-file')}/>}
                                              style={{textAlign: 'right'}} onClick={() => this.setIncludeKinds('dds-file')}/> : null}
                                    {folders.length ? <ListItem primaryText={"Folders ("+folders.length+")"}
                                              leftCheckbox={<Checkbox style={styles.checkbox} checked={includeKinds.includes('dds-folder')}/>}
                                              style={{textAlign: 'right'}} onClick={() => this.setIncludeKinds('dds-folder')}/> : null}
                                </List>
                            </div> : null}
                            {this.props.screenSize.width < 580 ? <div className="mdl-cell mdl-cell--12-col" style={styles.button.wrapper}>
                                <RaisedButton
                                    label="Hide Filters"
                                    labelStyle={styles.button.label}
                                    style={styles.button}
                                    secondary={true}
                                    onTouchTap={()=>this.toggleFilters()}/>
                            </div> : null}
                            {this.props.includeKinds.length || this.props.includeProjects.length ? <div className="mdl-cell mdl-cell--12-col" style={styles.button.wrapper}>
                                <RaisedButton
                                    label="Clear Filters"
                                    labelStyle={styles.button.label}
                                    style={styles.button}
                                    secondary={true}
                                    onTouchTap={()=>this.clearFilters()}/>
                            </div> : null}
                    </div>
                </LeftNav>
            </div>
        );
    }

    clearFilters() {
        let value = this.props.searchValue;
        ProjectActions.searchObjects(value, null);
        if(this.props.includeKinds.length) ProjectActions.setIncludedSearchKinds([]);
        if(this.props.includeProjects.length) ProjectActions.setIncludedSearchProjects([]);
        if(this.props.screenSize.width < 580) this.toggleFilters();
    }

    setIncludeKinds(id) {
        let includeKinds = BaseUtils.removeDuplicatesFromArray(this.props.includeKinds, id);
        ProjectActions.setIncludedSearchKinds(includeKinds);
    }

    setIncludeProjects(id) {
        let includeProjects = BaseUtils.removeDuplicatesFromArray(this.props.includeProjects, id);
        ProjectActions.setIncludedSearchProjects(includeProjects);
    }

    toggleFilters() {
        ProjectActions.toggleSearchFilters();
    }
}

const styles = {
    button: {
        minWidth: 270,
        label: {
            fontWeight: 100
        },
        wrapper: {
            textAlign: 'center'
        }
    },
    checkbox: {
        height: 0,
        width: 0
    },
    drawer: {
        display: 'flex',
        WebkitFlexDirection: 'column',
        flexDirection: 'column',
        WebkitAlignItems: 'center',
        alignItems: 'center',
        WebkitJustifyContent: 'center',
        justifyContent: 'center'
    },
    listDivider: {
        width: 270,
        marginLeft: 17
    },
    listHeader: {
        textAlign: 'left',
        marginLeft: 17,
        marginBottom: 8
    },
    spacer: {
        height: 76,
        marginBottom: 20
    }
};

SearchFilters.contextTypes = {
    muiTheme: React.PropTypes.object
};

SearchFilters.propTypes = {
    includeKinds: React.PropTypes.array,
    includeProjects: React.PropTypes.array,
    screenSize: React.PropTypes.object,
    searchResults: React.PropTypes.array,
    searchResultsFolders: React.PropTypes.array,
    searchResultsFiles: React.PropTypes.array,
    searchResultsProjects: React.PropTypes.array,
    searchValue: React.PropTypes.string,
    showFilters: React.PropTypes.bool
};

export default SearchFilters;