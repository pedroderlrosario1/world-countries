const Alexa = require('ask-sdk-core')
const axios = require('axios')

async function getCountryData(country, key) {
  const url = `https://api.ipgeolocationapi.com/countries`
  const response = await axios.get(url)

  console.log(response.data)

  const foundCountry = Object.values(response.data).find((countryObject) => {
    return countryObject.name === country
  })

  return foundCountry[key]
}

const CountriesIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'CountriesIntent'
  },
  async handle(handlerInput) {
    const country = handlerInput.requestEnvelope.request.intent.slots.Country.value
    const continent = await getCountryData(country, 'continent')

    const answer = `${country} is in ${continent},`
    const reprompt = 'Would you like the continent of another country?'

    return handlerInput.responseBuilder
      .speak(answer + reprompt)
      .reprompt(reprompt)
      .withShouldEndSession(false)
      .getResponse()
  }
}

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .withShouldEndSession(true)
      .getResponse()
  }
}
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle(handlerInput) {
    const guidance = 'World countries can provide you in what continent is a particular country in. For example you can ask "where is American Samoa?"'
    const reprompt = 'What country information would you like?'

    return handlerInput.responseBuilder
      .speak(guidance + reprompt)
      .reprompt(reprompt)
      .withShouldEndSession(false)
      .getResponse()
  }
}

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
  },
  handle(handlerInput) {
    const guidance = 'Sorry, I did not understand what country you asked for.'
    const reprompt = 'What country information would you like?'


    return handlerInput.responseBuilder
      .speak(guidance + reprompt)
      .reprompt(reprompt)
      .withShouldEndSession(false)
      .getResponse()
  }
}

const NavigateHomeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NavigateHomeIntent'
  },
  handle(handlerInput) {
    const homeText = 'Welcome to World Countries.'
    const reprompt = 'What country information would you like?'


    return handlerInput.responseBuilder
      .speak(homeText + reprompt)
      .reprompt(reprompt)
      .withShouldEndSession(false)
      .getResponse()
  }
}
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle(handlerInput) {
    const guidance = 'Welcome to World Countires. We can provide you in what continent is a particular country in. For example you can ask "where is American Samoa?"'
    const reprompt = 'What country information would you like?'

    return handlerInput.responseBuilder
      .speak(guidance + reprompt)
      .reprompt(reprompt)
      .withShouldEndSession(false)
      .getResponse()
  }
}

const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput) {
    const guidance = 'Sorry, we were not able to get the continent for that country.'
    const reprompt = 'Would you like to ask again?'

    return handlerInput.responseBuilder
      .speak(guidance + reprompt)
      .reprompt(reprompt)
      .withShouldEndSession(false)
      .getResponse()
  }
}

const skillBuilder = Alexa.SkillBuilders.custom()

exports.handler = skillBuilder
  .addRequestHandlers(
    CountriesIntentHandler,
    CancelAndStopIntentHandler,
    HelpIntentHandler,
    FallbackIntentHandler,
    NavigateHomeIntentHandler,
    LaunchRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda()
