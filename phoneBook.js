'use strict';

var phoneBook = []; // Здесь вы храните записи как хотите
var regForPhone =
/^(\+?[0-9]+)?\s?((\([0-9]{3}\))|[0-9]{3})\s?[0-9]{3}(-?|\s?)[0-9](-?|\s?)[0-9]{3}$/;
var regForEmail = /^[\w]+@([\wа-я][\wа-я-]*[\wа-я]\.)+[\wа-я]+$/i;
module.exports.add = function add(name, phone, email) {
    if (regForPhone.test(phone) && regForEmail.test(email)) {
        var contact = {
            name: name,
            phone: getFormattedPhone(phone),
            email: email.toLowerCase()
        };
        phoneBook.push(contact);
        return true;
    }
};
function getFormattedPhone(phone) {
    var phoneNumbers = phone.match(/[0-9]+/g).join('');
    var thirdPart = phoneNumbers.substr(phoneNumbers.length - 3, 3);
    var secondPart = phoneNumbers.substr(phoneNumbers.length - 4, 1);
    var firstPart = phoneNumbers.substr(phoneNumbers.length - 7, 3);
    var code = phoneNumbers.substr(phoneNumbers.length - 10, 3);
    var country = phoneNumbers.substr(0, phoneNumbers.length - 10);
    var res = '(' + code + ')' + ' ' + firstPart + '-' + secondPart + '-' + thirdPart;
    if (country.length) {
        res = '+' + country + ' ' + res;
    }
    return res;
}
module.exports.find = function find(query) {
    if (!query) {
        phoneBook.forEach(function (contact) {
            console.log(contact.name + ', ' + contact.phone + ', ' + contact.email);
        });
    } else {
        query = query.toLowerCase();
        phoneBook.forEach(function (contact) {
            if (findQuery(query, contact)) {
                console.log(contact.name + ', ' + contact.phone + ', ' + contact.email);
            }
        });
    }
};
function findQuery(query, contact) {
    if (contact.name.toLowerCase().indexOf(query) != -1 ||
        contact.phone.match(/[0-9]+/g).join('').indexOf(query) != -1 ||
        contact.email.indexOf(query) != -1) {
        return true;
    }
}
module.exports.remove = function remove(query) {

    // Ваша необьяснимая магия здесь
    if (query) {
        query = query.toLowerCase();
        for (var i = 0; i < phoneBook.length; i++) {
            if (findQuery(query, phoneBook[i])) {
                phoneBook.splice(i, 1);
                console.log('Contact removed');
            }
        }
    }
};
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    // Ваша чёрная магия:
    // - Разбираете записи из `data`
    // - Добавляете каждую запись в книгу
    var contacts = data.split('\n');
    var addedContacts = 0;
    contacts.forEach(function (contact) {
        var info = contact.split(';');
        if (module.exports.add(info[0], info[1], info[2])) {
            addedContacts++;
        }
    });
    console.log('Added ' + addedContacts + ' contacts');
};
module.exports.showTable = function showTable() {

    // Ваша чёрная магия здесь
    var forLine = '';
    for (var i = 0; i < 25; i++) {
        forLine += '═';
    }
    var line = '╠' + forLine + '╬' + forLine.substr(0, 21) + '╬' + forLine + '╣';
    var top = '╔' + forLine + '╦' + forLine.substr(0, 21) + '╦' + forLine + '╗';
    var bottom = '╚' + forLine + '╩' + forLine.substr(0, 21) + '╩' + forLine + '╝';
    var border = '║';
    console.log(top);
    var header = ' ' + 'Имя' + ' ' + getSpaces(24, 'Имя');
    header += ' ' + 'Телефон' + ' ' + getSpaces(20, 'Телефон');
    header += ' ' + 'Email' + ' ' + getSpaces(24, 'Email');
    console.log(border + header);
    console.log(line);
    phoneBook.forEach(function (contact) {
        var name = ' ' + contact.name + ' ' + getSpaces(24, contact.name);
        var phone = ' ' + contact.phone + ' ' + getSpaces(20, contact.phone);
        var email = ' ' + contact.email + ' ' + getSpaces(24, contact.email);
        console.log(border + name + phone + email);
    });
    console.log(bottom);
};
function getSpaces(sum, str) {
    var border = '║';
    var res = '';
    var diff = sum - str.length - 1;
    for (var i = 0; i < diff; i++) {
        res += ' ';
    }
    return res + border;
}
