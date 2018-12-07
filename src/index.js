'use strict';

const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const dashbot = process.env.DASHBOT_API_KEY ? require('dashbot')(process.env.DASHBOT_API_KEY).alexa : undefined;
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
    exitOnError: false,
});

const utils = require('./utils');

const SKILL_ID = 'amzn1.ask.skill.20b17a96-0109-4bf4-b17e-9a577e88fd83';
const ER_SUCCESS_MATCH = 'ER_SUCCESS_MATCH';
const ER_SUCCESS_NO_MATCH = 'ER_SUCCESS_NO_MATCH';

const languageStrings = {
    de: {
        translation: {
            HELP_MESSAGE: 'Ich kann mit verschiedenen weiblichen und männlichen Stimmen in unterschiedlichen Sprachen reden, z.B. als Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Spanier oder Spanierin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin. Welche Stimme soll ich benutzen?',
            HELP_REPROMPT: 'Welche Nationalität soll ich benutzen: Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Spanier oder Spanierin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin?',
            STOP_MESSAGE: '<say-as interpret-as="interjection">bis dann</say-as>.',
            NATIONALITY_FEMALE: 'So klingt es wenn eine %s spricht',
            NATIONALITY_MALE: 'So klingt es wenn ein %s spricht',
            WHICH_NATIONALITY: 'Als wer soll ich reden?',
            UNKNOWN_COUNTRY: 'Ich kenne diese Nationalität leider nicht.',
            NOT_UNDERSTOOD_MESSAGE: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
        },
    },
    en: {
        translation: {
            HELP_MESSAGE: 'I can talk with various female and male voices in different languages, e.g. as German man/woman, American man/woman, Australian man/woman, British man/woman, Indian woman, Italian man/woman, French man/woman. Which voice should I use?',
            HELP_REPROMPT: 'Which voice should I use: German man/woman, American man/woman, Australian man/woman, British man/woman, Indian woman, Italian man/woman, French man/woman?',
            STOP_MESSAGE: 'See you soon!',
            NATIONALITY_FEMALE: "Here's what a %s sounds like",
            NATIONALITY_MALE: "Here's what a %s sounds like",
            WHICH_NATIONALITY: 'Which voice should I use?',
            UNKNOWN_COUNTRY: "I don't know this voice.",
            NOT_UNDERSTOOD_MESSAGE: 'Sorry, I don\'t understand. Please say again?',
        },
    },
    fr: {
        translation: {
            HELP_MESSAGE: 'Ich kann mit verschiedenen weiblichen und männlichen Stimmen in unterschiedlichen Sprachen reden, z.B. als Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Italiener oder Italienerin, Franzose oder Französin. Welche Stimme soll ich benutzen?',
            HELP_REPROMPT: 'Welche Nationalität soll ich benutzen: Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin?',
            STOP_MESSAGE: '<say-as interpret-as="interjection">bis dann</say-as>.',
            NATIONALITY_FEMALE: "Here's what a %s sounds like",
            NATIONALITY_MALE: "Here's what a %s sounds like",
            WHICH_NATIONALITY: 'Als wer soll ich reden?',
            UNKNOWN_COUNTRY: 'Ich kenne diese Nationalität leider nicht.',
            NOT_UNDERSTOOD_MESSAGE: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
        },
    },
    it: {
        translation: {
            HELP_MESSAGE: 'Ich kann mit verschiedenen weiblichen und männlichen Stimmen in unterschiedlichen Sprachen reden, z.B. als Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Italiener oder Italienerin, Franzose oder Französin. Welche Stimme soll ich benutzen?',
            HELP_REPROMPT: 'Welche Nationalität soll ich benutzen: Deutscher oder Deutsche, Amerikaner oder Amerikanerin, Australier oder Australierin, Brite oder Britin, Inderin, Italiener oder Italienerin, Japaner oder Japanerin, Franzose oder Französin?',
            STOP_MESSAGE: '<say-as interpret-as="interjection">bis dann</say-as>.',
            NATIONALITY_FEMALE: "Here's what a %s sounds like",
            NATIONALITY_MALE: "Here's what a %s sounds like",
            WHICH_NATIONALITY: 'Als wer soll ich reden?',
            UNKNOWN_COUNTRY: 'Ich kenne diese Nationalität leider nicht.',
            NOT_UNDERSTOOD_MESSAGE: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
        },
    },
};

function getCountryRPA(slot) {
    const rpa = slot
        && slot.resolutions
        && slot.resolutions.resolutionsPerAuthority[0];
    if (rpa) {
        switch (rpa.status.code) {
        case ER_SUCCESS_NO_MATCH:
            break;

        case ER_SUCCESS_MATCH:
            if (rpa.values.length > 1) {
                logger.error('multiple matches for ' + slot.value);
            }
            return rpa.values[0].value;

        default:
            logger.error('unexpected status code ' + rpa.status.code);
        }
    }
    return undefined;
}

const CountryIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'CountryIntent';
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const slots = request.intent && request.intent.slots;
        if (!slots) {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('WHICH_NATIONALITY'))
                .reprompt(requestAttributes.t('HELP_REPROMPT'))
                .getResponse();
        }
        logger.debug('country slots f/m', slots.country_f, slots.country_m);

        const country_f = getCountryRPA(slots.country_f);
        const country_m = getCountryRPA(slots.country_m);

        logger.info('country f/m value', country_f || country_m);
        if (!country_f && !country_m) {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('UNKNOWN_COUNTRY'))
                .getResponse();
        } else if (country_f) {
            return handlerInput.responseBuilder
                .speak(utils.getFemaleSpeechOutputFor(requestAttributes.t('NATIONALITY_FEMALE', country_f.name), country_f.id))
                .getResponse();
        }
        return handlerInput.responseBuilder
            .speak(utils.getMaleSpeechOutputFor(requestAttributes.t('NATIONALITY_MALE', country_m.name), country_m.id))
            .getResponse();
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'LaunchRequest'
            || (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent');
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('HELP_MESSAGE'))
            .reprompt(requestAttributes.t('HELP_REPROMPT'))
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        logger.debug('request', request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('STOP_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        try {
            if (request.reason === 'ERROR') {
                logger.error(request.error.type + ': ' + request.error.message);
            }
        } catch (err) {
            logger.error(err.stack || err.toString(), request);
        }

        logger.debug('session ended', request);
        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const { request } = handlerInput.requestEnvelope;
        logger.error(error.stack || error.toString(), request);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechOutput = requestAttributes.t('NOT_UNDERSTOOD_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true,
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = (...args) => {
            return localizationClient.t(...args);
        };
    },
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        CountryIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withSkillId(SKILL_ID)
    .lambda();
if (dashbot) exports.handler = dashbot.handler(exports.handler);
