var x = require('casper').selectXPath,
    casper = require('casper').create({
        pageSettings: {
            loadImages: false
        }
    }),
    username = casper.cli.options.username,
    password = casper.cli.options.password;

casper.options.waitTimeout = 20000;

if (!(username && password)) {
    casper.die();
}

casper.start('http://evision.york.ac.uk', function () {
    if (this.getCurrentUrl() !== 'https://shib.york.ac.uk/idp/Authn/UserPassword') {
        casper.die();
    }
    this.fill('form[action="/idp/Authn/UserPassword"]', {
        'j_username': username,
        'j_password': password
    }, true);
});

casper.waitForUrl('https://evision.york.ac.uk/urd/sits.urd/run/siw_sso.signon', function() {
    this.clickLabel('Module and Assessment Results');
});


// modules overview

casper.thenClick('[name="butselect"]'); // computer science

casper.then(function () {
    this.echo(this.evaluate(function () {
       return document.getElementById('sitspagecontent').getElementsByTagName('table')[3].textContent;
    }));
    modulesCount = this.evaluate(function () {
        return document.getElementsByName('butselect').length;
    });
});

// module by module

casper.then(function () {
    for (; modulesCount > 0; modulesCount -= 1) {
        this.thenClick(x('//*[@id="sitspagecontent"]/form/table[4]/tbody/tr[' + (modulesCount + 1)  + ']/td[6]/input'));
        this.then(function () {
            this.echo(casper.evaluate(function () {
                return document.getElementById('sitspagecontent').getElementsByTagName('table')[5].textContent;
            }));
        });
        casper.back();
    }
});

casper.run();
