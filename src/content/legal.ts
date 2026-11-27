/**
 * Legal pages: Privacy Policy, Terms of Service, Cookie Policy.
 *
 * DRAFT WORDING. Written to match how the software actually works (what it stores, which providers it
 * uses, how long data is kept), so the client's solicitor can correct it quickly. Replace it with the
 * solicitor's final text, fill in every [square-bracket] placeholder, then set `draft: false`.
 */

export const LEGAL = {
  /** true shows the "draft, pending legal review" note on every legal page. */
  draft: true,
  lastUpdated: '27 November 2026',
  company: '[Company legal name] trading as Property Pack AI',
  companyNumber: '[Company number]',
  registeredAddress: '[Registered office address]',
  contactEmail: '[privacy@yourdomain.co.uk]',
  icoNumber: '[ICO registration number]',
};

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export const PRIVACY: LegalSection[] = [
  {
    heading: '1. Who we are',
    paragraphs: [
      `Property Pack AI is provided by ${LEGAL.company} (company number ${LEGAL.companyNumber}), ${LEGAL.registeredAddress}. We are registered with the Information Commissioner's Office (ICO) under number ${LEGAL.icoNumber}.`,
      'For the accounts of estate agents and their teams, and for billing, we are the data controller. For the listings agencies create and the buyer enquiries they receive, the estate agency is the controller and we process that data on its behalf.',
    ],
  },
  {
    heading: '2. What we collect',
    bullets: [
      'Account details: your name, email address, phone number, professional licence number, short biography, and a one-way hash of your password (we never store the password itself).',
      'Agency details: agency name, logo, colours, contact details, registered address, redress scheme and anti-money-laundering registration numbers.',
      'Listings: property details and photos that agents enter, and the marketing copy produced from them.',
      'Buyer enquiries sent through a property page: name, email address, phone number, preferred viewing time, and the consent the buyer gives.',
      'Billing: your plan, invoices and payment status. Card details are entered directly into Stripe and never reach our servers.',
      'Security data: sign-in cookies, IP addresses used to limit abuse (for example repeated sign-in attempts), and a log of administrative actions.',
    ],
  },
  {
    heading: '3. How we use it, and our lawful basis',
    bullets: [
      'To provide the service you signed up for (performance of a contract): accounts, listings, marketing copy, PDFs, buyer pages, enquiries, billing.',
      'To keep the service secure and prevent fraud (legitimate interests).',
      'To keep financial records required by law (legal obligation): invoices and payment records.',
      "To pass a buyer's enquiry to the estate agency they asked to contact (the buyer's consent, given on the enquiry form).",
      'To send service emails: sign-in codes, password resets, team invitations, viewing confirmations (performance of a contract).',
    ],
  },
  {
    heading: '4. AI-generated marketing copy',
    paragraphs: [
      "When AI writing is switched on, the property details an agent enters (not buyers' personal data) are sent to Anthropic, our AI provider, to write the marketing copy. Each result is checked automatically against the agent's own details before it is saved, and the agent reviews it before using it.",
    ],
  },
  {
    heading: '5. Who we share data with',
    paragraphs: ['We use these providers (sub-processors) to run the service. Each processes data only on our instructions:'],
    bullets: [
      'Stripe: payments and invoices.',
      'Anthropic: AI marketing copy (property details only), when switched on.',
      'MongoDB Atlas: database hosting.',
      '[Hosting provider, for example the VPS provider]: application hosting.',
      'Vercel: hosting of the website.',
      '[Email provider]: sending service emails.',
      'Cloudflare: protection of the buyer enquiry form against spam bots, when switched on.',
    ],
  },
  {
    heading: '6. International transfers',
    paragraphs: [
      'Some of these providers process data outside the UK, including in the United States. Where they do, the transfer is protected by [the UK International Data Transfer Agreement / the UK Addendum to the EU Standard Contractual Clauses / the UK-US data bridge, as applicable].',
    ],
  },
  {
    heading: '7. How long we keep data',
    bullets: [
      'Account details: while the account is open. When you delete your account, your personal details are erased straight away.',
      "Buyer enquiries: the buyer's name, email and phone are removed automatically after the period the agency chooses (6, 12, 24, 36 months or 5 years; 24 months unless the agency changes it), or when the agency deletes the enquiry.",
      'Listings and photos: until the agency deletes them or closes its account.',
      'Invoices and payment records: 6 years, as UK tax law requires.',
      'Security logs: [period to be confirmed].',
    ],
  },
  {
    heading: '8. Your rights',
    paragraphs: ['Under UK GDPR you can:'],
    bullets: [
      'Get a copy of your data: Settings → Agent Profile → Download my data.',
      'Correct your details: Settings → Agent Profile.',
      'Have your data erased: Settings → Agent Profile → Delete my account. Agency owners can delete the whole agency in Settings → Regional Compliance.',
      'Object to or restrict some uses of your data, or ask for your data in a portable format.',
      `Contact us about any of these at ${LEGAL.contactEmail}. We reply within one month.`,
      'Complain to the Information Commissioner\'s Office: ico.org.uk, 0303 123 1113.',
    ],
  },
  {
    heading: '9. If you are a buyer',
    paragraphs: [
      'If you sent an enquiry through a property page, the estate agency you contacted controls your details. Contact them first; we will help them with your request.',
    ],
  },
  {
    heading: '10. Security',
    paragraphs: [
      "Data is encrypted in transit (HTTPS). Passwords are stored only as one-way hashes. Sign-in tokens are kept in cookies that the page's scripts cannot read. Each agency can see only its own data, and administrative actions are logged.",
    ],
  },
  {
    heading: '11. Changes and contact',
    paragraphs: [
      `We will post any change to this policy on this page and tell account holders about significant changes by email. Questions: ${LEGAL.contactEmail}, ${LEGAL.registeredAddress}.`,
    ],
  },
];

