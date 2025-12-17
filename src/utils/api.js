export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1000) {
    try {
        const response = await fetch(url, options);

        // If the response is not OK, throw an error to trigger the retry logic
        // unless it's a 4xx error that likely won't be fixed by retrying (e.g. 400 Bad Request)
        // However, 404 might be temporary if a deployment is happening, but usually it's permanent.
        // 429 (Too Many Requests) and 5xx (Server Errors) are definitely worth retrying.
        if (!response.ok) {
            if (response.status >= 500 || response.status === 429) {
                throw new Error(`Server returned ${response.status}`);
            }
            // For other errors (like 400, 401, 403, 404), we return the response as is
            // so the caller can handle it (e.g. show "Tournament not active" modal).
            return response;
        }

        return response;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Fetch failed, retrying in ${backoff}ms... (${retries} retries left) - ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        } else {
            console.error(`Fetch failed after multiple retries: ${error.message}`);
            throw error;
        }
    }
}
