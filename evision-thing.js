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
        return document.getElementById('sitspagecontent').getElementsByTagName('table')[1].textContent;
    }));
    var modulesCount = this.evaluate(function () {
        return document.getElementsByName('butselect').length;
    });

    // visit each 'component details' page:
    while (modulesCount > 0) {
        this.thenClick('table > tbody > tr:nth-child(' + modulesCount + ') input');
        // 'assessment components' table
        this.then(function () {
            this.echo(this.evaluate(function () {
                return document.getElementById('sitspagecontent').getElementsByTagName('table')[2].textContent;
            }));
        });
        this.back();
        modulesCount -= 1;
    }
});

casper.run();
