var servers = require('./backend/servers');
servers.createFrontendServer();
servers.createBackendDataServer();
servers.createBackendMetricsServer();

