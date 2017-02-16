import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import SearchResults from '../components/globalComponents/searchResults.jsx';

class Results extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            includeKinds: ProjectStore.includeKinds,
            includeProjects: ProjectStore.includeProjects,
            screenSize: ProjectStore.screenSize,
            showFilters: ProjectStore.showFilters,
            showSearch: ProjectStore.showSearch,
            searchValue: ProjectStore.searchValue,
            searchResults: ProjectStore.searchResults,
            searchResultsFolders: ProjectStore.searchResultsFolders,
            searchResultsFiles: ProjectStore.searchResultsFiles,
            searchResultsProjects: ProjectStore.searchResultsProjects
        };
    }

    componentDidMount() {
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        setTimeout(()=>{
            if(this.props.location.pathname === '/results' && !this.state.showSearch) ProjectActions.toggleSearch();
        }, 500);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div>
                <SearchResults {...this.props} {...this.state}/>
            </div>
        );
    }
}

export default Results;