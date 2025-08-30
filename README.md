# Fraud Detection System

A comprehensive ML-powered fraud detection platform with three integrated models for customer risk assessment.

## Features

### 1. FraudDetectionModel
**ML-based fraud prediction for customer applications**
- Random Forest classification model
- Real-time fraud scoring (0-1 probability)
- 26 engineered features including document verification, financial indicators, and digital footprint
- Batch processing for CSV files
- Risk categorization: CRITICAL/HIGH/MEDIUM/LOW/MINIMAL

**Key Features:**
- Document quality assessment
- Financial risk scoring
- Employment verification analysis
- Biometric verification integration

### 2. MarketIntelligence
**Geographic risk analysis with AI integration**
- Pincode-based market intelligence
- Real-time AI insights for high-risk areas
- Statistical significance testing
- Known hotspot validation
- Priority scoring for risk areas

**Key Features:**
- Geographic fraud pattern detection
- AI-enhanced market insights
- Risk level classification
- Actionable alerts and recommendations

### 3. SimilarCustomerSearch
**Customer similarity analysis for risk assessment**
- Cosine similarity-based matching
- Multi-factor risk scoring
- Comparison against known fraud patterns
- Feature importance analysis
- Batch customer analysis

**Key Features:**
- Advanced similarity algorithms
- Automatic feature matching
- Risk categorization
- Detailed similarity reports

## CSV Input Format

The system expects CSV files with the following columns:

- customer_id
- city
- pincode
- document_quality_score
- document_consistency_score
- biometric_verification_score
- address_verification_result
- identity_match_score
- document_metadata_consistency
- income_verification_result
- income_profession_alignment
- banking_history_months
- financial_distress_indicators
- credit_score
- debt_to_income_ratio
- premium_to_income_ratio
- social_media_presence_score
- digital_footprint_consistency
- employment_verification_result
- professional_credential_validation
- digital_presence_age_months
- digital_reputation_score
- identity_verification_composite
- financial_risk_score
- digital_consistency_score
- identity_financial_mismatch
- is_fraud

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Login to the system
4. Upload CSV files for  processing
5. Follow the 3-step ML pipeline for comprehensive fraud analysis

## Technology Stack

- React 19
- Tailwind CSS
- Vite
- Lucide React Icons