e:Vision thing
==============

This sends an email when assessment marks appear on the University of York's e:Vision system.
[Other universities also use something called e:Vision](https://www.google.co.uk/search?q=evision), so it should be straightforward to adapt.

Usage
-----

I use a small virtual private server. You could use a Raspberry Pi. 

You need [CasperJS](http://casperjs.org/), [PhantomJS](http://phantomjs.org/), and [html-to-text](https://github.com/werk85/node-html-to-text).
(Apparently you can use SlimerJS instead of PhantomJS, but I haven't tried.)
The supplied npm `package.json` file means you can install them as easily as this:

    npm install

Given a username and password, `evision-thing.js` will log in, navigate around and output some HTML containing of your all your module and assessment results.
That's not much use on its own, so `evision-thing.sh` exists.
It's a sort of wrapper.
If the output of `evision-thing.js` has changed since the last time `evision-thing.sh` ran, `evision-thing.sh` will try to send send an email showing the changes,
as well as converting the HTML into something much more readable:

```diff
--- output-latest.txt	2015-05-18 12:08:20.519006512 +0100
+++ /dev/fd/63	2015-05-18 12:10:44.839006512 +0100
@@ -40,9 +40,9 @@
 EXAM - Enterprise Architecture (ENAR)   50             1         -                     -         
 
 ASSESSMENT TITLE                                      WEIGHTING(%)   ATTEMPT   UNCONFIRMED MARK(%)   MARK(%)   
 EXAM - Analysable Real-Time Systems (ARTS) - Exam 1   50             1         100                   -         
-EXAM - Analysable Real-Time Systems (ARTS) - Exam 2   50             1         -                     -         
+EXAM - Analysable Real-Time Systems (ARTS) - Exam 2   50             1         100                   -         
 
 ASSESSMENT TITLE                           WEIGHTING(%)   ATTEMPT   UNCONFIRMED MARK(%)   MARK(%)   
 EXAM - Computability & Complexity (COCO)   100            1         -                     100       
```

I have added something like this to my crontab:

    */30 8-18 * * 1-5 cd /path/to/evision-thing/; ./evision-thing.sh username password email

This runs Monday to Friday (`1-5`), every 30 minutes (`*/30`), from 8am to 6:30pm (`8-18`).
Replace `username`, `password` and `email` with your username, password and email address.
Yes, you have to store your password in plaintext.
That's clearly a bad idea.

Feel free to adjust the frequency
-- if it's run too frequently the Casper.js script often outputs `null`,
but when this occurs `evision-thing.sh` should make this failure silent.

Getting emails to send, and not be rejected by the likes of Gmail, is difficult.
`evision-thing.sh` expects the `mail` command to be available.
I found setting [SPF DNS records](http://en.wikipedia.org/wiki/Sender_Policy_Framework) to be helpful.
[Using Gmail's SMTP server](http://www.leancrew.com/all-this/2014/08/getting-around-a-gmail-restriction/) is another possibility.
