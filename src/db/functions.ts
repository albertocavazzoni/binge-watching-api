import { pool } from './pooling.js';

async function executeQuery(query: string, values: any[] = []): Promise<any[]> {
    const client = await pool.connect();
    try {
        const result = await client.query(query, values);
        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

function parseError(err: Error | unknown) {
    if (!(err instanceof Error)) {
        return undefined;
    }

    return {
        code: 'code' in err && typeof err.code === 'string' ? err.code : undefined,
        column: 'column' in err && typeof err.column === 'string' ? err.column : undefined,
        constraint:
            'constraint' in err && typeof err.constraint === 'string' ? err.constraint : undefined,
        dataType: 'dataType' in err && typeof err.dataType === 'string' ? err.dataType : undefined,
        detail: 'detail' in err && typeof err.detail === 'string' ? err.detail : undefined,
        file: 'file' in err && typeof err.file === 'string' ? err.file : undefined,
        hint: 'hint' in err && typeof err.hint === 'string' ? err.hint : undefined,
        internalPosition:
            'internalPosition' in err && typeof err.internalPosition === 'string'
                ? err.internalPosition
                : undefined,
        internalQuery:
            'internalQuery' in err && typeof err.internalQuery === 'string'
                ? err.internalQuery
                : undefined,
        length: 'length' in err && typeof err.length === 'string' ? err.length : undefined,
        line: 'line' in err && typeof err.line === 'string' ? err.line : undefined,
        name: 'name' in err && typeof err.name === 'string' ? err.name : undefined,
        position: 'position' in err && typeof err.position === 'string' ? err.position : undefined,
        routine: 'routine' in err && typeof err.routine === 'string' ? err.routine : undefined,
        schema: 'schema' in err && typeof err.schema === 'string' ? err.schema : undefined,
        message: err.message,
    };
}

export { executeQuery, parseError };
