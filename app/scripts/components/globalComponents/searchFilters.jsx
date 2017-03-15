import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../../util/baseUtils';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

@observer
class SearchFilters extends React.Component {

    constructor(props) {
        super(props);
        this.setIncludeKinds = _.debounce(this.setIncludeKinds ,100);
        this.setIncludeProjects = _.debounce(this.setIncludeProjects ,100);
    }

    componentDidUpdate(prevProps) {
        if(mainStore.showFilters && (!mainStore.searchResultsFiles.length && !mainStore.searchResultsFolders.length || !mainStore.searchResultsProjects.length)) this.toggleFilters();
    }

    render() {
        const { includeKinds, includeProjects, screenSize, searchResults, searchResultsFolders, searchResultsFiles, searchResultsProjects, searchValue, showFilters } = mainStore;
        let includedKinds = includeKinds && includeKinds !== null ? includeKinds : [];
        let projectCount = searchResults.reduce((sums,obj) => {
            sums[obj.ancestors[0].id] = (sums[obj.ancestors[0].id] || 0) + 1;
            return sums;
        },{});
        let projects = searchResultsProjects.map((obj) => {
            let count = projectCount.hasOwnProperty(obj.id) ? projectCount[obj.id] : 0;
            return <span key={obj.id}>
                <ListItem primaryText={obj.name + " ("+count+")"}
                          leftCheckbox={<Checkbox style={styles.checkbox} checked={includeProjects.includes(obj.id)}/>}
                          style={{textAlign: 'right'}}
                          onClick={() => this.setIncludeProjects(obj.id)}/>
            </span>
        });


        return (
            <div>
                <Drawer open={showFilters} width={showFilters ? 320 : null} zDepth={1}>
                    <div style={styles.spacer}></div>
                        <div style={styles.drawer}>
                            {projects.length ? <div className="mdl-cell mdl-cell--12-col" style={styles.button.wrapper}>
                                <p style={styles.listHeader}>Project</p>
                                <Divider style={styles.listDivider}/>
                                <List>
                                    {projects}
                                </List>
                            </div> : null}
                            {searchResultsFiles.length || searchResultsFolders.length ? <div className="mdl-cell mdl-cell--12-col" style={styles.button.wrapper}>
                                <p style={styles.listHeader}>Type</p>
                                <Divider style={styles.listDivider}/>
                                <List>
                                    {searchResultsFiles.length ? <ListItem primaryText={"Files ("+searchResultsFiles.length+")"}
                                              leftCheckbox={<Checkbox style={styles.checkbox} checked={includedKinds.includes('dds-file')}/>}
                                              style={{textAlign: 'right'}} onClick={() => this.setIncludeKinds('dds-file')}/> : null}
                                    {searchResultsFolders.length ? <ListItem primaryText={"Folders ("+searchResultsFolders.length+")"}
                                              leftCheckbox={<Checkbox style={styles.checkbox} checked={includedKinds.includes('dds-folder')}/>}
                                              style={{textAlign: 'right'}} onClick={() => this.setIncludeKinds('dds-folder')}/> : null}
                                </List>
                            </div> : null}
                            {screenSize.width < 580 ? <div className="mdl-cell mdl-cell--12-col" style={styles.button.wrapper}>
                                <RaisedButton
                                    label="Hide Filters"
                                    labelStyle={styles.button.label}
                                    style={styles.button}
                                    secondary={true}
                                    onTouchTap={()=>this.toggleFilters()}/>
                            </div> : null}
                            {includedKinds.length || includeProjects.length ? <div className="mdl-cell mdl-cell--12-col" style={styles.button.wrapper}>
                                <RaisedButton
                                    label="Clear Filters"
                                    labelStyle={styles.button.label}
                                    style={styles.button}
                                    secondary={true}
                                    onTouchTap={()=>this.clearFilters(includedKinds, includeProjects, searchValue)}/>
                            </div> : null}
                    </div>
                </Drawer>
            </div>
        );
    }

    clearFilters(includedKinds, includeProjects, searchValue) {
        mainStore.searchObjects(searchValue, null);
        if(includedKinds.length) mainStore.setIncludedSearchKinds([]);
        if(includeProjects.length) mainStore.setIncludedSearchProjects([]);
        if(mainStore.screenSize.width < 580) this.toggleFilters();
    }

    setIncludeKinds(id) {
        let includeKinds = BaseUtils.removeDuplicatesFromArray(mainStore.includeKinds.slice(), id);
        mainStore.setIncludedSearchKinds(includeKinds);
    }

    setIncludeProjects(id) {
        let includeProjects = BaseUtils.removeDuplicatesFromArray(mainStore.includeProjects.slice(), id);
        mainStore.setIncludedSearchProjects(includeProjects);
    }

    toggleFilters() {
        mainStore.toggleSearchFilters();
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
    muiTheme: object
};

SearchFilters.propTypes = {
    includeKinds: array,
    includeProjects: array,
    screenSize: object,
    searchResults: array,
    searchResultsFolders: array,
    searchResultsFiles: array,
    searchResultsProjects: array,
    searchValue: string,
    showFilters: bool
};

export default SearchFilters;