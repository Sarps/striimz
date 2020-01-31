const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {

    const View = use('View');
    const Env = use('Env');

    View.global('assets', (path) => {
        path = (path.substring(0, 1) == '/') ? path.substring(1) : path;
        return `${Env.get('APP_URL')}/assets/${path}`;
    });

    View.global('urli', (path) => {
        if (typeof path != 'undefined') {
            path = (path.substring(0, 1) == '/') ? path.substring(1) : path;
            return `${Env.get('APP_URL')}/${path}`
        }
        return Env.get('APP_URL');
    });

    console.log("Registered");

});
