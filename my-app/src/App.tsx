import { useState, useCallback } from 'react';
import { useLenis } from './hooks/useLenis';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import ProblemSection from './sections/ProblemSection';
import ArchitectureSection from './sections/ArchitectureSection';
import CognitiveLoopSection from './sections/CognitiveLoopSection';
import BeliefDynamicsSection from './sections/BeliefDynamicsSection';
import HelixGallerySection from './sections/HelixGallerySection';
import ResearchRoadmapSection from './sections/ResearchRoadmapSection';
import Footer from './sections/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useLenis();

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
    // Small delay before revealing content for smooth transition
    setTimeout(() => setContentVisible(true), 100);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <Navigation visible={contentVisible} />

      <main>
        <HeroSection visible={contentVisible} />
        <ProblemSection />
        <ArchitectureSection />
        <CognitiveLoopSection />
        <BeliefDynamicsSection />
        <HelixGallerySection />
        <ResearchRoadmapSection />
      </main>

      <Footer />
    </>
  );
}
