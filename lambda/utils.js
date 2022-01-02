'use strict';

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

const femaleVoiceNames = {
    'en-US': [
        'Ivy', 'Joanna', 'Kendra', 'Kimberly', 'Salli',
    ],
    'en-AU': [
        'Nicole',
    ],
    'en-GB': [
        'Amy', 'Emma',
    ],
    'en-IN': [
        'Aditi', 'Raveena',
    ],
    // No names for 'en-CA' yet.
    'de-DE': [
        'Marlene', 'Vicki',
    ],
    'es-ES': [
        'Conchita',
    ],
    'it-IT': [
        'Carla',
    ],
    'ja-JP': [
        'Mizuki',
    ],
    'fr-FR': [
        'Celine', 'Lea',
    ],
};

const maleVoiceNames = {
    'en-US': [
        'Joey', 'Justin', 'Matthew',
    ],
    'en-AU': [
        'Russell',
    ],
    'en-GB': [
        'Brian',
    ],
    // No male names for 'en-IN' yet.
    // No names for 'en-CA' yet.
    'de-DE': [
        'Hans',
    ],
    'es-ES': [
        'Enrique',
    ],
    'it-IT': [
        'Giorgio',
    ],
    'ja-JP': [
        'Takumi',
    ],
    'fr-FR': [
        'Mathieu',
    ],
};

var exports = module.exports = {};

function getSpeechOutputFor(nationality, lang, voiceNames) {
    if (voiceNames[lang]) {
        const voiceName = voiceNames[lang][Math.floor(Math.random() * voiceNames[lang].length)];
        var hello;
        if (lang.startsWith('de')) {
            hello = 'Hallo, so klingt die deutsche Sprache.';
        } else if (lang.startsWith('en')) {
            hello = 'Hi there, this is what the English language sounds like.';
        } else if (lang.startsWith('es')) {
            hello = 'Hola, ese es el idioma español.';
        } else if (lang.startsWith('it')) {
            hello = 'Ciao, questa è la lingua italiana.';
        } else if (lang.startsWith('ja')) {
            hello = 'こんにちは、それは日本語のように聞こえる.';
        } else if (lang.startsWith('fr')) {
            hello = 'Bonjour, ça sonne comme la langue française.';
        } else {
            logger.error('unsupported language ' + lang);
            hello = '???';
        }
        return '<voice name="' + voiceName + '">' + nationality + ': <lang xml:lang="' + lang + '">' + hello + '</lang></voice>';
    }
    logger.error('lang not found: ' + lang);
};

exports.getFemaleSpeechOutputFor = (nationality, lang) => {
    return getSpeechOutputFor(nationality, lang, femaleVoiceNames);
};

exports.getMaleSpeechOutputFor = (nationality, lang) => {
    return getSpeechOutputFor(nationality, lang, maleVoiceNames);
};
