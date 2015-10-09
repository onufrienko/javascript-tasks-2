'use strict';

var phoneBook = []; // Здесь вы храните записи как хотите
var regForPhone = /^(\+?\d+)?\s?((\(\d{3}\))|\d{3})\s?\d{3}(\-?|\s?)\d(\-?|\s?)\d{3}$/;
var regForEmail = /^[\w|а-я]+@([\w|а-я][\w|а-я\-]*[\w|а-я]\.)+[\w|а-я]+$/i;
var reg = /\d+/g;
/*
   Функция добавления записи в телефонную книгу.
   На вход может прийти что угодно, будьте осторожны.
*/
module.exports.add = function add(name, phone, email) {
    if (regForPhone.test(phone) && regForEmail.test(email))
    	{
    		var contact = {
    			name: name,
    			phone: getFormattedPhone(phone),
    			email: email.toLowerCase()
    		};
            phoneBook.push(contact);
    		return true;
    	}
};

function getFormattedPhone(phone)
{
	var phoneNumbers = phone.match(reg).join('');
	var thirdPart = phoneNumbers.substr(phoneNumbers.length-3,3);
	var secondPart = phoneNumbers.substr(phoneNumbers.length-4,1);
	var firstPart = phoneNumbers.substr(phoneNumbers.length-7,3);
	var code = phoneNumbers.substr(phoneNumbers.length-10,3);
	var country = phoneNumbers.substr(0,phoneNumbers.length-10);
	var res = '('+code+')'+' '+firstPart+'-'+secondPart+'-'+thirdPart;
	if (country.length!=0)
		res = '+ '+country+' '+res;
	return res;
}

/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
module.exports.find = function find(query) {

    // Ваша удивительная магия здесь
    if (!query)
	{
		phoneBook.forEach(function(contact){
			console.log(contact.name+', '+contact.phone+', '+contact.email);
		});
	}
	else
	{
		query = query.toLowerCase();
		/*Можно ли здесь как-то использовать метод filter?
		если да, то у меня не вышло :( */
		phoneBook.forEach(function(contact){
			if (contact.name.toLowerCase().indexOf(query) != -1 ||
				contact.phone.match(reg).join('').indexOf(query) != -1 ||
				contact.email.indexOf(query) != -1)
				console.log(contact.name+', '+contact.phone+', '+contact.email);
		});
	}
};

/*
   Функция удаления записи в телефонной книге.
*/
module.exports.remove = function remove(query) {

    // Ваша необьяснимая магия здесь
    if (query)
    {
		query = query.toLowerCase();
		for (var i=0; i<phoneBook.length; i++)
			if (phoneBook[i].name.toLowerCase().indexOf(query) != -1 ||
				phoneBook[i].phone.indexOf(query) != -1 ||
				phoneBook[i].email.indexOf(query) != -1)
				{
				    phoneBook.splice(i,1);
					console.log('Contact removed');
				}
	}
};

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');

    // Ваша чёрная магия:
    // - Разбираете записи из `data`
    // - Добавляете каждую запись в книгу
    var contacts = data.split('\n');
	var addedContacts = 0;
	contacts.forEach(function(contact){
		var info = contact.split(';');
		if (module.exports.add(info[0],info[1],info[2]))
			addedContacts++;
	});
	console.log('Added '+addedContacts+' contacts');
};

/*
   Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
*/
module.exports.showTable = function showTable() {

    // Ваша чёрная магия здесь
    var forLine = '';
	for (var i=0; i<25; i++)
		forLine += '═';
	var line = '╠' + forLine + '╬' + forLine.substr(0,20) + '╬' + forLine + '╣';
	var top = '╔' + forLine + '╦' + forLine.substr(0,20) + '╦' + forLine + '╗';
	var bottom = '╚' + forLine + '╩' + forLine.substr(0,20) + '╩' + forLine + '╝';
	var border = '║';
    console.log(top);
    var header = ' ' + 'Имя' + ' ' + getSpaces(42,'Имя');
    header += ' ' + 'Телефон' + ' ' + getSpaces(33, 'Телефон');
    header += ' ' + 'Email' + ' ' + getSpaces(42, 'Email');
    console.log(border+header)
    console.log(line);
	phoneBook.forEach(function(contact){
		var name =  ' ' + contact.name + ' ' + getSpaces(42, contact.name);
        var phone = ' ' + contact.phone + ' ' + getSpaces(33, contact.phone);
        var email = ' ' + contact.email + ' ' + getSpaces(42, contact.email);
        console.log(border+name+phone+email);
	});
    console.log(bottom);
};

function getSpaces(sum, str)
{
    var border = '║';
    var res = '';
    var diff = sum - str.length - 1;
    for (var i=0; i<diff;i++)
        res += ' ';
    return res + border;
}
