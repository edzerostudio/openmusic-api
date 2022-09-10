const InMemoryService = require('./inMemory');
const PostgresService = require('./postgres');

switch (process.env.DB) {
    case 'inMemory':
        service = new InMemoryService();
        break;
    case 'postgres':
        service = new PostgresService();
        break;

    default:
        service = new InMemoryService();
        break;
}

module.exports = service;