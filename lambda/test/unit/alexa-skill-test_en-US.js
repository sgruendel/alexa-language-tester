'use strict';

// include the testing framework
const alexaTest = require('alexa-skill-test-framework');

// custom slot types
const LIST_OF_COUNTRIES_F = 'LIST_OF_COUNTRIES_F';
const LIST_OF_COUNTRIES_M = 'LIST_OF_COUNTRIES_M';

// initialize the testing framework
alexaTest.initialize(
    require('../../index'),
    'amzn1.ask.skill.20b17a96-0109-4bf4-b17e-9a577e88fd83',
    'amzn1.ask.account.VOID');
alexaTest.setLocale('en-US');

describe('Language Tester Skill', () => {

    describe('ErrorHandler', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest(''),
                says: "Sorry, I don't understand. Please say again?",
                reprompts: "Sorry, I don't understand. Please say again?",
                shouldEndSession: false,
            },
        ]);
    });

    describe('FallbackIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.FallbackIntent'),
                says: 'I can talk with various female and male voices in different languages, e.g. as German man or woman, American man or woman, Australian man or woman, British man or woman, Indian woman, Spanish man or woman, Italian man or woman, Japanese man or woman, French man or woman. Which voice should I use?',
                reprompts: 'Which voice should I use: German man or woman, American man or woman, Australian man or woman, British man or woman, Indian woman, Spanish man or woman, Italian man or woman, Japanese man or woman, French man or woman?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('HelpIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.HelpIntent'),
                says: 'I can talk with various female and male voices in different languages, e.g. as German man or woman, American man or woman, Australian man or woman, British man or woman, Indian woman, Spanish man or woman, Italian man or woman, Japanese man or woman, French man or woman. Which voice should I use?',
                reprompts: 'Which voice should I use: German man or woman, American man or woman, Australian man or woman, British man or woman, Indian woman, Spanish man or woman, Italian man or woman, Japanese man or woman, French man or woman?',
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
                says: 'See you soon!',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('StopIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.getIntentRequest('AMAZON.StopIntent'),
                says: 'See you soon!',
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: alexaTest.getLaunchRequest(),
                says: 'I can talk with various female and male voices in different languages, e.g. as German man or woman, American man or woman, Australian man or woman, British man or woman, Indian woman, Spanish man or woman, Italian man or woman, Japanese man or woman, French man or woman. Which voice should I use?',
                reprompts: 'Which voice should I use: German man or woman, American man or woman, Australian man or woman, British man or woman, Indian woman, Spanish man or woman, Italian man or woman, Japanese man or woman, French man or woman?',
                shouldEndSession: false,
            },
        ]);
    });

    describe('CountryIntent', () => {
        alexaTest.test([
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'Australian woman' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Australian woman', 'en-AU'),
                says: '<voice name="Nicole">Here\'s what an Australian woman sounds like: <lang xml:lang="en-AU">Hi there, this is what the English language sounds like.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'Spanish woman' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Spanish woman', 'es-ES'),
                says: '<voice name="Conchita">Here\'s what a Spanish woman sounds like: <lang xml:lang="es-ES">Hola, ese es el idioma español.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'Italian woman' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Italian woman', 'it-IT'),
                says: '<voice name="Carla">Here\'s what an Italian woman sounds like: <lang xml:lang="it-IT">Ciao, questa è la lingua italiana.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_f: 'Japanese woman' }),
                    'country_f', LIST_OF_COUNTRIES_F, 'Japanese woman', 'ja-JP'),
                says: '<voice name="Mizuki">Here\'s what a Japanese woman sounds like: <lang xml:lang="ja-JP">こんにちは、それは日本語のように聞こえる.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'Australian man' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Australian man', 'en-AU'),
                says: '<voice name="Russell">Here\'s what an Australian man sounds like: <lang xml:lang="en-AU">Hi there, this is what the English language sounds like.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'British man' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'British man', 'en-GB'),
                says: '<voice name="Brian">Here\'s what a British man sounds like: <lang xml:lang="en-GB">Hi there, this is what the English language sounds like.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'German man' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'German man', 'de-DE'),
                says: '<voice name="Hans">Here\'s what a German man sounds like: <lang xml:lang="de-DE">Hallo, so klingt die deutsche Sprache.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'Spanish man' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Spanish man', 'es-ES'),
                says: '<voice name="Enrique">Here\'s what a Spanish man sounds like: <lang xml:lang="es-ES">Hola, ese es el idioma español.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'Italian man' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Italian man', 'it-IT'),
                says: '<voice name="Giorgio">Here\'s what an Italian man sounds like: <lang xml:lang="it-IT">Ciao, questa è la lingua italiana.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'Japanese man' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'Japanese man', 'ja-JP'),
                says: '<voice name="Takumi">Here\'s what a Japanese man sounds like: <lang xml:lang="ja-JP">こんにちは、それは日本語のように聞こえる.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionToRequest(
                    alexaTest.getIntentRequest('CountryIntent', { country_m: 'French man' }),
                    'country_m', LIST_OF_COUNTRIES_M, 'French man', 'fr-FR'),
                says: '<voice name="Mathieu">Here\'s what a French man sounds like: <lang xml:lang="fr-FR">Bonjour, ça sonne comme la langue française.</lang></voice>',
                repromptsNothing: true, shouldEndSession: true,
            },
            {
                request: alexaTest.addEntityResolutionNoMatchToRequest(
                    alexaTest.getIntentRequest('CountryIntent'), 'country_f', LIST_OF_COUNTRIES_F, 'Klingon'),
                says: "I don't know this voice.",
                repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });
});
