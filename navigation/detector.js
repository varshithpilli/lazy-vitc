// // const detectPage = () => {
// //   if (document.querySelector('h3')?.textContent.includes('Attendance Details') || 
// //         document.querySelector('table[id*="attendance"]')) {
// //         view_attendance_page()
// //   }
  
// //   if (document.querySelector('h3')?.textContent.includes('Marks View')) {
// //     modify_marks_page()
// //   }
// // };


// const detectPage = () => {
//   observer.disconnect(); // stop watching during detection

//   try {
//     if (document.querySelector('h3')?.textContent.includes('Attendance Details') || 
//         document.querySelector('table[id*="attendance"]')) {
//         view_attendance_page();
//     }

//     if (document.querySelector('h3')?.textContent.includes('Marks View')) {
//       modify_marks_page();
//     }
//   } finally {
//     // Re-enable observer AFTER the DOM changes
//     observer.observe(targetNode, {
//       childList: true,
//       subtree: true
//     });
//   }
// };


// // Initial check
// if (document.readyState === "loading") {
//   document.addEventListener("DOMContentLoaded", () => {
//     setTimeout(detectPage, 500);
//   });
// }

// // Watch for dynamic content changes in VTOP
// const observer = new MutationObserver((mutations) => {
//   // Debounce to avoid excessive calls
//   clearTimeout(window.vibootDetectorTimeout);
//   window.vibootDetectorTimeout = setTimeout(detectPage, 300);
// });

// // Observe the main content area where VTOP loads pages
// const targetNode = document.getElementById('fixedNavbar') || document.body;
// observer.observe(targetNode, {
//   childList: true,
//   subtree: true
// });

// setTimeout(() => {
//   nav();
//   console.log("nav displayed");
// }, 1000);



// Choose a specific content container if possible
const targetNode =
  document.getElementById('page-wrapper') ||
  document.getElementById('content') ||
  document.querySelector('.main-content') ||
  document.getElementById('fixedNavbar') ||
  document.body;

let isDetecting = false;
let isSelfMutating = false;
let isObserverActive = false;
let debounceHandle = null;

// MutationObserver
const observer = new MutationObserver((mutations) => {
  // Ignore mutations we caused ourselves
  if (isSelfMutating) return;

  // Debounce: trailing-only
  if (debounceHandle) {
    clearTimeout(debounceHandle);
    debounceHandle = null;
  }
  debounceHandle = setTimeout(() => {
    // Avoid overlap with a manual detect
    if (!isDetecting) detectPage();
  }, 300);
});

function startObserving() {
  if (isObserverActive) return;
  observer.observe(targetNode, { childList: true, subtree: true });
  isObserverActive = true;
}

function stopObserving() {
  if (!isObserverActive) return;
  observer.disconnect();
  isObserverActive = false;
}

function detectPage() {
  if (isDetecting) return; // reentrancy guard
  isDetecting = true;

  // Stop observing during our changes
  stopObserving();

  try {
    const h3Text = document.querySelector('h3')?.textContent || '';

    if (
      h3Text.includes('Attendance Details') ||
      document.querySelector('table[id*="attendance"]')
    ) {
      isSelfMutating = true;
      try {
        view_attendance_page();
      } finally {
        isSelfMutating = false;
      }
    }

    if (h3Text.includes('Marks View')) {
      isSelfMutating = true;
      try {
        modify_marks_page();
      } finally {
        isSelfMutating = false;
      }
    }
  } finally {
    // Clear any pending debounce scheduled before we stopped observing
    if (debounceHandle) {
      clearTimeout(debounceHandle);
      debounceHandle = null;
    }
    startObserving();
    isDetecting = false;
  }
}

// Initial check: pick ONE path. Prefer a single delayed run, not both DOMContentLoaded and immediate.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => detectPage(), 500);
    startObserving(); // start after scheduling the initial detect
  });
} else {
  setTimeout(() => detectPage(), 500);
  startObserving();
}

// If nav() mutates the DOM, wrap it so the observer ignores that mutation
setTimeout(() => {
  isSelfMutating = true;
  try {
    nav();
    console.log('nav displayed');
  } finally {
    isSelfMutating = false;
  }
}, 1000);