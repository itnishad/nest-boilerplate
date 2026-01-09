export default (): Record<string, any> => ({
    appName: 'My Awesome App',
    port: 8080,
    database: {
        host: 'prod-db-server',
        port: 5432,
        username: 'prod_user',
        password: 'prod_password',
        dbName: 'myappdb_prod',
    }
});