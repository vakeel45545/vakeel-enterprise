-- =============================================
-- SEED DATA FOR VAKEEL ENTERPRISE SaaS PLATFORM
-- =============================================

-- 1. site_settings (single row global config)
INSERT INTO public.site_settings (id, company_name, phone, email, logo, whatsapp, social_links, address, seo_defaults)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Vaakil.com',
  '+91 98765 43210',
  'support@vaakil.com',
  '/logo.svg',
  '+91 98765 43210',
  '{"twitter": "https://twitter.com/vaakil", "linkedin": "https://linkedin.com/company/vaakil", "instagram": "https://instagram.com/vaakil", "facebook": "https://facebook.com/vaakil", "youtube": "https://youtube.com/@vaakil"}',
  'Level 14, B Wing, Platinum Technopark, Sector 30A, Vashi, Navi Mumbai, Maharashtra 400703',
  '{"defaultTitle": "Vaakil — AI-Powered Legal & Compliance OS for India", "defaultDescription": "Register your company, file GST, get trademarks, and manage compliance with AI-powered platform. Trusted by 50,000+ businesses across India."}'
);

-- 2. services (10 realistic services)
INSERT INTO public.services (id, title, slug, hero_title, short_description, content, icon, image, meta_title, meta_description) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'GST Registration',
  'gst-registration',
  'GST Registration',
  'Get your GST number in 3-5 working days with our AI-powered filing system. 100% online, zero errors, expert-assisted process.',
  '{"overview": "Goods and Services Tax (GST) registration is mandatory for businesses with annual turnover exceeding ₹40 lakhs. Our AI-driven platform ensures error-free applications and fastest approvals.", "benefits": ["Legally sell goods and services across India", "Claim Input Tax Credit on purchases", "Build credibility with vendors and clients", "Access government tenders and contracts"], "documents": ["PAN Card of Business/Owner", "Aadhaar Card", "Business Address Proof", "Bank Account Statement", "Passport-size Photograph", "Digital Signature (for companies)"], "pricing": {"basic": 1499, "standard": 2999, "premium": 4999}}',
  'receipt',
  '/images/services/gst.jpg',
  'GST Registration Online — ₹1,499 | Vaakil.com',
  'Apply for GST registration online in India. Get GSTIN in 3-5 working days. Expert-assisted, AI-powered process. Trusted by 50,000+ businesses.'
),
(
  'b0000000-0000-0000-0000-000000000002',
  'Trademark Registration',
  'trademark-registration',
  'Trademark Registration',
  'Protect your brand identity with trademark registration. AI-powered search, filing, and monitoring in one seamless workflow.',
  '{"overview": "A registered trademark gives you exclusive rights to use your brand name, logo, or slogan across India. Our AI-powered trademark search engine scans 10M+ existing marks to ensure your application has the highest chance of approval.", "benefits": ["Legal protection against brand infringement", "Exclusive right to use the mark nationwide", "Build brand equity and trust", "Prevent competitors from copying your brand", "Eligible for ® symbol usage"], "documents": ["Brand Name / Logo to Register", "Applicant PAN & Aadhaar", "Address Proof", "Business Registration Certificate", "User Affidavit (if mark is in use)"], "pricing": {"basic": 5999, "standard": 9999, "premium": 14999}}',
  'shield',
  '/images/services/trademark.jpg',
  'Trademark Registration Online — ₹5,999 | Vaakil.com',
  'Register your trademark online in India. AI-powered search & filing. Protect your brand name, logo & slogan. Expert CA/CS assistance.'
),
(
  'b0000000-0000-0000-0000-000000000003',
  'Private Limited Company',
  'private-limited-company',
  'Private Limited Company Registration',
  'Incorporate your Pvt Ltd Company in 7-10 days. AI-verified documents, automated ROC filing, and dedicated incorporation manager.',
  '{"overview": "Private Limited Company is the most popular business structure for startups and growing businesses in India. It offers limited liability protection, easy fundraising, and credibility with clients and investors.", "benefits": ["Limited liability protection for shareholders", "Separate legal entity status", "Easy to raise funding from investors", "Perpetual existence independent of directors", "Enhanced credibility and brand trust"], "documents": ["Director PAN Cards", "Director Aadhaar Cards", "Passport-size Photographs", "Address Proof of Registered Office", "No Objection Certificate from Landlord", "Digital Signature Certificate (DSC)"], "pricing": {"basic": 6999, "standard": 12999, "premium": 19999}}',
  'building',
  '/images/services/pvt-ltd.jpg',
  'Private Limited Company Registration — ₹6,999 | Vaakil.com',
  'Register your Private Limited Company online. Complete incorporation in 7-10 days. Includes DSC, DIN, MOA, AOA & PAN/TAN.'
),
(
  'b0000000-0000-0000-0000-000000000004',
  'LLP Registration',
  'llp-registration',
  'LLP Registration',
  'Register your Limited Liability Partnership with zero complications. AI-driven compliance checks and expert DPIN filing.',
  '{"overview": "Limited Liability Partnership (LLP) combines the benefits of a partnership and a company. It provides limited liability to partners while offering flexibility in management and lower compliance costs.", "benefits": ["Limited liability for all partners", "Lower compliance costs than Pvt Ltd", "No minimum capital requirement", "Flexible internal management", "Separate legal entity"], "documents": ["Partner PAN Cards", "Partner Aadhaar Cards", "Passport-size Photographs", "Address Proof of Office", "Digital Signature Certificate (DSC)"], "pricing": {"basic": 5999, "standard": 9999, "premium": 14999}}',
  'users',
  '/images/services/llp.jpg',
  'LLP Registration Online — ₹5,999 | Vaakil.com',
  'Register your LLP online in India. Get DPIN, DSC & LLP Agreement. Expert-assisted process. Dedicated incorporation manager.'
),
(
  'b0000000-0000-0000-0000-000000000005',
  'MSME Registration',
  'msme-registration',
  'MSME / Udyam Registration',
  'Get your Udyam Registration Certificate instantly. Unlock government subsidies, priority lending, and tax benefits for your business.',
  '{"overview": "MSME/Udyam Registration is a government certification for Micro, Small, and Medium Enterprises. It unlocks exclusive benefits including priority sector lending, subsidies, and protection against delayed payments.", "benefits": ["Access to government subsidies and schemes", "Priority sector lending from banks", "Lower interest rates on loans", "Protection against delayed payments", "Concession in electricity bills", "Tax rebates and exemptions"], "documents": ["Aadhaar Card of Proprietor/Partners/Directors", "PAN Card of Business", "Business Address Proof", "Bank Account Details", "Business Activity Details"], "pricing": {"basic": 999, "standard": 1999, "premium": 3999}}',
  'award',
  '/images/services/msme.jpg',
  'MSME Udyam Registration Online — ₹999 | Vaakil.com',
  'Get MSME/Udyam Registration online. Instant certificate. Unlock government subsidies and priority lending. Expert assistance.'
),
(
  'b0000000-0000-0000-0000-000000000006',
  'FSSAI License',
  'fssai-license',
  'FSSAI Food License',
  'Get your FSSAI food license for manufacturing, storage, distribution or retail. AI-powered application with zero rejections.',
  '{"overview": "FSSAI License is mandatory for all food businesses in India including manufacturers, traders, restaurants, and cloud kitchens. The license ensures food safety and quality standards compliance.", "benefits": ["Legal authorization to operate food business", "Consumer trust and brand credibility", "Avoid heavy penalties and legal action", "Use FSSAI logo on packaging", "Access to larger market opportunities"], "documents": ["Photo ID of Applicant", "Business Registration Certificate", "Address Proof of Premises", "Food Safety Management Plan", "List of Food Products", "NOC from Municipality"], "pricing": {"basic": 2999, "standard": 5999, "premium": 9999}}',
  'utensils',
  '/images/services/fssai.jpg',
  'FSSAI License Online — ₹2,999 | Vaakil.com',
  'Apply for FSSAI food license online. Basic, State & Central license. Expert-guided process. Fast approval guaranteed.'
),
(
  'b0000000-0000-0000-0000-000000000007',
  'ISO Certification',
  'iso-certification',
  'ISO Certification',
  'Get ISO 9001, 14001, 27001, and other certifications. Enhance your business credibility with internationally recognized standards.',
  '{"overview": "ISO Certification demonstrates that your organization follows international quality, safety, and efficiency standards. It opens doors to international markets and enhances client confidence in your processes.", "benefits": ["International recognition and credibility", "Improved operational efficiency", "Access to global markets and tenders", "Enhanced customer confidence", "Competitive advantage in the market", "Standardized business processes"], "documents": ["Business Registration Certificate", "Company PAN Card", "Address Proof", "List of Directors/Partners", "Organization Chart", "Process Documentation"], "pricing": {"basic": 9999, "standard": 19999, "premium": 34999}}',
  'badge-check',
  '/images/services/iso.jpg',
  'ISO Certification Online — ₹9,999 | Vaakil.com',
  'Get ISO 9001, 14001, 27001 certification online. International quality standards. Expert-assisted process.'
),
(
  'b0000000-0000-0000-0000-000000000008',
  'Import Export Code',
  'import-export-code',
  'Import Export Code (IEC)',
  'Get your IEC code to start international trade. Mandatory registration for importing or exporting goods and services from India.',
  '{"overview": "Import Export Code (IEC) is a 10-digit code issued by DGFT (Directorate General of Foreign Trade). It is mandatory for any business that wants to import or export goods and services from India.", "benefits": ["Legal authorization for international trade", "Access to global markets", "Avail export incentives and subsidies", "No renewal required — lifetime validity", "Easy compliance with customs"], "documents": ["PAN Card of Business", "Aadhaar Card of Applicant", "Cancel Cheque / Bank Certificate", "Business Registration Certificate", "Address Proof of Office"], "pricing": {"basic": 1999, "standard": 3999, "premium": 6999}}',
  'globe',
  '/images/services/iec.jpg',
  'Import Export Code (IEC) Online — ₹1,999 | Vaakil.com',
  'Get IEC code online. Start importing/exporting from India. Lifetime validity. Expert-assisted DGFT filing.'
),
(
  'b0000000-0000-0000-0000-000000000009',
  'Startup India Registration',
  'startup-india-registration',
  'Startup India Registration',
  'Get DPIIT recognition under Startup India. Unlock tax exemptions, funding access, fast-track patents, and government tenders.',
  '{"overview": "Startup India Registration (DPIIT Recognition) provides official recognition to eligible startups, unlocking exclusive benefits including tax exemptions for 3 years, access to Fund of Funds, fast-track patent examination, and self-certification under labor and environmental laws.", "benefits": ["3-year income tax exemption (Section 80-IAC)", "Access to Fund of Funds for Startups", "Fast-track patent examination at 80% rebate", "Self-certification under labor & environment laws", "Priority in government procurement", "Easy winding up of company"], "documents": ["Certificate of Incorporation", "Company PAN Card", "Brief description of Innovation", "Recommendation/Support letter (optional)", "Patent/Trademark details (if any)"], "pricing": {"basic": 2999, "standard": 5999, "premium": 9999}}',
  'rocket',
  '/images/services/startup-india.jpg',
  'Startup India Registration — ₹2,999 | Vaakil.com',
  'Get DPIIT recognition under Startup India. Tax exemptions, funding access, fast-track patents. Expert-assisted process.'
),
(
  'b0000000-0000-0000-0000-000000000010',
  'Legal Notice Drafting',
  'legal-notice-drafting',
  'Legal Notice Drafting',
  'Get professionally drafted legal notices by experienced advocates. AI-assisted analysis with human expert review and dispatch.',
  '{"overview": "A legal notice is a formal communication sent to an individual or organization informing them of your intent to take legal action. Our team of experienced advocates, assisted by AI, drafts precise and legally sound notices.", "benefits": ["Professionally drafted by experienced advocates", "AI-powered legal analysis and precedent research", "Multiple dispatch options — email, registered post, courier", "Legally admissible and court-ready", "Quick turnaround in 24-48 hours"], "documents": ["Details of the dispute/issue", "Supporting documents and evidence", "Recipient details (name, address)", "Any previous correspondence", "Desired outcome/relief sought"], "pricing": {"basic": 1999, "standard": 4999, "premium": 9999}}',
  'file-text',
  '/images/services/legal-notice.jpg',
  'Legal Notice Drafting Online — ₹1,999 | Vaakil.com',
  'Get legal notices drafted by expert advocates. AI-assisted analysis. Quick 24-48 hour turnaround. Court-ready documents.'
);

