import React from "react";

class DataProtectionPolicy extends React.Component {
    render () {
        return (
            <div>
                <div
                    style={{
                        width: '70%',
                        margin: '0 auto'
                    }}
                >
                    <img
                        src={require('../../../images/logo1.png')}
                        style={{
                            width: '250px',
                            height: 'auto',
                            marginLeft: 'calc(50% - 125px)',
                            marginBottom: '100px',
                            marginTop: '100px'
                        }}
                    />
                    <h1>Data Protection Policy</h1>
                    <h2>1. Data protection principles</h2>
                    <p>Garms (hereinafter referred to as the Company) is committed to processing data in accordance with its responsibilities under the GDPR.</p>
                    <p>Article 5 of the GDPR requires that personal data shall be:</p>
                    <ol>
                        <li>processed lawfully, fairly and in a transparent manner in relation to individuals;</li>
                        <li>collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes; further processing for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes shall not be considered to be incompatible with the initial purposes;</li>
                        <li>adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed;</li>
                        <li>accurate and, where necessary, kept up to date; every reasonable step must be taken to ensure that personal data that are inaccurate, having regard to the purposes for which they are processed, are erased or rectified without delay;</li>
                        <li>kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed; personal data may be stored for longer periods insofar as the personal data will be processed solely for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes subject to implementation of the appropriate technical and organisational measures required by the GDPR in order to safeguard the rights and freedoms of individuals; and</li>
                        <li>processed in a manner that ensures appropriate security of the personal data, including protection against unauthorised or unlawful processing and against accidental loss, destruction or damage, using appropriate technical or organisational measures.”</li>
                    </ol>

                    <h2>2. General provisions</h2>
                    <ol>
                        <li>This policy applies to all personal data processed by the Company.</li>
                        <li>The Responsible Person shall take responsibility for the Company ongoing compliance with this policy.</li>
                        <li>This policy shall be reviewed at least annually.</li>
                        <li>The Company shall register with the Information Commissioner’s Office as an organisation that processes personal data.</li>
                    </ol>

                    <h2>3. Lawful, fair and transparent processing </h2>
                    <ol>
                        <li>To ensure its processing of data is lawful, fair and transparent, the Company shall maintain a Register of Systems.</li>
                        <li>The Register of Systems shall be reviewed at least annually.</li>
                        <li>Individuals have the right to access their personal data and any such requests made to the Company shall be dealt with in a timely manner.</li>
                    </ol>

                    <h2>4. Lawful purposes</h2>
                    <ol>
                        <li>All data processed by the Company must be done on one of the following lawful bases: consent, contract, legal obligation, vital interests, public task or legitimate interests (<a href="https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/">see ICO guidance for more information</a>).</li>
                        <li>The Company shall note the appropriate lawful basis in the Register of Systems.</li>
                        <li>Where consent is relied upon as a lawful basis for processing data, evidence of opt-in  consent shall be kept with the personal data.</li>
                        <li>Where communications are sent to individuals based on their consent, the option for the individual to revoke their consent should be clearly available and systems should be in place to ensure such revocation is reflected accurately in the Company systems.</li>
                    </ol>

                    <h2>5. Data minimisation</h2>
                    <ol>
                        <li>The Company shall ensure that personal data are adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed.</li>
                        <li>[Add considerations relevant to the Company particular systems]</li>
                    </ol>

                    <h2>6. Accuracy</h2>
                    <ol>
                        <li>The Company shall take reasonable steps to ensure personal data is accurate.</li>
                        <li>Where necessary for the lawful basis on which data is processed, steps shall be put in place to ensure that personal data is kept up to date.</li>
                        <li>[Add considerations relevant to the Company particular systems]</li>
                    </ol>

                    <h2>7. Archiving / removal</h2>
                    <ol>
                        <li>To ensure that personal data is kept for no longer than necessary, the Company shall put in place an archiving policy for each area in which personal data is processed and review this process annually.</li>
                        <li>The archiving policy shall consider what data should/must be retained, for how long, and why.</li>
                    </ol>

                    <h2>8. Security</h2>
                    <ol>
                        <li>The Company shall ensure that personal data is stored securely using modern software that is kept-up-to-date.</li>
                        <li>Access to personal data shall be limited to personnel who need access and appropriate security should be in place to avoid unauthorised sharing of information.</li>
                        <li>When personal data is deleted this should be done safely such that the data is irrecoverable.</li>
                        <li>Appropriate back-up and disaster recovery solutions shall be in place.</li>
                    </ol>

                    <h2>9. Breach</h2>
                    <p>In the event of a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data, the Company shall promptly assess the risk to people’s rights and freedoms and if appropriate report this breach to the ICO (<a href="https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/personal-data-breaches/">more information on the ICO website</a>). </p>

                    <h2>10. Register of Systems</h2>
                    <ol>
                        <li>Amazon Web Services is the provider of server and database systems. Both servers and databases are using their fully managed services which also include back-up and recovery. Read more about AWS on their website: <a href="https://aws.amazon.com/">https://aws.amazon.com/</a>. On AWS Company will store user data required for functioning of the website, such as e-mail and name. User passwords are encrypted for security and users connect to website over an encrypted connection (HTTPS).</li>
                        <li>Google Analytics is the provider of interaction analytics system. Company sends anonymized interaction data to GA in order to help build a better product. Read more about Google Analytics on their website: <a href="https://marketingplatform.google.com/about/analytics/">https://marketingplatform.google.com/about/analytics/</a></li>
                    </ol>
                </div>
            </div>
        )
    }
}

export default DataProtectionPolicy;
