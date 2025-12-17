/**
 * Fisher-Yates shuffle algorithm
 * Time complexity: O(n)
 * @param {Array} array 
 * @returns {Array} New shuffled array
 */
export function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        // Use crypto.getRandomValues for better randomization
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        const randomFloat = randomBuffer[0] / (0xffffffff + 1);

        const j = Math.floor(randomFloat * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