-- 3. cities (8 major Indian cities)
INSERT INTO public.cities (id, city_name, slug, state) VALUES
('c0000000-0000-0000-0000-000000000001', 'Delhi', 'delhi', 'Delhi'),
('c0000000-0000-0000-0000-000000000002', 'Mumbai', 'mumbai', 'Maharashtra'),
('c0000000-0000-0000-0000-000000000003', 'Bangalore', 'bangalore', 'Karnataka'),
('c0000000-0000-0000-0000-000000000004', 'Pune', 'pune', 'Maharashtra'),
('c0000000-0000-0000-0000-000000000005', 'Hyderabad', 'hyderabad', 'Telangana'),
('c0000000-0000-0000-0000-000000000006', 'Chennai', 'chennai', 'Tamil Nadu'),
('c0000000-0000-0000-0000-000000000007', 'Kolkata', 'kolkata', 'West Bengal'),
('c0000000-0000-0000-0000-000000000008', 'Ahmedabad', 'ahmedabad', 'Gujarat');

-- 4. service_city_pages (selected high-value combinations for SEO)
INSERT INTO public.service_city_pages (service_id, city_id, meta_title, meta_description, hero_title, hero_content) VALUES
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'GST Registration in Delhi — ₹1,499 | Vaakil.com', 'Get GST registration in Delhi. Fast GSTIN approval in 3-5 days. Expert CA assistance. 100% online process.', 'GST Registration', 'Get your GST number in Delhi with our AI-powered filing system. Fastest approvals with zero documentation errors. Trusted by 10,000+ Delhi businesses.'),
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'GST Registration in Mumbai — ₹1,499 | Vaakil.com', 'Get GST registration in Mumbai. Fast GSTIN approval. Expert CA assistance for Maharashtra GST.', 'GST Registration', 'Register for GST in Mumbai seamlessly. Our Mumbai-based experts handle all Maharashtra state compliance requirements with AI-driven accuracy.'),
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'GST Registration in Bangalore — ₹1,499 | Vaakil.com', 'Get GST registration in Bangalore. Karnataka GSTIN in 3-5 days. Expert-assisted online process.', 'GST Registration', 'Quick GST registration for Bangalore startups and businesses. Karnataka-specific compliance handled by our expert team.'),
('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Trademark Registration in Delhi — ₹5,999 | Vaakil.com', 'Register your trademark in Delhi. AI-powered search. IP protection for Delhi-NCR businesses.', 'Trademark Registration', 'Protect your brand in Delhi-NCR with our AI-powered trademark registration. Comprehensive search across 10M+ existing marks.'),
('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Trademark Registration in Mumbai — ₹5,999 | Vaakil.com', 'Register your trademark in Mumbai. Complete IP protection. Expert-assisted filing.', 'Trademark Registration', 'Secure your brand identity in Mumbai with Vaakil. Our trademark experts handle the entire process from search to registration.'),
('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Private Limited Company in Delhi — ₹6,999 | Vaakil.com', 'Register Pvt Ltd Company in Delhi. Complete incorporation in 7 days. DSC, DIN, MOA/AOA included.', 'Private Limited Company Registration', 'Incorporate your Private Limited Company in Delhi with zero hassle. Our AI verifies all documents before ROC submission.'),
('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Private Limited Company in Bangalore — ₹6,999 | Vaakil.com', 'Register Pvt Ltd Company in Bangalore. Fast incorporation for Karnataka startups. Expert assistance.', 'Private Limited Company Registration', 'The startup capital of India deserves the best incorporation service. Register your Pvt Ltd in Bangalore with AI-powered accuracy.'),
('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', 'LLP Registration in Bangalore — ₹5,999 | Vaakil.com', 'Register your LLP in Bangalore. Fast DPIN & DSC processing. Expert-assisted filing for Karnataka.', 'LLP Registration', 'Register your LLP in Bangalore with complete compliance. Perfect for professional services firms and tech consultancies.'),
('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000004', 'MSME Registration in Pune — ₹999 | Vaakil.com', 'Get MSME/Udyam registration in Pune. Instant certificate. Government subsidies for Maharashtra businesses.', 'MSME Registration', 'Unlock MSME benefits for your Pune business. Instant Udyam certificate with access to government subsidies and priority lending.'),
('b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000006', 'FSSAI License in Chennai — ₹2,999 | Vaakil.com', 'Get FSSAI food license in Chennai. All categories covered. Expert-assisted Tamil Nadu compliance.', 'FSSAI Food License', 'Get your FSSAI license in Chennai for restaurants, cloud kitchens, and food manufacturing. Tamil Nadu-specific compliance handled.'),
('b0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000003', 'Startup India Registration in Bangalore — ₹2,999 | Vaakil.com', 'Get DPIIT recognition in Bangalore. Tax exemptions, funding access for Karnataka startups.', 'Startup India Registration', 'Bangalore is India''s startup hub. Get your DPIIT recognition and unlock tax exemptions, funding access, and fast-track patents.'),
('b0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002', 'Import Export Code in Mumbai — ₹1,999 | Vaakil.com', 'Get IEC code in Mumbai. Start international trade. Expert DGFT filing for Maharashtra businesses.', 'Import Export Code', 'Mumbai is India''s trade capital. Get your IEC code and start importing/exporting with our expert DGFT filing assistance.');

