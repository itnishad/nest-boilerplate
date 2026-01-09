export default (): Record<string, any> => ({
    appName: 'My Awesome App Test',
    port: 8001,
    database: {
        host: 'localhost',
        port: 5433,
        username: 'test_user',
        password: 'test_password',
        dbName: 'myappdb_test',
    }
});