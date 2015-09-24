import React, { PropTypes } from 'react';
const { object } = PropTypes;
import MainActions from '../../actions/MainActions';

class Popup extends React.Component {

    componentDidMount() {
        new Framework7().popup('.popup');
        var $$ = Dom7;
        $$('.popup').on('close', function () {
            MainActions.setPopupCmp(null);
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