// Avatar utility with caching and preloading

const AVATAR_CACHE_KEY_PREFIX = 'avatar_';
const AVATAR_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Get avatar URL for a username
 */
export function getAvatarUrl(username) {
    if (!username) return null;
    const cleanUsername = username.replace('@', '').trim().toLowerCase();
    return `https://unavatar.io/x/${cleanUsername}?fallback=https://avatars.githubusercontent.com/u/0?v=4`;
}

/**
 * Get cached avatar data URL from localStorage
 */
export function getCachedAvatar(username) {
    if (!username) return null;

    const cleanUsername = username.replace('@', '').trim().toLowerCase();
    const cacheKey = `${AVATAR_CACHE_KEY_PREFIX}${cleanUsername}`;

    try {
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);

        // Check if cache is still valid
        if (Date.now() - timestamp > AVATAR_CACHE_DURATION) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error reading avatar cache:', error);
        // Clear invalid cache to prevent recurring errors
        localStorage.removeItem(cacheKey);
        return null;
    }
}

/**
 * Cache avatar as data URL in localStorage
 */
export function cacheAvatar(username, dataUrl) {
    if (!username || !dataUrl) return;

    const cleanUsername = username.replace('@', '').trim().toLowerCase();
    const cacheKey = `${AVATAR_CACHE_KEY_PREFIX}${cleanUsername}`;

    try {
        const cacheData = {
            data: dataUrl,
            timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error caching avatar:', error);
    }
}

/**
 * Preload and cache avatar
 */
export async function preloadAvatar(username) {
    if (!username) return null;

    // Check cache first
    const cached = getCachedAvatar(username);
    if (cached) return cached;

    // Fetch and cache
    const url = getAvatarUrl(username);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch avatar');

        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result;
                cacheAvatar(username, dataUrl);
                resolve(dataUrl);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error preloading avatar:', error);
        return null;
    }
}

/**
 * Preload multiple avatars in parallel
 */
export async function preloadAvatars(usernames) {
    if (!Array.isArray(usernames)) return;

    const promises = usernames.map(username => preloadAvatar(username));
    await Promise.allSettled(promises);
}

/**
 * Clear old avatar cache entries
 */
export function clearOldAvatarCache() {
    try {
        const keys = Object.keys(localStorage);
        const now = Date.now();

        keys.forEach(key => {
            if (!key.startsWith(AVATAR_CACHE_KEY_PREFIX)) return;

            try {
                const cached = JSON.parse(localStorage.getItem(key));
                if (now - cached.timestamp > AVATAR_CACHE_DURATION) {
                    localStorage.removeItem(key);
                }
            } catch (error) {
                // Invalid cache entry, remove it
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.error('Error clearing old avatar cache:', error);
    }
}
