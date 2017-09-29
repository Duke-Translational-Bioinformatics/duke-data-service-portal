import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { observer } from 'mobx-react'
import authStore from '../../stores/authStore';
import mainStore from '../../stores/mainStore';
import {Path} from '../../util/urlEnum';
import Drawer from 'material-ui/Drawer'
import Subheader from 'material-ui/Subheader'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {Card, CardTitle, CardText} from 'material-ui/Card'
import {MuiTreeList} from 'react-treeview-mui'
import {TreeList} from 'react-treeview-mui'

@observer
class AccountTreeList extends Component {

	componentDidMount() {
			mainStore.getProjectsTreeListItems(null, null);
	}
	
	handleTouchTap(listItem, index) {
		let path
		if (listItem.itemKind == 'dds-project') {
			path = Path.PROJECT
		} else if (listItem.itemKind == 'dds-folder') {
			path = Path.FOLDER
		}
		if (!listItem.children[0] && path) {
			mainStore.getChildrenTreeListItems(listItem.id, path);
		}
	}

  render() {
    const {treeListItems} = mainStore;

		const icons = {
			leftIconCollapsed: <i style={{height: 16, width: 16, color: '#CCCCCC'}} className="fa fa-caret-right" />,
			leftIconExpanded: <i style={{height: 16, width: 16, color: '#CCCCCC'}} className="fa fa-caret-down" />
		}

    return (
      <MuiThemeProvider>
        <Drawer
          open={true}
          width={400}
          zDepth={1}
          containerStyle={{height: 'calc(100% - 76px)', top: 76}}
          >
					<MuiTreeList
						listItems={treeListItems.length ? treeListItems : []}
						contentKey={'title'}
						useFolderIcons={true}
						handleTouchTap={this.handleTouchTap}
						>
						<Subheader>User-Name-Here</Subheader>
					</MuiTreeList>
        </Drawer>
      </MuiThemeProvider>
    );
  }
}

export default AccountTreeList;
