export default (): Record<string, any> => ({
    appName: 'My Awesome App',
    port: 8000,
    database: {
        host: 'localhost',
        port: 5432,
        username: 'user',
        password: 'password',
        dbName: 'myappdb',
    }
});