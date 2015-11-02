import React from 'react';

class Footer extends React.Component {

    constructor(props, context) {
        super(props);

    }

    render() {
        return (
            <footer className="mdl-mini-footer" style={styles.color}>
                <div className="mdl-mini-footer__left-section">
                    <div className="mdl-logo">Duke Data Service</div>
                </div>
            </footer>
        );
    }
}
 var styles = {
         color: {
             backgroundColor: '#007aff'
         }
     };
export default Footer;
