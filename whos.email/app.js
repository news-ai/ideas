var verifier = require('email-verify');
var Q = require('q');

function verifyEmail(email, domainExtension) {
    var deferred = Q.defer();

    verifier.verify(email + domainExtension, function(err, info) {
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
    emails.push(firstName + '.' + lastName[0]) // abhia@newsai.co

    return emails;
}

function tryEmails(firstName, lastName, domainExtension) {
    if (!domainExtension.includes('@')) {
        domainExtension = '@' + domainExtension
    }
    
    var emails = generateEmails(firstName, lastName, domainExtension);
    verifyEmails(emails, domainExtension).then(function(content) {
        console.log(content);
    }, function (error) {
        console.log(error);
    });
}

tryEmails('Abhi', 'Agarwal', 'newsai.co')