-- 5. blogs (5 realistic blog posts)
INSERT INTO public.blogs (id, title, slug, category, thumbnail, content, tags, meta_title, meta_description) VALUES
(
  'd0000000-0000-0000-0000-000000000001',
  'Complete Guide to GST Registration in India (2025)',
  'complete-guide-gst-registration-india-2025',
  'GST & Tax',
  '/images/blog/gst-guide.jpg',
  '<h2>What is GST Registration?</h2><p>Goods and Services Tax (GST) registration is the process by which a taxpayer gets registered under GST. Every business whose turnover exceeds ₹40 lakhs (₹20 lakhs for special category states) must register for GST.</p><h2>Who Needs GST Registration?</h2><ul><li>Businesses with annual turnover exceeding ₹40 lakhs</li><li>Inter-state suppliers of goods or services</li><li>E-commerce operators and sellers</li><li>Casual taxable persons</li><li>Non-resident taxable persons</li><li>Agents of suppliers and input service distributors</li></ul><h2>Documents Required</h2><p>The documents required depend on the type of business entity. Generally, you will need PAN card, Aadhaar card, business address proof, bank statement, and photographs.</p><h2>Step-by-Step Process</h2><ol><li>Visit the GST portal or use Vaakil.com''s AI-powered filing system</li><li>Fill in your business details and upload documents</li><li>Our AI verifies all documents for accuracy</li><li>Application is submitted to the GST department</li><li>Receive GSTIN within 3-5 working days</li></ol><h2>Common Mistakes to Avoid</h2><p>Many applications get rejected due to incorrect HSN codes, mismatched PAN details, or incomplete address proofs. Our AI-powered system catches these errors before submission, ensuring a 99.8% first-attempt approval rate.</p>',
  ARRAY['gst', 'registration', 'tax', 'compliance', 'india'],
  'Complete GST Registration Guide 2025 — Step-by-Step | Vaakil.com',
  'Learn everything about GST registration in India. Step-by-step guide, documents required, eligibility criteria, and expert tips for 2025.'
),
(
  'd0000000-0000-0000-0000-000000000002',
  'Trademark Registration: A Founder''s Complete Playbook',
  'trademark-registration-founders-playbook',
  'IP & Trademark',
  '/images/blog/trademark-guide.jpg',
  '<h2>Why Every Startup Needs a Trademark</h2><p>Your brand name is one of your most valuable assets. A registered trademark gives you legal exclusive rights to your brand name, logo, and tagline across India for 10 years (renewable indefinitely).</p><h2>Types of Trademarks You Can Register</h2><ul><li><strong>Word Mark</strong> — Protects the brand name itself</li><li><strong>Logo Mark</strong> — Protects the visual logo design</li><li><strong>Combined Mark</strong> — Protects name + logo together</li><li><strong>Sound Mark</strong> — Protects unique audio branding</li></ul><h2>The Registration Process</h2><ol><li><strong>Trademark Search:</strong> Check if your desired mark is available</li><li><strong>Filing Application:</strong> Submit Form TM-A with required documents</li><li><strong>Examination:</strong> Registry examines the application</li><li><strong>Publication:</strong> Mark is published in Trademark Journal</li><li><strong>Registration:</strong> Certificate issued if no opposition</li></ol><h2>Timeline & Costs</h2><p>The entire process typically takes 12-18 months. However, you get protection from the date of filing. Vaakil.com offers trademark registration starting at ₹5,999 with AI-powered search and expert filing.</p>',
  ARRAY['trademark', 'intellectual-property', 'branding', 'startup', 'legal'],
  'Trademark Registration Guide for Founders | Vaakil.com',
  'Complete guide to trademark registration in India. Types, process, timeline, costs, and expert tips for startup founders.'
),
(
  'd0000000-0000-0000-0000-000000000003',
  'Startup Compliance Checklist: 15 Must-Do Legal Tasks After Incorporation',
  'startup-compliance-checklist-after-incorporation',
  'Compliance',
  '/images/blog/compliance-checklist.jpg',
  '<h2>Post-Incorporation Compliance Essentials</h2><p>Congratulations on incorporating your company! But incorporation is just the beginning. Here are 15 critical compliance tasks every founder must complete to stay legally bulletproof.</p><h2>Immediate (Within 30 Days)</h2><ol><li><strong>Open a Current Account</strong> — Use your Certificate of Incorporation and MOA/AOA</li><li><strong>Apply for PAN & TAN</strong> — If not obtained during incorporation</li><li><strong>Register for GST</strong> — If applicable based on turnover or inter-state supply</li><li><strong>Get Professional Tax Registration</strong> — State-specific requirement</li></ol><h2>Within 60 Days</h2><ol start="5"><li><strong>Appoint Statutory Auditor</strong> — Mandatory for Pvt Ltd companies</li><li><strong>Issue Share Certificates</strong> — To all initial subscribers</li><li><strong>Open Statutory Registers</strong> — Register of Members, Directors, etc.</li></ol><h2>Ongoing Annual Compliance</h2><ol start="8"><li><strong>File Annual Returns (MGT-7)</strong></li><li><strong>File Financial Statements (AOC-4)</strong></li><li><strong>Conduct Board Meetings</strong> — Minimum 4 per year</li><li><strong>Conduct AGM</strong> — Within 6 months of financial year end</li><li><strong>File Income Tax Returns</strong></li><li><strong>GST Returns</strong> — Monthly/Quarterly filing</li><li><strong>TDS Returns</strong> — Quarterly filing</li><li><strong>DIR-3 KYC</strong> — Annual director KYC</li></ol>',
  ARRAY['compliance', 'startup', 'incorporation', 'checklist', 'legal'],
  'Startup Compliance Checklist — 15 Legal Tasks After Incorporation | Vaakil.com',
  'Essential compliance checklist for newly incorporated companies. 15 must-do legal tasks to keep your startup legally compliant.'
),
(
  'd0000000-0000-0000-0000-000000000004',
  'Private Limited vs LLP: Which Business Structure is Right for Your Startup?',
  'private-limited-vs-llp-comparison',
  'Startup & Registration',
  '/images/blog/pvt-vs-llp.jpg',
  '<h2>Choosing the Right Business Structure</h2><p>One of the most important decisions a founder makes is choosing the right business structure. The two most popular options for Indian startups are Private Limited Company and Limited Liability Partnership (LLP). Let''s compare them in detail.</p><h2>Key Differences</h2><table><tr><th>Feature</th><th>Private Limited</th><th>LLP</th></tr><tr><td>Legal Status</td><td>Company</td><td>Partnership</td></tr><tr><td>Min Members</td><td>2 Directors + 2 Shareholders</td><td>2 Partners</td></tr><tr><td>Liability</td><td>Limited to share capital</td><td>Limited to capital contribution</td></tr><tr><td>Compliance</td><td>Higher (ROC, AGM, Board Meetings)</td><td>Lower (only Annual Return + Statement)</td></tr><tr><td>Fundraising</td><td>Easy — can issue shares</td><td>Difficult — cannot issue shares</td></tr><tr><td>Taxation</td><td>25-30% corporate tax</td><td>30% flat rate</td></tr></table><h2>When to Choose Pvt Ltd</h2><ul><li>Planning to raise venture capital or angel investment</li><li>Want to issue ESOPs to employees</li><li>Building a high-growth, scalable business</li></ul><h2>When to Choose LLP</h2><ul><li>Professional services firm (CA, CS, Law)</li><li>Small business with limited compliance needs</li><li>No plans to raise external funding</li></ul>',
  ARRAY['private-limited', 'llp', 'comparison', 'business-structure', 'startup'],
  'Private Limited vs LLP — Complete Comparison Guide | Vaakil.com',
  'Detailed comparison between Private Limited Company and LLP. Which business structure is right for your startup? Pros, cons, costs, and expert advice.'
),
(
  'd0000000-0000-0000-0000-000000000005',
  'MSME Registration Benefits: Why Every Small Business Should Register',
  'msme-registration-benefits-guide',
  'Licenses',
  '/images/blog/msme-benefits.jpg',
  '<h2>Understanding MSME/Udyam Registration</h2><p>The Micro, Small, and Medium Enterprises (MSME) sector is the backbone of India''s economy, contributing over 30% to the GDP. The government has introduced numerous benefits for registered MSMEs under the Udyam Registration scheme.</p><h2>Top Benefits of MSME Registration</h2><ul><li><strong>Collateral-Free Loans</strong> — Banks provide loans up to ₹1 crore without collateral under CGTMSE scheme</li><li><strong>Lower Interest Rates</strong> — Enjoy 1-1.5% lower interest rates on business loans</li><li><strong>Government Tender Priority</strong> — 25% of procurement from government departments reserved for MSMEs</li><li><strong>Tax Benefits</strong> — MAT credit carry forward for 15 years</li><li><strong>Delayed Payment Protection</strong> — Buyers must pay within 45 days</li><li><strong>Electricity Bill Concession</strong> — Available in select states</li><li><strong>ISO Certification Reimbursement</strong> — Government bears the cost</li></ul><h2>Eligibility Criteria</h2><p>Any business entity — proprietorship, partnership, LLP, Pvt Ltd, or cooperative — can register as MSME if investment and turnover criteria are met.</p><h2>How to Register</h2><p>Registration is now entirely online through the Udyam Registration portal. Vaakil.com simplifies the process with AI-powered form filling and instant certificate generation.</p>',
  ARRAY['msme', 'udyam', 'small-business', 'government-benefits', 'registration'],
  'MSME Registration Benefits — Complete Guide | Vaakil.com',
  'Discover the top benefits of MSME/Udyam Registration. Collateral-free loans, tax benefits, government tender priority, and more.'
);

