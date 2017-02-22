'use strict';

var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var verifier = require('email-verify');
var Q = require('q');

app.use(bodyParser.json());

var emailOptions = {
    'sender': 'abhi@newsai.org'
};

function verifyEmail(email, domainExtension) {
    var deferred = Q.defer();

    verifier.verify(email + domainExtension, emailOptions, function(err, info) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(info);
        }
    });

    return deferred.promise;
}

function verifyEmails(emails, domainExtension) {
    var allPromises = [];

    for (var i = 0; i < emails.length; i++) {
        var toExecute = verifyEmail(emails[i], domainExtension);
        allPromises.push(toExecute);
    }

    return Q.allSettled(allPromises);
}

function generateEmails(firstName, lastName, domainExtension) {
    var emails = [];

    firstName = firstName.toLowerCase();
    lastName = lastName.toLowerCase();
    domainExtension = domainExtension.toLowerCase();

    emails.push(firstName) // abhi@newsai.co
    emails.push(lastName) // agarwal@newsai.co

    emails.push(firstName + lastName) // abhiagarwal@newsai.co
    emails.push(firstName + '.' + lastName) // abhi.agarwal@newsai.co
    emails.push(lastName + firstName) // agarwalabhi@newsai.co
    emails.push(lastName + '.' + firstName) // agarwal.abhi@newsai.co


    emails.push(firstName[0] + lastName) // aagarwal@newsai.co
    emails.push(firstName[0] + '.' + lastName) // a.agarwal@newsai.co
    emails.push(firstName[0] + lastName[0]) // aa@newsai.co
    emails.push(firstName[0]) // a@newsai.co

    emails.push(lastName + firstName[0]) // agarwala@newsai.co
    emails.push(lastName + '.' + firstName[0]) // agarwal.a@newsai.co
    emails.push(firstName + lastName[0]) // abhia@newsai.co
    emails.push(firstName + '.' + lastName[0]) // abhi.a@newsai.co

    return emails;
}

function tryEmails(firstName, lastName, domainExtension) {
    var deferred = Q.defer();

    if (!domainExtension.includes('@')) {
        domainExtension = '@' + domainExtension
    }
    
    var emails = generateEmails(firstName, lastName, domainExtension);
    verifyEmails(emails, domainExtension).then(function(validEmails) {
        deferred.resolve(validEmails);
    }, function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
}

app.post('/generate_email', function (req, res) {
    tryEmails(req.body.firstName, req.body.lastName, req.body.domain).then(function (emails) {
        var validEmail = '';
        for (var i = 0; i < emails.length; i++) {
            if (emails[i] && emails[i].value && emails[i].value.success) {
                validEmail = emails[i].value && emails[i].value.addr;
            }
        }
        res.json({'email': validEmail});
    }, function (error) {
        console.error(error);
        res.json({'email': ''});
    });
});

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});