export const TERMS: LegalSection[] = [
  {
    heading: '1. About these terms',
    paragraphs: [
      `These terms apply to Property Pack AI, provided by ${LEGAL.company} (company number ${LEGAL.companyNumber}), ${LEGAL.registeredAddress}. By creating an account you agree to them on behalf of yourself and your agency. The service is for businesses (estate and letting agents), not consumers.`,
    ],
  },
  {
    heading: '2. The service',
    paragraphs: [
      'Property Pack AI turns the property details and photos you enter into marketing material: brochure copy, social posts, portal listings, video scripts, buyer FAQs, email replies, PDFs and shareable property pages, plus an indicative valuation based on comparable evidence you provide.',
      'Generated copy is a draft. It is written only from the details you enter, and anything you have not provided is marked "Not confirmed", but you must check it before you publish or send it. Valuations are indicative estimates to help prepare marketing; they are not RICS Red Book valuations and must not be relied on for lending, purchase or legal decisions.',
    ],
  },
  {
    heading: '3. Your account',
    bullets: [
      'Keep your password safe; you are responsible for what happens under your account.',
      'The agency owner controls billing and the team, and can add or remove members.',
      'We may suspend an account that is misused or put the service or other users at risk.',
    ],
  },
  {
    heading: '4. Plans, credits and payment',
    bullets: [
      'Monthly plans: Solo £59 (100 packs), Professional £99 (300 packs), Agency £249 (1,000 packs, up to 5 seats), Agency Pro £449 (high-volume allowance, unlimited seats). Pay-as-you-go: £15 for 1 pack, £39 for 3 packs. Prices are [inclusive / exclusive] of VAT.',
      'Each property pack uses one credit. Monthly packs are used first and do not roll over to the next month. Pay-as-you-go packs do not expire.',
      'Plans renew every month until cancelled. Payments are processed by Stripe.',
      'If you cancel, the plan stays active until the end of the period you have paid for; unused monthly packs then expire. Pay-as-you-go packs remain available.',
      'Refunds: [refund policy to be confirmed].',
    ],
  },
  {
    heading: '5. Your responsibilities',
    bullets: [
      'Only upload content you have the right to use, including photos and floor plans.',
      'Make sure published material is accurate and complies with the Consumer Protection from Unfair Trading Regulations 2008, the Digital Markets, Competition and Consumers Act 2024 and National Trading Standards material-information guidance.',
      'Use buyer enquiries only to deal with the buyer\'s request, and in line with data protection law.',
      'Do not try to access other agencies\' data, misuse the service, or interfere with its security.',
    ],
  },
  {
    heading: '6. Data protection',
    paragraphs: [
      'For listings and buyer enquiries we process personal data on your agency\'s behalf, as described in our Privacy Policy and our data processing terms [link or schedule to be provided].',
    ],
  },
  {
    heading: '7. Ownership',
    paragraphs: [
      'You keep ownership of the content you upload and the marketing material produced for your listings [to be confirmed]. We own the Property Pack AI software, design and brand.',
    ],
  },
  {
    heading: '8. Availability and changes',
    paragraphs: [
      'We aim to keep the service available at all times but do not guarantee it will be uninterrupted. We may improve or change features; we will give reasonable notice of changes that significantly affect you.',
    ],
  },
  {
    heading: '9. Liability',
    paragraphs: ['[Limitation of liability wording to be provided by the solicitor.]'],
  },
  {
    heading: '10. Ending the service',
    paragraphs: [
      'You can stop at any time: cancel your plan in Settings → Subscription & Billing, or delete your account or agency in Settings. We may end the service for an account that seriously or repeatedly breaks these terms.',
    ],
  },
  {
    heading: '11. Law',
    paragraphs: ['These terms are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.'],
  },
  {
    heading: '12. Contact',
    paragraphs: [`${LEGAL.contactEmail}, ${LEGAL.registeredAddress}.`],
  },
];