-- 6. faqs (realistic FAQs linked to services)
INSERT INTO public.faqs (question, answer, service_slug) VALUES
('What documents are required for GST registration?', 'For GST registration, you need: PAN Card, Aadhaar Card, Business Address Proof (electricity bill/rent agreement), Bank Account Statement or cancelled cheque, Passport-size Photographs, and Digital Signature Certificate (for companies/LLPs). Our AI system verifies all documents before submission to ensure zero rejections.', 'gst-registration'),
('How long does GST registration take?', 'With Vaakil.com, GST registration typically takes 3-5 working days. Our AI-powered system pre-validates all documents and information, resulting in a 99.8% first-attempt approval rate. In some cases, the officer may raise a query which adds 2-3 additional days.', 'gst-registration'),
('Is GST registration mandatory for startups?', 'GST registration is mandatory if your annual turnover exceeds ₹40 lakhs (₹20 lakhs for service providers in special category states). However, even if your turnover is below the threshold, voluntary registration is recommended if you deal with other GST-registered businesses or sell online.', 'gst-registration'),
('How long does trademark registration take?', 'The complete trademark registration process takes approximately 12-18 months. However, you receive a TM-A filing receipt immediately which gives you the right to use ™ symbol. The ® symbol can be used only after final registration. Our AI-powered search ensures maximum approval chances.', 'trademark-registration'),
('Can I register a trademark for my logo and name separately?', 'Yes, you can file separate applications for your brand name (word mark) and logo (device mark). We actually recommend this approach as it provides broader protection. A combined mark only protects the exact combination, while separate marks protect each element independently.', 'trademark-registration'),
('What is the difference between Pvt Ltd and LLP?', 'The key differences are: 1) Pvt Ltd can raise equity funding while LLP cannot issue shares, 2) Pvt Ltd has higher compliance requirements (board meetings, AGM, multiple filings), 3) LLP has lower annual compliance costs, 4) Both provide limited liability protection. Choose Pvt Ltd if you plan to raise investment.', 'private-limited-company'),
('How many directors are needed for a Private Limited Company?', 'A minimum of 2 directors and 2 shareholders are required. The directors and shareholders can be the same persons. At least one director must be a resident of India (stayed in India for 182+ days in the previous year). Maximum 15 directors are allowed (can be increased by special resolution).', 'private-limited-company'),
('What is the minimum capital required for LLP?', 'There is no minimum capital requirement for LLP registration in India. Partners can contribute any amount as capital. However, we recommend starting with at least ₹10,000 to ₹1,00,000 for practical purposes like opening a bank account and initial business operations.', 'llp-registration'),
('What are the benefits of MSME registration?', 'Key benefits include: collateral-free loans up to ₹1 crore, 1-1.5% lower interest rates, 25% government procurement reservation, delayed payment protection (45-day payment guarantee), electricity bill concessions, ISO certification reimbursement, and tax benefits including MAT credit carry forward.', 'msme-registration'),
('How to apply for FSSAI license online?', 'You can apply for FSSAI license through Vaakil.com in 3 simple steps: 1) Choose the right license type (Basic/State/Central) based on your turnover and business type, 2) Upload required documents through our AI-verified portal, 3) Our experts file the application and handle any queries from the food safety officer.', 'fssai-license'),
('What is ISO certification and who needs it?', 'ISO certification is an international standard that demonstrates your organization follows globally recognized quality, safety, and efficiency standards. Any business can get ISO certified — it is especially valuable for companies dealing with international clients, government contracts, or those wanting to improve operational efficiency.', 'iso-certification'),
('How to get Import Export Code?', 'IEC code can be obtained in 3-5 working days through Vaakil.com. You need PAN card, Aadhaar card, cancelled cheque, and business registration certificate. The IEC has lifetime validity and no renewal is required. It is mandatory for both importing and exporting goods/services from India.', 'import-export-code');

