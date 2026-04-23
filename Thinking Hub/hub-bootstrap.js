/**
 * hub-bootstrap.js
 * Centralized bootstrapping for all Thinking Hub tools
 *
 * Responsibilities:
 * - Ensure shared modules are initialized once
 * - Standardize tool startup sequence
 * - Remove per-HTML duplication
 *
 * Load AFTER:
 *  - hub-storage.js
 *  - hub-links.js
 *  - hub-data.js
 *  - hub-search.js
 *  - hub-toast.js
 */

window.HubBootstrap = (() => {
    let _started = false;

    function start(toolId, options = {}) {
        if (_started) return;
        _started = true;

        if (!toolId) {
            console.warn('[HubBootstrap] toolId missing');
            return;
        }

        // ── Core modules ─────────────────────────────
        if (window.HubData) {
            HubData.init(toolId);
        }

        if (window.HubLinks) {
            HubLinks.init(toolId);
        }

        if (window.HubSearch) {
            HubSearch.init();
        }

        // ── Optional hooks ───────────────────────────
        if (typeof options.onReady === 'function') {
            try { options.onReady(); } catch (e) {
                console.error('[HubBootstrap] onReady error', e);
            }
        }
    }

    return { start };
})();