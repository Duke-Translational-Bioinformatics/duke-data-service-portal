import React from 'react';

class Footer extends React.Component {

    constructor(props, context) {
        super(props);
    }

    render() {
        let envColor = "#fff";
        let appName = '';
        switch (DDS_PORTAL_CONFIG.environment) {
            case 'production':
                envColor = '#007aff';
                appName = '';
                break;
            case 'development':
                envColor = '#f44336';
                appName = 'DEVELOPMENT';
                break;
            case 'ua_test':
                envColor = '#4caf50';
                appName = 'UA TEST';
                break;
        }

        return (
            <footer className="mdl-mini-footer" style={{backgroundColor : envColor}}>
                <div className="mdl-mini-footer__left-section">
                    <div className="mdl-logo"><h6>Duke Data Service</h6><h5>{ appName }</h5></div>
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
