'use strict';

const Alexa = require('ask-sdk-core');
const i18next = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
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
            NATIONALITY: 'So klingt es wenn %s spricht',
            WHICH_NATIONALITY: 'Als wer soll ich reden?',
            UNKNOWN_COUNTRY: 'Ich kenne diese Nationalität leider nicht.',
            NOT_UNDERSTOOD_MESSAGE: 'Entschuldigung, das verstehe ich nicht. Bitte wiederhole das?',
        },
    },
    en: {
        translation: {
            HELP_MESSAGE: 'I can talk with various female and male voices in different languages, e.g. as German man or woman, American man or woman, Australian man or woman, British man or woman, Indian woman, Spanish man or woman, Italian man or woman, Japanese man or woman, French man or woman. Which voice should I use?',
            HELP_REPROMPT: 'Which voice should I use: German man or woman, American man or woman, Australian man or woman, British man or woman, Indian woman, Spanish man or woman, Italian man or woman, Japanese man or woman, French man or woman?',
            STOP_MESSAGE: 'See you soon!',
            NATIONALITY: "Here's what %s sounds like",
            WHICH_NATIONALITY: 'Which voice should I use?',
            UNKNOWN_COUNTRY: "I don't know this voice.",
            NOT_UNDERSTOOD_MESSAGE: 'Sorry, I don\'t understand. Please say again?',
        },
    },
};
i18next.use(sprintf).init({
    overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
    resources: languageStrings,
    returnObjects: true,
});

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

function getNationality(requestAttributes, locale, name, isFemale) {
    if (locale.startsWith('de')) {
        name = (isFemale ? 'eine ' : 'ein ') + name;
    } else if (locale.startsWith('en')) {
        name = (name.match(/^[aAeEiIoOuU]/) ? 'an ' : 'a ') + name;
    }
    return requestAttributes.t('NATIONALITY', name);
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
        var speechOutput;
        if (!country_f && !country_m) {
            logger.error('unknown country', slots);
            speechOutput = requestAttributes.t('UNKNOWN_COUNTRY');
        } else if (country_f) {
            speechOutput =
                utils.getFemaleSpeechOutputFor(
                    getNationality(requestAttributes, request.locale, country_f.name, true),
                    country_f.id);
        } else {
            speechOutput =
                utils.getMaleSpeechOutputFor(
                    getNationality(requestAttributes, request.locale, country_m.name, false),
                    country_m.id);
        }
        logger.info(speechOutput);
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    },
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
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
        i18next.changeLanguage(Alexa.getLocale(handlerInput.requestEnvelope));

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = (...args) => {
            return i18next.t(...args);
        };
    },
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        CountryIntentHandler,
        FallbackIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withSkillId(SKILL_ID)
    .lambda();
