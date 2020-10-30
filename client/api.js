import Dexie from 'dexie';

let url = window.location.origin;

let db;

export async function get(path, queries = {}) {
    let queryString = '',
        count = 0;

    // Construct a query string
    for (let key in queries) {
        let value = queries[key];

        if (!value) continue;

        count === 0 ? queryString += '?' : queryString += '&';

        queryString += `${key}=${value}`;

        count++;
    }

    const response = await fetch(`${url}/${path}${queryString}`);

    return response.json();
}

export async function client_get(table) {
    if (!db) db = new Dexie('Pokemon');
    await db.open();
    table = db._allTables[table];

    return table.toArray();
}

export async function client_post(table, json) {
    if (!db) db = new Dexie('Pokemon');
    await db.open();
    table = db._allTables[table];

    const data = await table.toArray();
    const rowIndex = data.findIndex(i => i.name === json.name);
    let row = rowIndex > -1 && data[rowIndex];

    if (!row) row = await table.add(json);

    return row.name;
}

export async function client_del(table, id) {
    if (!db) db = new Dexie('Pokemon');
    await db.open();
    table = db._allTables[table];
    let item = await table.where({
        name: id,
    }).first();

    if (item) {
        await table.delete(item.id);
    }

    return item ? item.id : undefined;
}