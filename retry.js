async function retry(fn, retries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt < retries) {
                if (error.status === 429) { // Check for rate limit
                    const retryAfter = error.headers.get('retry-after');
                    const backoffDelay = retryAfter ? retryAfter * 1000 : delay * attempt;
                    console.warn(`Rate limited. Retrying in ${backoffDelay / 1000} seconds...`);
                    await new Promise(res => setTimeout(res, backoffDelay));
                } else {
                    const backoffDelay = delay * attempt;
                    console.warn(`Attempt ${attempt} failed. Retrying in ${backoffDelay / 1000} seconds...`);
                    await new Promise(res => setTimeout(res, backoffDelay));
                }
            } else {
                throw error;
            }
        }
    }
}

module.exports = retry;
