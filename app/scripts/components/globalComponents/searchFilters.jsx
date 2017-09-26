import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils';
import { Kind } from '../../util/urlEnum';
import { Color } from '../../theme/customTheme';
import Checkbox from 'material-ui/Checkbox';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import FontIcon from 'material-ui/FontIcon';

@observer
class SearchFilters extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projectListToggleIcon: true,
            tagListToggleIcon: true,
            kindListToggleIcon: true
        }
    }
    componentDidUpdate(prevProps) {
        // if(mainStore.showFilters && (!mainStore.searchResultsFiles.length && !mainStore.searchResultsFolders.length || !mainStore.searchResultsProjects.length)) this.toggleFilters();
    }

    render() {
        const { screenSize, searchFilters, searchResults, searchResultsFolders, searchResultsFiles, searchResultsProjects, searchResultsTags, searchValue, showFilters } = mainStore;

        let projects = searchResultsProjects.map((obj) => {
            const projectPostFilter = obj.key;
            let text = <span style={styles.checkbox.label}>{`${obj.key} `}<span style={styles.checkbox.count}>{` (${obj.doc_count})`}</span></span>;
            return <ListItem key={obj.key}
                        primaryText={text}
                        leftCheckbox={<Checkbox style={styles.checkbox} onCheck={() => mainStore.searchObjects(searchValue, null, projectPostFilter, null)}/>}
                        style={styles.listItem}
            />;
        });

        let tags = searchResultsTags.map((obj) => {
            const tagPostFilter = obj.key;
            let text = <span style={styles.checkbox.label}>{`${obj.key} `}<span style={styles.checkbox.count}>{` (${obj.doc_count})`}</span></span>;
            return <ListItem key={obj.key}
                    primaryText={text}
                    leftCheckbox={<Checkbox style={styles.checkbox} onCheck={() => mainStore.searchObjects(searchValue, null, null, tagPostFilter)}/>}
                    style={styles.listItem}/>
        });

        let kindFilter = projects.length ? <List style={styles.list}>
            <ListItem
                primaryText="Type"
                rightToggle={<FontIcon className="material-icons" style={{width: 24}}>{this.state.kindListToggleIcon ? 'remove' : 'add'}</FontIcon>}
                primaryTogglesNestedList={true}
                onNestedListToggle={() => this.toggleNestedList('kindListToggleIcon')}
                nestedItems={[
                    <ListItem key={BaseUtils.generateUniqueKey()}
                        primaryText={<span style={styles.checkbox.label}>Files</span>}
                        leftCheckbox={<Checkbox style={styles.checkbox} checked={searchFilters.includes(Kind.DDS_FILE)} onCheck={() => mainStore.searchObjects(searchValue, Kind.DDS_FILE, null, null)}/>}
                        style={styles.listItem}/>,
                    <ListItem key={BaseUtils.generateUniqueKey()}
                        primaryText={<span style={styles.checkbox.label}>Folders</span>}
                        leftCheckbox={<Checkbox style={styles.checkbox} checked={searchFilters.includes(Kind.DDS_FOLDER)} onCheck={() => mainStore.searchObjects(searchValue, Kind.DDS_FOLDER, null, null)}/>}
                        style={styles.listItem}/>
                ]}
                initiallyOpen={true}
                innerDivStyle={{paddingLeft: 4}}
                style={{ fontSize: 14, borderBottom: '1px solid' + Color.ltGrey2}}
                nestedListStyle={{marginLeft: -18}}/>
        </List> : null;

        return (
            <div>
                <Drawer open={showFilters} width={showFilters ? 270 : null} zDepth={1}>
                    <div style={styles.spacer}></div>
                        <div style={styles.drawer}>
                            {projects.length ? <div className="mdl-cell mdl-cell--12-col" style={styles.filterWrapper}>
                                {kindFilter}
                            </div> : null}
                            {projects.length ? <div className="mdl-cell mdl-cell--12-col" style={styles.filterWrapper}>
                                <List style={styles.list}>
                                    <ListItem
                                        primaryText="Projects"
                                        rightToggle={<FontIcon className="material-icons" style={{width: 24}}>{this.state.projectListToggleIcon ? 'remove' : 'add'}</FontIcon>}
                                        primaryTogglesNestedList={true}
                                        onNestedListToggle={() => this.toggleNestedList('projectListToggleIcon')}
                                        nestedItems={projects}
                                        initiallyOpen={true}
                                        innerDivStyle={{paddingLeft: 4}}
                                        style={{ fontSize: 14, borderBottom: '1px solid' + Color.ltGrey2}}
                                        nestedListStyle={{marginLeft: -18}}
                                    />
                                </List>
                            </div> : null}
                            {tags.length ? <div className="mdl-cell mdl-cell--12-col" style={styles.filterWrapper}>
                                <List style={styles.list}>
                                    <ListItem
                                        primaryText="Tags"
                                        rightToggle={<FontIcon className="material-icons" style={{width: 24}}>{this.state.tagListToggleIcon ? 'remove' : 'add'}</FontIcon>}
                                        primaryTogglesNestedList={true}
                                        onNestedListToggle={() => this.toggleNestedList('tagListToggleIcon')}
                                        nestedItems={tags}
                                        initiallyOpen={true}
                                        innerDivStyle={{paddingLeft: 4}}
                                        style={{ fontSize: 14, borderBottom: '1px solid' + Color.ltGrey2}}
                                        nestedListStyle={{marginLeft: -18}}
                                    />
                                </List>
                            </div> : null}
                            {/*{searchResultsFiles.length ? <ListItem primaryText={"Files ("+searchResultsFiles.length+")"}*/}
                                                                   {/*leftCheckbox={<Checkbox style={styles.checkbox} checked={includedKinds.includes('dds-file')}/>}*/}
                                                                   {/*style={{textAlign: 'right'}} onClick={() => this.setIncludeKinds('dds-file')}/> : null}*/}
                            {/*{searchResultsFolders.length ? <ListItem primaryText={"Folders ("+searchResultsFolders.length+")"}*/}
                                                                     {/*leftCheckbox={<Checkbox style={styles.checkbox} checked={includedKinds.includes('dds-folder')}/>}*/}
                                                                     {/*style={{textAlign: 'right'}} onClick={() => this.setIncludeKinds('dds-folder')}/> : null}*/}
                            {screenSize.width < 580 ? <div className="mdl-cell mdl-cell--12-col">
                                <RaisedButton
                                    label="Hide Filters"
                                    labelStyle={styles.button.label}
                                    style={styles.button}
                                    secondary={true}
                                    onTouchTap={() => this.toggleFilters()}/>
                            </div> : null}
                            {/*{includedKinds.length || includeProjects.length ? <div className="mdl-cell mdl-cell--12-col" style={styles.button.wrapper}>*/}
                                {/*<RaisedButton*/}
                                    {/*label="Clear Filters"*/}
                                    {/*labelStyle={styles.button.label}*/}
                                    {/*style={styles.button}*/}
                                    {/*secondary={true}*/}
                                    {/*onTouchTap={()=>this.clearFilters(searchValue)}/>*/}
                            {/*</div> : null}*/}
                    </div>
                </Drawer>
            </div>
        );
    }

    // clearFilters(searchValue) {
    //     mainStore.searchObjects(searchValue, null, null, null);
    //     if(mainStore.screenSize.width < 580) this.toggleFilters();
    // }

    toggleFilters() {
        mainStore.toggleSearchFilters();
    }

    toggleNestedList(element) {
        this.setState({ [element] : !this.state[element] })
    }
}

const styles = {
    button: {
        minWidth: 240,
        marginRight: 7,
        label: {
            fontWeight: 100
        }
    },
    checkbox: {
        height: 0,
        width: 0,
        left: 0,
        count: {
            color: Color.ltPink,
            fontSize: 14
        },
        label: {
            fontSize: 14,
            wordWrap: 'break-word'
        }
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
    filterWrapper: {
        margin: '0px 8px'
    },
    list: {
        padding: 0
    },
    listDivider: {
        width: 250
    },
    listHeader: {
        textAlign: 'left',
        marginBottom: 8
    },
    listItem: {
        textAlign: 'left',
        paddingLeft: 32
    },
    spacer: {
        height: 86
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