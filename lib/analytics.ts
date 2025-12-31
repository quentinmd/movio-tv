// Utilitaire pour Google Analytics

export const GA_TRACKING_ID = 'G-D5902DZPG6';

// Déclarer gtag pour TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

// Événement de recherche
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  }
};

// Événement de visionnage de vidéo
export const trackVideoPlay = (
  contentTitle: string,
  contentType: 'movie' | 'tv',
  contentId: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_play', {
      content_title: contentTitle,
      content_type: contentType,
      content_id: contentId,
    });
  }
};

// Événement de sélection d'épisode
export const trackEpisodeSelect = (
  seriesTitle: string,
  season: number,
  episode: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'episode_select', {
      series_title: seriesTitle,
      season_number: season,
      episode_number: episode,
    });
  }
};

// Événement d'ajout aux favoris
export const trackAddFavorite = (contentTitle: string, contentType: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_favorites', {
      content_title: contentTitle,
      content_type: contentType,
    });
  }
};

// Événement de notation
export const trackRating = (
  contentTitle: string,
  rating: number,
  contentType: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'rate_content', {
      content_title: contentTitle,
      rating_value: rating,
      content_type: contentType,
    });
  }
};

// Événement de suggestion de contenu
export const trackContentSuggestion = (
  contentTitle: string,
  contentType: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'suggest_content', {
      content_title: contentTitle,
      content_type: contentType,
    });
  }
};

// Événement de temps passé (manuel pour pages importantes)
export const trackTimeSpent = (
  pageName: string,
  timeInSeconds: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'time_spent', {
      page_name: pageName,
      duration_seconds: timeInSeconds,
    });
  }
};

// Événement de clic sur catégorie
export const trackCategoryClick = (categoryName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'category_click', {
      category_name: categoryName,
    });
  }
};
