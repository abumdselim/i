/**
 * Runs before first paint so the chosen theme does not flash. Shared by both
 * root layouts; the key matches `Shell.tsx`'s THEME_KEY.
 */
export const BOOTSTRAP = `(function(){try{var t=localStorage.getItem('intactic-studio-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`;
