import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import SearchResults from '../components/globalComponents/searchResults.jsx';
import SearchFilters from '../components/globalComponents/searchFilters.jsx';

@observer
class Search extends React.Component {

    componentDidMount() {
        setTimeout(()=>{
            if(this.props.location.pathname === '/search' && !mainStore.showSearch) mainStore.toggleSearch();
        }, 500);
    }

    render() {
        return (
            <div>
                <SearchResults {...this.props} />
                <SearchFilters {...this.props} />
            </div>
        );
    }
}

export default Search;