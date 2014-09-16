e:Vision thing
==============

This is a way to be automatically notified when assessment marks appear on the University of York's e:Vision system.
[Other universities also use something called e:Vision](https://www.google.co.uk/search?q=evision), so it should be straightforward to adapt.

Usage
-----

I use a little Linux server. You could use a Raspberry Pi. 

You need [CasperJS](http://casperjs.org/) and [PhantomJS](http://phantomjs.org/)
The supplied npm `package.json` file means you can install them easily like this:

    npm install

Given a username and password, `evision-thing.js` will log in, navigate around and output a quite untidy plaintext version of your all your module and assessment results:

    casperjs evision-thing.js --username=username --password=password

That's not much use on its own, so `evision-thing.sh` exists.
It's a sort of wrapper.
If the output of `evision-thing.js` has changed since the last time `evision-thing.sh` ran, `evision-thing.sh` will try to send send an email.

I have added something like this to my crontab:

    */30 8-18 * * 1-5 cd /path/to/evision-thing/; ./evision-thing.sh username password email

This runs Monday to Friday (`1-5`), every 30 minutes (`*/30`), from 8am to 6:30pm (`8-18`).
Replace `username`, `password` and `email` with your username, password and email address.

Yes, you have to store your password in plaintext.
That's clearly a bad idea.

Getting emails to send, and not be rejected by the likes of Gmail, is difficult.
`evision-thing.sh` expects the `mail` command to be available.
I found [SPF DNS records](http://en.wikipedia.org/wiki/Sender_Policy_Framework) to be helpful.
[Using Gmail's SMTP server](http://www.leancrew.com/all-this/2014/08/getting-around-a-gmail-restriction/) is another possibility.
