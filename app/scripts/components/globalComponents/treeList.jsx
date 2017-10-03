import React, { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import {Path} from '../../util/urlEnum';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import ProjectIcon from 'material-ui/svg-icons/content/content-paste.js';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import FileIcon from 'material-ui/svg-icons/action/description';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.string.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);

@observer
class TreeList extends Component {

		handleTouchTap(listItem) {
			mainStore.toggleTreeListItem(listItem);
			let path = this.pathFinder(listItem)
			if (!listItem.children[0] && path) {
				mainStore.getTreeListChildren(listItem, path);
			} else {
        this.buildTree(mainStore.treeListItemsCustom)
			}
		}
		
		pathFinder(listItem) {
			let itemKind = {
				'dds-project': Path.PROJECT,
				'dds-folder': Path.FOLDER
			}
			return (itemKind[listItem.itemKind])
		}
		
		iconPicker(listItem) {
			let itemKind = {
				'dds-project': <ProjectIcon />,
				'dds-folder': <FolderIcon />,
				'dds-file': <FileIcon />
			}
			return (itemKind[listItem.itemKind])
		}
		
		buildTree(listItems) {
			return (
				listItems.map((child) => {
					let grandChildren = []
					if (child.children && child.children.length > 0) {
						grandChildren = this.buildTree(child.children)
					}
					return (
						<ListItem
							key={child.id}
							value={child.id}
							primaryText={child.title}
							leftIcon={this.iconPicker(child)}
							nestedItems={grandChildren}
							open={child.open}
							onClick={() => {this.handleTouchTap(child)}}
						/>
					)
				})
			)
		}

  render() {
		const {treeListItemsCustom, treeListItemSelected} = mainStore;	
		// console.log('treeListItemsCustom', JSON.stringify(treeListItemsCustom, null, 2));
    return (
			<Drawer
				open={true}
				width={300}
				zDepth={1}
				containerStyle={{height: 'calc(100% - 76px)', top: 76}}
				>
				<SelectableList defaultValue={treeListItemSelected}>
					{this.buildTree(treeListItemsCustom)}
				</SelectableList>
			</Drawer>
    );
  }
}

export default TreeList;
