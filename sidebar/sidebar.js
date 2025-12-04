document.addEventListener('DOMContentLoaded', function() {
  const clearStorageCard = document.getElementById('clear-storage-card');
  if (clearStorageCard) {
    clearStorageCard.addEventListener('click', function() {
      if (confirm('Are you sure you want to clear all stored data? This will remove all credentials, settings, faculty ratings, and preferences. This action cannot be undone.')) {
        chrome.storage.local.clear(() => {
          if (chrome.runtime.lastError) {
            alert('Error clearing storage: ' + chrome.runtime.lastError.message);
          } else {
            alert('All local storage cleared successfully! The extension has been reset.');
            // Reload all tabs to reflect the changes
            chrome.tabs.query({}, tabs => {
              tabs.forEach(tab => {
                chrome.tabs.reload(tab.id).catch(() => {});
              });
            });
          }
        });
      }
    });
  }
  
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      if (target) {
        window.location.href = target;
      }
    });
  });
  
  const credentialsCard = document.getElementById('credentials-card');
  if (credentialsCard) {
    credentialsCard.addEventListener('click', function() {
      window.location.href = 'credentialsInjection.html';
    });
  }
});