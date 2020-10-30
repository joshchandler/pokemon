
let url = window.location.origin;

export async function get(path, queries = {}) {
    let queryString = "",
        count = 0;

    // Construct a query string
    for (let key in queries) {
        let value = queries[key];

        if (!value) continue;

        count === 0 ? queryString += "?" : queryString += "&";

        queryString += `${key}=${value}`;

        count++;
    }

    const response = await fetch(`${url}/${path}${queryString}`);

    return response.json();
}