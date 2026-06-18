// Calon AI — Legal documents (ES module)
// CALON AI SOLUTIONS LIMITED · Company No. 15984397 · Registered in Wales
// Registered office: Ty Merlin, Caerphilly Business Park, Van Road, Caerphilly, Wales, CF83 3GS

const COMPANY = 'Calon AI Solutions Limited';
const SHORT = 'Calon AI';
const NUMBER = '15984397';
const ADDRESS = 'Ty Merlin, Caerphilly Business Park, Van Road, Caerphilly, Wales, CF83 3GS';
const EMAIL = 'hello@calon.ai';
const EFFECTIVE = '18 June 2026';

export const DOCS = {
  privacy: {
    slug: 'privacy',
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    summary: 'How ' + COMPANY + ' collects, uses, stores and protects personal data, and the rights you have over it under UK data protection law.',
    sections: [
      { h: '1. Who we are', p: [
        COMPANY + ' ("' + SHORT + '", "we", "us" or "our") is a company registered in Wales under company number ' + NUMBER + ', with its registered office at ' + ADDRESS + '.',
        'We are the data controller responsible for the personal data we process about you. For any question about this policy or how we handle your data, contact us at ' + EMAIL + '.'
      ]},
      { h: '2. The data we collect', p: [
        'We collect only the data we need to respond to enquiries, deliver our services and run our business. Depending on how you interact with us, this may include:'
      ], list: [
        'Contact details — your name, business name, email address and telephone number, provided when you complete a form or contact us.',
        'Enquiry information — details you share about your business, the operational problems you are trying to solve and any context you provide.',
        'Project data — information processed in the course of building and operating the systems we deliver for you, under a separate agreement.',
        'Technical data — IP address, browser type and basic analytics about how our website is used.'
      ]},
      { h: '3. How we use your data', p: [
        'We process personal data on the following lawful bases under the UK GDPR:'
      ], list: [
        'Legitimate interests — to respond to your enquiry, provide our services and improve our offering, where this is not overridden by your rights.',
        'Contract — to perform a contract we have entered into with you, or to take steps at your request before entering into one.',
        'Consent — where you have agreed to receive specific communications from us. You may withdraw consent at any time.',
        'Legal obligation — where we are required to process data to comply with the law, including accounting and tax requirements.'
      ]},
      { h: '4. Sharing your data', p: [
        'We do not sell your personal data. We share it only where necessary to run our business or deliver our services, including with trusted service providers (for example hosting, email and accounting providers) who act on our instructions, and with authorities where we are legally required to do so.',
        'Where we use third-party processors, we put appropriate contractual safeguards in place and only share the minimum data required.'
      ]},
      { h: '5. International transfers', p: [
        'Some of our service providers may process data outside the UK. Where this happens, we ensure an adequate level of protection through approved safeguards such as UK adequacy regulations or International Data Transfer Agreements.'
      ]},
      { h: '6. How long we keep it', p: [
        'We keep personal data only for as long as necessary for the purpose it was collected, or as required by law. Enquiry data that does not become a project is typically deleted within 24 months. Project and financial records are retained in line with statutory accounting requirements.'
      ]},
      { h: '7. Your rights', p: [
        'Under UK data protection law you have the right to access your data, to have it corrected or erased, to restrict or object to its processing, and to data portability. To exercise any of these rights, email us at ' + EMAIL + '. You also have the right to lodge a complaint with the Information Commissioner\u2019s Office (ICO) at ico.org.uk.'
      ]},
      { h: '8. Security', p: [
        'We take appropriate technical and organisational measures to protect personal data against unauthorised access, loss or misuse. No system is completely secure, but we work to industry-standard practices and review our controls regularly.'
      ]},
      { h: '9. Changes to this policy', p: [
        'We may update this policy from time to time. The effective date at the top of this page reflects the most recent revision. Material changes will be communicated where appropriate.'
      ]}
    ]
  },

  terms: {
    slug: 'terms',
    label: 'Terms of Service',
    title: 'Terms of Service',
    summary: 'The terms governing your use of the ' + SHORT + ' website and the basis on which we provide information and services.',
    sections: [
      { h: '1. About these terms', p: [
        'These Terms of Service govern your use of the website operated by ' + COMPANY + ' (company number ' + NUMBER + ', registered office ' + ADDRESS + '). By using this website you accept these terms in full.',
        'Engagements for the delivery of software, automation or consultancy services are governed by a separate written agreement. These website terms do not form a contract for services.'
      ]},
      { h: '2. Use of the website', p: [
        'You may use this website for lawful purposes only. You agree not to use it in any way that breaches applicable law, infringes the rights of others, or interferes with its operation or security.'
      ]},
      { h: '3. Information on this site', p: [
        'The content on this website, including case studies, is provided for general information. Case study figures describe outcomes for specific clients in specific circumstances and are not a guarantee of results. We make reasonable efforts to keep information accurate but give no warranty that it is complete or current.'
      ]},
      { h: '4. Intellectual property', p: [
        'All content, branding, text, graphics and design on this website are owned by or licensed to ' + SHORT + ' and protected by intellectual property law. You may not reproduce, distribute or commercially exploit any part of it without our prior written consent.'
      ]},
      { h: '5. Enquiries and quotes', p: [
        'Submitting an enquiry does not create a contract or oblige either party to proceed. Any proposal, quote or scope we provide is subject to a formal written agreement before work begins, and remains an estimate until confirmed.'
      ]},
      { h: '6. Limitation of liability', p: [
        'To the fullest extent permitted by law, ' + SHORT + ' is not liable for any indirect or consequential loss, or any loss of profit, revenue or data, arising from your use of this website. Nothing in these terms excludes liability for death or personal injury caused by negligence, or for fraud, where it cannot lawfully be excluded.'
      ]},
      { h: '7. Third-party links', p: [
        'This website may contain links to third-party sites. We are not responsible for the content or practices of those sites and provide such links for convenience only.'
      ]},
      { h: '8. Governing law', p: [
        'These terms are governed by the laws of England and Wales, and any dispute will be subject to the exclusive jurisdiction of the courts of England and Wales.'
      ]},
      { h: '9. Contact', p: [
        'Questions about these terms can be sent to ' + EMAIL + '.'
      ]}
    ]
  },

  'acceptable-use': {
    slug: 'acceptable-use',
    label: 'Acceptable Use',
    title: 'Acceptable Use Policy',
    summary: 'The standards we expect when you use the ' + SHORT + ' website or any system or platform we deliver and operate for you.',
    sections: [
      { h: '1. Scope', p: [
        'This Acceptable Use Policy applies to your use of the ' + COMPANY + ' website and to any platform, automation or system we build, host or operate on your behalf. It sits alongside our Terms of Service and any service agreement between us.'
      ]},
      { h: '2. Prohibited activity', p: [
        'You must not use our website or any system we provide to:'
      ], list: [
        'Break any applicable law, regulation or third-party right.',
        'Upload, store or transmit unlawful, defamatory, harmful or malicious content.',
        'Introduce viruses, malware or any other harmful or disruptive code.',
        'Attempt to gain unauthorised access to any system, account, data or network.',
        'Probe, scan or test the vulnerability of any system without our written permission.',
        'Use the service to send unsolicited or unlawful communications.',
        'Misrepresent your identity or affiliation, or impersonate any person or organisation.'
      ]},
      { h: '3. Data and account responsibility', p: [
        'Where we provide access to a platform, you are responsible for keeping login credentials secure, for the activity carried out under your accounts, and for ensuring that anyone you authorise complies with this policy. You must tell us promptly of any suspected security breach or unauthorised use.'
      ]},
      { h: '4. Fair and intended use', p: [
        'Systems we deliver are provided for the business purpose agreed between us. You must not use them in a way that places unreasonable load on shared infrastructure, circumvents agreed usage limits, or is materially different from the intended purpose, without our prior agreement.'
      ]},
      { h: '5. Monitoring and enforcement', p: [
        'We do not routinely monitor content, but we reserve the right to investigate suspected breaches and to take appropriate action. This may include removing content, suspending access, or terminating the relevant service, in line with the applicable service agreement.'
      ]},
      { h: '6. Reporting misuse', p: [
        'If you become aware of any breach of this policy, or any misuse of a system we operate, please report it to us immediately at ' + EMAIL + '.'
      ]}
    ]
  }
};

export const ORDER = ['privacy', 'terms', 'acceptable-use'];
export const META = { COMPANY, SHORT, NUMBER, ADDRESS, EMAIL, EFFECTIVE };

export function getDoc(slug) {
  return DOCS[slug] || DOCS.privacy;
}
