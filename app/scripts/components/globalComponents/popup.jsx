import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import MainActions from '../../actions/mainActions';

class Popup extends React.Component {

    componentDidMount() {
        new Framework7().popup('.popup');
        var $$ = Dom7;
        $$('.popup').on('close', function () {
            AppActions.setPopupCmp(null);
        });
    }

    componentWillUnmount() {
        new Framework7().closePanel(); // just to be safe
    }

    closePopup() {
        new Framework7().closeModal('.popup')
    }

    render() {
        return (
            <span>
                {this.props.object}
            </span>
        );
    }

}

Popup.propTypes = {
    component: object.isRequired
};

export default Popup;