AI Real Estate Intelligence
🚀 Project Overview
The primary objective of this project is to democratize real estate data by providing users with AI-powered valuation tools and transparent market analytics. It addresses the complexity of property investment by offering features like SHAP-based feature analysis (Explainable AI) and appreciation forecasting to help users understand why a property is valued at a certain price and what its future potential looks like.

🛠 Tech Stack
Frontend Framework: React 18.3.1 (with TypeScript)

Build Tool: Vite

Styling: Tailwind CSS for responsive and modern UI design

Icons: Lucide-React for consistent iconography

Backend/Database: Supabase integration for data management and authentication

Data Visualization: Custom React components for Line Charts, Bar Charts, and Score Gauges

Linting: ESLint and TypeScript-ESLint for code quality

💡 Key Features & Functionalities
The application is structured into several specialized modules:

Analytics Dashboard: Provides real-time market intelligence, including total listings, average market prices, and multi-city price trends for major hubs like Mumbai, Bangalore, and Hyderabad.

Price Prediction & Fair Value: Uses machine learning concepts to estimate property values and compare them against current market listings to identify "fair" deals.

Explainable AI (XAI): Features a SHAP-based analysis page that breaks down the contribution of various factors (like location, amenities, and age) to a property's predicted price.

Appreciation Forecast: Offers a 6-year investment projection with conservative, moderate, and optimistic scenarios.

Area Recommender: Scores different neighborhoods based on affordability, connectivity, safety, and amenities.

Interactive AI Chatbot: A built-in assistant that answers specific queries about ROI, city-specific trends, and investment advice.

📋 Market Data Coverage
The project includes curated mock data for major Indian cities:

Cities: Mumbai, Bangalore, Delhi, Hyderabad, Chennai, Pune, Kolkata, and Ahmedabad.

Localities: Specific tracking for high-growth areas like Bandra (Mumbai), Koramangala (Bangalore), and Jubilee Hills (Hyderabad).

Metrics: Average price per sqft, demand scores, and investment ratings.

🛠 Installation & Setup
To run this project locally, follow these steps:

Clone the repository:

Bash
git clone [repository-url]
cd Real_estate_intelligence
Install Dependencies:
Ensure you have Node.js installed, then run:

Bash
npm install
Environment Configuration:
The project is set up to use Supabase. You may need to configure your Supabase environment variables if you intend to use the live database features.

Run the Development Server:

Bash
npm run dev
The application will be available at http://localhost:5173.

Build for Production:

Bash
npm run build
Linting & Type Checking:

Bash
npm run lint
npm run typecheck