import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';

@observer
class Footer extends React.Component {

    render() {
        let envColor = "#555";
        let appName = '';
        let { DDS_PORTAL_CONFIG } = window;
        let { loading } = mainStore;

        switch(DDS_PORTAL_CONFIG.environment){
            case 'production':
                envColor = Color.blue;
                appName = '';
                break;
            case 'development':
                envColor = Color.red;
                appName = ' - DEVELOPMENT';
                break;
            case 'ua_test':
                envColor = Color.green;
                appName = ' - UA TEST';
                break;
            default:
                break;
        }

        return (
            !loading && <footer style={{backgroundColor : envColor, padding: '10px 16px 10px 16px', position: 'relative'}}>
                <div>
                    <h6 style={styles.logo}>Duke Data Service {' ' + appName}</h6>
                </div>
                <div>
                    {window.innerWidth < 600 ? null : <span style={styles.phi}><b>The Health Insurance Portability and Accountability Act of 1996 (HIPAA)
                        established standards for health information that must be kept private and secure, called Protected Health Information
                        (PHI).</b><br/>The use of PHI within the Duke Data Service is prohibited in this Alpha release. By reading this, you
                        attest that you will not enter PHI. If you are unclear about what constitutes PHI, or are
                        uncertain about the nature of the data you use, contact the Duke University
                        IT Security Office (security@duke.edu) for further information.</span>}
                </div>
            </footer>
        );
    }
}

const styles = {
    themeColor: {
        backgroundColor: Color.blue
    },
    logo: {
        color: Color.white,
        margin: '8px 0px 4px 0px'
    },
    phi: {
        color: '#f9f9f9',
        fontSize: '.8em'
    }
};

export default Footer;