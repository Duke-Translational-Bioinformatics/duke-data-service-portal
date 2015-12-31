import React from 'react';

class Footer extends React.Component {

    constructor(props, context) {
        super(props);

    }

    render() {
        if (DDS_PORTAL_CONFIG.environment === 'production'){
            var envColor = '#007aff';
            var appName = '';
        }
        if (DDS_PORTAL_CONFIG.environment === 'development'){
            envColor = '#f44336';
            appName = 'DEVELOPMENT';
        }
        if (DDS_PORTAL_CONFIG.environment === 'ua_test'){
            envColor = '#4caf50';
            appName = 'UA TEST';
        }

        return (
            <footer className="mdl-mini-footer" style={{backgroundColor : envColor}}>
                <div className="mdl-mini-footer__left-section">
                    <div className="mdl-logo"><h5>{ appName }</h5>Duke Data Service </div>
                </div>
            </footer>
        );
    }
}
 var styles = {//TODO: Remove for release
         color: {
             backgroundColor: '#007aff'
         }
     };
export default Footer;
