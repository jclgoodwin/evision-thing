var casper = require('casper').create({
        waitTimeout: 100000,
        pageSettings: {
            loadImages: false
        },
    }),
    username = casper.cli.options.username,
    password = casper.cli.options.password;

if (!(username && password)) {
    casper.die();
}

// log in:
casper.start('http://evision.york.ac.uk', function () {
    if (this.getCurrentUrl() !== 'https://shib.york.ac.uk/idp/Authn/UserPassword') {
        casper.die();
    }
    this.fill('form[action="/idp/Authn/UserPassword"]', {
        'j_username': username,
        'j_password': password
    }, true);
});
casper.waitForText('Module and Assessment Results', function () {
    this.clickLabel('Module and Assessment Results');
});

// select the first (and, in my case, only) 'programme'
// some students probably have multiple buttons (if they do an LFA course, for example), but this script doesn't support that yet
casper.thenClick('[name="butselect"]');

casper.then(function () {
    // 'current module results' overview:
    this.echo(this.evaluate(function () {
        return document.getElementById('sitspagecontent').getElementsByTagName('table')[1].outerHTML;
    }));
    var modulesSelector = 'table[summary="module details and assessment marks"] tbody tr',
        modulesCount = this.evaluate(function (selector) {
            return document.querySelectorAll(selector).length;
        }, modulesSelector),
        getModuleButtonSelector = function (i) {
            return modulesSelector + ':nth-child(' + i + ') input';
        };

    // visit each 'component details' page:
    casper.repeat(modulesCount, function () {
        if (this.exists(getModuleButtonSelector(modulesCount))) {
            this.thenClick(getModuleButtonSelector(modulesCount));
            // 'assessment components' table:
            this.then(function () {
                this.echo(this.evaluate(function () {
                    return document.getElementById('sitspagecontent').getElementsByTagName('table')[2].outerHTML;
                }));
            });
            this.thenClick('[value=Back]');
        }
        modulesCount -= 1;
    });
});

casper.run();
