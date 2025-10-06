(function() {
  'use strict';

  // Configuration
  const API_ENDPOINT = window.location.origin + '/api/events';
  const WEBSITE_ID = window.UMAMI_WEBSITE_ID;

  if (!WEBSITE_ID) {
    console.warn('Umami: WEBSITE_ID not found');
    return;
  }

  // Generate or get visitor ID
  function getVisitorId() {
    let visitorId = localStorage.getItem('umami_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('umami_visitor_id', visitorId);
    }
    return visitorId;
  }

  // Send event to API
  function sendEvent(eventData) {
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    }).catch(error => {
      console.error('Umami tracking error:', error);
    });
  }

  // Track pageview
  function trackPageview() {
    const visitorId = getVisitorId();
    const url = window.location.href;
    
    sendEvent({
      websiteId: WEBSITE_ID,
      visitorId: visitorId,
      url: url,
      eventType: 'pageview',
      duration: 0
    });
  }

  // Track page duration when leaving
  let pageStartTime = Date.now();
  
  function trackPageDuration() {
    const duration = Math.round((Date.now() - pageStartTime) / 1000);
    const visitorId = getVisitorId();
    const url = window.location.href;
    
    sendEvent({
      websiteId: WEBSITE_ID,
      visitorId: visitorId,
      url: url,
      eventType: 'pageview',
      duration: duration
    });
  }

  // Initialize tracking
  function init() {
    // Track initial pageview
    trackPageview();
    
    // Track duration on page unload
    window.addEventListener('beforeunload', trackPageDuration);
    
    // Track duration on visibility change (mobile/tab switching)
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') {
        trackPageDuration();
        pageStartTime = Date.now(); // Reset timer
      }
    });
  }

  // Start tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();