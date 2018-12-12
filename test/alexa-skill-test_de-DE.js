'use strict';

// include the testing framework
const alexaTest = require('alexa-skill-test-framework');

// custom slot types
const LIST_OF_COUNTRIES_F = 'LIST_OF_COUNTRIES_F';
const LIST_OF_COUNTRIES_M = 'LIST_OF_COUNTRIES_M';

// initialize the testing framework
alexaTest.initialize(
    require('../src/index'),
    'amzn1.ask.skill.20b17a96-0109-4bf4-b17e-9a577e88fd83',
    'amzn1.ask.account.VOID');
alexaTest.setLocale('de-DE');

describe('Sprachentester Skill', () => {

    describe('ErrorHandler', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest(''),
                says: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
                reprompts: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('HelpIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.HelpIntent'),
                says: 'Ich kann mit verschiedenen weiblichen und männlichen Stimmen in unterschiedlichen Sprachen reden, z.B. als Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Spanier oder Spanierin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin. Welche Stimme soll ich benutzen?',
                reprompts: 'Welche Nationalität soll ich benutzen: Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Spanier oder Spanierin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('SessionEndedRequest', () => {
        alexaTest.test([
            {
                request: alexaTest.getSessionEndedRequest(),
                saysNothing: true, repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('CancelIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.CancelIntent'),
                says: '<say-as interpret-as="interjection">bis dann</say-as>.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('StopIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.StopIntent'),
                says: '<say-as interpret-as="interjection">bis dann</say-as>.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: alexaTest.getLaunchRequest(),
                says: 'Ich kann mit verschiedenen weiblichen und männlichen Stimmen in unterschiedlichen Sprachen reden, z.B. als Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Spanier oder Spanierin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin. Welche Stimme soll ich benutzen?',
                reprompts: 'Welche Nationalität soll ich benutzen: Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Spanier oder Spanierin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('CountryIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'australierin' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Australierin', 'en-AU'),
                says: '<voice name="Nicole">So klingt es wenn eine Australierin spricht: <lang xml:lang="en-AU">Hi there, this is what the English language sounds like.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'spanierin' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Spanierin', 'es-ES'),
                says: '<voice name="Conchita">So klingt es wenn eine Spanierin spricht: <lang xml:lang="es-ES">Hola, ese es el idioma español.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'italienerin' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Italienerin', 'it-IT'),
                says: '<voice name="Carla">So klingt es wenn eine Italienerin spricht: <lang xml:lang="it-IT">Ciao, questa è la lingua italiana.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'japanerin' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Japanerin', 'ja-JP'),
                says: '<voice name="Mizuki">So klingt es wenn eine Japanerin spricht: <lang xml:lang="ja-JP">こんにちは、それは日本語のように聞こえる.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'australier' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Australier', 'en-AU'),
                says: '<voice name="Russell">So klingt es wenn ein Australier spricht: <lang xml:lang="en-AU">Hi there, this is what the English language sounds like.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'brite' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Brite', 'en-GB'),
                says: '<voice name="Brian">So klingt es wenn ein Brite spricht: <lang xml:lang="en-GB">Hi there, this is what the English language sounds like.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'deutscher' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Deutscher', 'de-DE'),
                says: '<voice name="Hans">So klingt es wenn ein Deutscher spricht: <lang xml:lang="de-DE">Hallo, so klingt die deutsche Sprache.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'spanier' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Spanier', 'es-ES'),
                says: '<voice name="Enrique">So klingt es wenn ein Spanier spricht: <lang xml:lang="es-ES">Hola, ese es el idioma español.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'italiener' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Italiener', 'it-IT'),
                says: '<voice name="Giorgio">So klingt es wenn ein Italiener spricht: <lang xml:lang="it-IT">Ciao, questa è la lingua italiana.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'japaner' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Japaner', 'ja-JP'),
                says: '<voice name="Takumi">So klingt es wenn ein Japaner spricht: <lang xml:lang="ja-JP">こんにちは、それは日本語のように聞こえる.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'franzose' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Franzose', 'fr-FR'),
                says: '<voice name="Mathieu">So klingt es wenn ein Franzose spricht: <lang xml:lang="fr-FR">Bonjour, ça sonne comme la langue française.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionNoMatchToRequest(
                    alexaTest.getIntentRequest('CountryIntent'), 'country_f', LIST_OF_COUNTRIES_F, 'Klingone'),
                says: 'Ich kenne diese Nationalität leider nicht.',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });
});