-- 7. testimonials (premium testimonials)
INSERT INTO public.testimonials (client_name, company, review, image, rating) VALUES
('Rahul Sharma', 'TechFlow AI', 'We registered our entire startup via Vaakil. The AI categorized our IP correctly, filed our LLP, and got our GST done in 8 days. The compliance dashboard saved us 40+ hours in legal admin. Pure magic.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=face', 5),
('Priya Desai', 'UrbanDwell', 'The compliance dashboard is incredible. I never have to worry about missing an ROC deadline. It acts like a silent co-founder watching over all our legal obligations. 100% compliance score maintained.', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80&auto=format&fit=crop&crop=face', 5),
('Vikram Singh', 'Nexus Logistics', 'Traditional CAs took weeks to respond. The experts on Vaakil platform resolve our queries in minutes. Their tech infrastructure is unmatched in India. We scaled to 5 cities smoothly with their help.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&auto=format&fit=crop&crop=face', 5),
('Ananya Kapoor', 'FreshBite Foods', 'Getting our FSSAI license through Vaakil was seamless. What usually takes 2 months was done in 3 weeks. The AI document checker caught errors I would have never noticed. Highly recommended for food businesses.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop&crop=face', 5),
('Arjun Mehta', 'CloudScale Technologies', 'As a serial entrepreneur, I have registered 4 companies through Vaakil. Their Private Limited incorporation is flawless. The whole process from DSC to incorporation certificate took just 6 days. Absolutely brilliant.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&auto=format&fit=crop&crop=face', 5),
('Sneha Reddy', 'PixelCraft Studios', 'Vaakil helped us trademark our brand across 3 classes. Their AI search tool found a potential conflict that we completely missed. Saved us from a costly rebranding exercise. Worth every penny.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop&crop=face', 5);

-- 8. navigation (dynamic navbar structure)
INSERT INTO public.navigation (id, title, slug, parent_id, featured, "order") VALUES
-- Top-level items
('e0000000-0000-0000-0000-000000000001', 'Startup & Registration', '/services/business-registration', NULL, true, 1),
('e0000000-0000-0000-0000-000000000002', 'GST & Tax', '/services/gst-taxation', NULL, true, 2),
('e0000000-0000-0000-0000-000000000003', 'IP & Trademark', '/services/trademark-ip', NULL, true, 3),
('e0000000-0000-0000-0000-000000000004', 'Licenses', '/services/licenses', NULL, true, 4),
('e0000000-0000-0000-0000-000000000005', 'Compliance', '/services/compliance', NULL, true, 5),
('e0000000-0000-0000-0000-000000000006', 'AI Assistant', '/ai', NULL, true, 6),
('e0000000-0000-0000-0000-000000000007', 'Resources & News', '/resources', NULL, false, 7),
('e0000000-0000-0000-0000-000000000008', 'Company', '/about', NULL, false, 8),
-- Children under "Startup & Registration"
('e0000000-0000-0000-0000-000000000011', 'Private Limited Company', '/services/private-limited-company', 'e0000000-0000-0000-0000-000000000001', false, 1),
('e0000000-0000-0000-0000-000000000012', 'LLP Registration', '/services/llp-registration', 'e0000000-0000-0000-0000-000000000001', false, 2),
('e0000000-0000-0000-0000-000000000013', 'Startup India Registration', '/services/startup-india-registration', 'e0000000-0000-0000-0000-000000000001', false, 3),
-- Children under "GST & Tax"
('e0000000-0000-0000-0000-000000000021', 'GST Registration', '/services/gst-registration', 'e0000000-0000-0000-0000-000000000002', false, 1),
-- Children under "IP & Trademark"
('e0000000-0000-0000-0000-000000000031', 'Trademark Registration', '/services/trademark-registration', 'e0000000-0000-0000-0000-000000000003', false, 1),
-- Children under "Licenses"
('e0000000-0000-0000-0000-000000000041', 'FSSAI License', '/services/fssai-license', 'e0000000-0000-0000-0000-000000000004', false, 1),
('e0000000-0000-0000-0000-000000000042', 'ISO Certification', '/services/iso-certification', 'e0000000-0000-0000-0000-000000000004', false, 2),
('e0000000-0000-0000-0000-000000000043', 'Import Export Code', '/services/import-export-code', 'e0000000-0000-0000-0000-000000000004', false, 3),
('e0000000-0000-0000-0000-000000000044', 'MSME Registration', '/services/msme-registration', 'e0000000-0000-0000-0000-000000000004', false, 4);
