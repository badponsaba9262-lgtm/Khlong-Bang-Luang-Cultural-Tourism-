/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { PlacesScreen } from './components/PlacesScreen';
import { CultureScreen } from './components/CultureScreen';
import { Video360Screen } from './components/Video360Screen';
import { MapScreen } from './components/MapScreen';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { SearchModal } from './components/SearchModal';
import { Place } from './types';
import { soundManager } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedPlaceModal, setSelectedPlaceModal] = useState<Place | null>(null);
  const [targetMapPlaceId, setTargetMapPlaceId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<'th' | 'en'>('th');

  // Global Audio feedback on clicks using event delegation
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactiveEl = target.closest('button, a, [role="button"], input[type="button"], input[type="submit"]');
      if (interactiveEl) {
        soundManager.playClick();
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => window.removeEventListener('click', handleGlobalClick, { capture: true });
  }, []);

  const handleNavigateTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToMapWithPlace = (placeId: string) => {
    setTargetMapPlaceId(placeId);
    handleNavigateTab('map');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f0] text-[#1d1b16] font-sans selection:bg-[#fe9666]/30 selection:text-[#98471d] relative">

      {/* Global Navigation Header */}
      <Header
        currentTab={currentTab}
        onTabChange={handleNavigateTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(l => l === 'th' ? 'en' : 'th')}
      />

      {/* Main Content View Switcher with Page Transition Effect */}
      <main className="flex-1">
        <div key={currentTab} className="page-transition">
          {currentTab === 'home' && (
            <HomeScreen
              onNavigate={handleNavigateTab}
              onSelectPlace={(place) => setSelectedPlaceModal(place)}
              lang={lang}
            />
          )}

          {currentTab === 'places' && (
            <PlacesScreen
              onSelectPlace={(place) => setSelectedPlaceModal(place)}
              onGoToMap={handleGoToMapWithPlace}
              lang={lang}
            />
          )}

          {currentTab === 'culture' && (
            <CultureScreen
              lang={lang}
            />
          )}

          {currentTab === 'video360' && (
            <Video360Screen
              lang={lang}
            />
          )}

          {currentTab === 'map' && (
            <MapScreen
              initialPlaceId={targetMapPlaceId}
              onSelectPlace={(place) => setSelectedPlaceModal(place)}
              lang={lang}
            />
          )}
        </div>
      </main>

      {/* Rich Footer */}
      <Footer
        onNavigate={handleNavigateTab}
        lang={lang}
      />

      {/* Modals */}
      <PlaceDetailModal
        place={selectedPlaceModal}
        onClose={() => setSelectedPlaceModal(null)}
        onGoToMap={handleGoToMapWithPlace}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPlace={(place) => setSelectedPlaceModal(place)}
        onNavigateTab={handleNavigateTab}
      />

    </div>
  );
}
