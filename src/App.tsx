import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import PredictionPage from './pages/PredictionPage';
import ExplainableAIPage from './pages/ExplainableAIPage';
import FairPricePage from './pages/FairPricePage';
import AppreciationPage from './pages/AppreciationPage';
import AreaRecommendationPage from './pages/AreaRecommendationPage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import { Page } from './types';

const pageConfig: Record<Page, { title: string; subtitle: string }> = {
  home: { title: 'AI Real Estate Intelligence', subtitle: 'Powered by advanced machine learning' },
  prediction: { title: 'Price Prediction', subtitle: 'AI-powered property valuation' },
  'explainable-ai': { title: 'Explainable AI', subtitle: 'SHAP-based feature analysis' },
  'fair-price': { title: 'Fair Price Analyzer', subtitle: 'Compare market vs AI prediction' },
  appreciation: { title: 'Appreciation Forecast', subtitle: '6-year investment projection' },
  'area-recommendation': { title: 'Area Recommender', subtitle: 'Find your perfect neighborhood' },
  map: { title: 'Property Map', subtitle: 'Interactive real estate heatmap' },
  dashboard: { title: 'Analytics Dashboard', subtitle: 'Live market intelligence' },
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const config = pageConfig[currentPage];

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onCollapsedChange={setSidebarCollapsed}
      />

      <div
        className="min-h-screen flex flex-col transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '80px' : '256px' }}
      >
        {currentPage !== 'home' && (
          <Header title={config.title} subtitle={config.subtitle} />
        )}

        <main className="flex-1">
          {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
          {currentPage === 'prediction' && <PredictionPage />}
          {currentPage === 'explainable-ai' && <ExplainableAIPage />}
          {currentPage === 'fair-price' && <FairPricePage />}
          {currentPage === 'appreciation' && <AppreciationPage />}
          {currentPage === 'area-recommendation' && <AreaRecommendationPage />}
          {currentPage === 'map' && <MapPage />}
          {currentPage === 'dashboard' && <DashboardPage />}
        </main>
      </div>

      <Chatbot />
    </div>
  );
}

export default App;
