import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Drawer from 'material-ui/Drawer'
import Subheader from 'material-ui/Subheader'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {Card, CardTitle, CardText} from 'material-ui/Card'
import {MuiTreeList} from 'react-treeview-mui'
import {TreeList} from 'react-treeview-mui'

class AccountTreeList extends Component {
	constructor(props) {
		super(props)
    const { listItems } = this.props;

    const files = listItems
    	.map((listItem, i) => {
    		if (!listItem.children) {
    			return i
    		} else {
    			return null
    		}
    	})
    	.filter((listItemIndex) => !!listItemIndex)

		const firstFile = files[0]

		const listItemIsEnabled = listItems.map((listItem, i) => {
			if (i >= 12) {
			return false
			} else {
			return true
			}
		})

		this.state = {
			expandedListItems: [],
			activeListItem: firstFile,
			listItemIsEnabled,
			listItems,
			searchTerm: '',
			isUsingMuiTheme: true
		}
		this.handleSearch = this.handleSearch.bind(this)
		this.handleTouchTap = this.handleTouchTap.bind(this)
		this.handleTouchTapInSearchMode = this.handleTouchTapInSearchMode.bind(this)
		this.moveToPrev = this.moveToPrev.bind(this)
		this.moveToNext = this.moveToNext.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}


	handleSearch(searchTerm) {
		this.setState({searchTerm})
	}

	handleTouchTap(listItem, index) {
		if (listItem.children) {
			const indexOfListItemInArray = this.state.expandedListItems.indexOf(index)
			if  (indexOfListItemInArray === -1) {
				this.setState({
					expandedListItems: this.state.expandedListItems.concat([index])
				})
			} else {
				let newArray = [].concat(this.state.expandedListItems)
				newArray.splice(indexOfListItemInArray, 1)
				this.setState({
					expandedListItems: newArray
				})
			}
		} else {
			this.setState({
				activeListItem: index
			})
		}
	}

	handleTouchTapInSearchMode(listItem, index) {
		if (!listItem.children) {
			const expandedListItems = getAllParents(listItem, listItems)

			this.setState({
				activeListItem: index,
				expandedListItems,
				searchTerm: ''
			})
		}
	}

	moveToPrev() {
		const index = files.indexOf(this.state.activeListItem)
		const nextActiveListItem = files[files.indexOf(this.state.activeListItem) - 1]
		if (index !== 0 && !this.state.listItems[nextActiveListItem].disabled) {
			this.setState({
				activeListItem: nextActiveListItem
			})
		}
	}

	moveToNext() {
		const index = files.indexOf(this.state.activeListItem)
		const nextActiveListItem = files[files.indexOf(this.state.activeListItem) + 1]
		if (index !== files.length - 1 && !this.state.listItems[nextActiveListItem].disabled) {
			this.setState({
				activeListItem: nextActiveListItem
			})
		}
	}

	handleChange(e, i, value) {
		this.setState({
			isUsingMuiTheme: value
		})
	}

	componentDidUpdate(prevProps, prevState) {
		const {activeListItem, listItems} = this.state
		if (activeListItem !== prevState.activeListItem) {
			const expandedListItems = getAllParents(listItems[activeListItem], listItems)
			this.setState({
				expandedListItems: expandedListItems
			})
		}
	}

  render() {
    const {listItems, listItemIsEnabled, expandedListItems, activeListItem, searchTerm} = this.state

	const icons = {
		leftIconCollapsed: <i style={{height: 16, width: 16, color: '#CCCCCC'}} className="fa fa-caret-right" />,
		leftIconExpanded: <i style={{height: 16, width: 16, color: '#CCCCCC'}} className="fa fa-caret-down" />
	}

	let treeListJSX = (
      <MuiTreeList
        listItems={listItems}
        contentKey={'title'}
        useFolderIcons={true}
        haveSearchbar={true}
        listItemIsEnabled={listItemIsEnabled}
        expandedListItems={expandedListItems}
        activeListItem={activeListItem}
        handleTouchTap={this.handleTouchTap}
        handleTouchTapInSearchMode={this.handleTouchTapInSearchMode}
        handleSearch={this.handleSearch}
        searchTerm={searchTerm}
        >
        <Subheader>Material UI Version</Subheader>
      </MuiTreeList>
		)

    return (
      <MuiThemeProvider>
        <Drawer
          open={true}
          width={400}
          zDepth={1}
          >
          {treeListJSX}
        </Drawer>
      </MuiThemeProvider>
    );
  }
}

export default AccountTreeList;

function getAllParents(listItem, listItems, parents=[]) {
	if (listItem.parentIndex) {
		return getAllParents(listItems[listItem.parentIndex], listItems, parents.concat([listItem.parentIndex]))
	} else {
		return parents
	}
}