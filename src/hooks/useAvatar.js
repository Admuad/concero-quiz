// React hook for avatar management
import { useState, useEffect } from 'react';
import { getAvatarUrl, getCachedAvatar, preloadAvatar } from '../utils/avatar';

/**
 * Hook to manage avatar loading with caching
 */
export function useAvatar(username) {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) {
            setAvatarUrl(null);
            setLoading(false);
            return;
        }

        // Try to get from cache first
        const cached = getCachedAvatar(username);
        if (cached) {
            setAvatarUrl(cached);
            setLoading(false);
            return;
        }

        // If not cached, show the URL immediately and preload in background
        const url = getAvatarUrl(username);
        setAvatarUrl(url);
        setLoading(false);

        // Preload and cache for next time
        preloadAvatar(username).then(dataUrl => {
            if (dataUrl) {
                setAvatarUrl(dataUrl);
            }
        });
    }, [username]);

    return { avatarUrl, loading };
}
