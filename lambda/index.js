/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const axios=require('axios');
const script=require('./scripting.js')


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {

        return handlerInput.responseBuilder
            .speak(script.launch[0])
            .reprompt(script.launch[0])
            .getResponse();
    }
};

// Function to collect script randomly
function pluck (arr) { 
 const randIndex = Math.floor(Math.random() * arr.length); 
 return arr[randIndex]; 
}


const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {

        return handlerInput.responseBuilder
            .speak(script.hello[0])
            .reprompt(script.hello[0])
            .getResponse();
    }
};

let weatherinfo='';

const OrderProductandWeatherIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OrderProductandWeatherIntent';
    },
    async handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots; 
        const city=slots.City.value;
        const responce= await axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=77af052038c15c2ca530a33e81901ee6&units=metric`)
        weatherinfo=responce.data.main.temp;
        console.log(weatherinfo);
        const speech=[`Temperature of ${city} is ${weatherinfo} degree Centigrade.Weather is dry and cool wind. My suggestion is tea, Coffee and kehwa is good in this weather`,
        `Temperature of ${city} is ${weatherinfo} degree Centigrade.Weather is dry and normal cozzy. My suggestion is tea, Coffee and kehwa is good in this weather`,
        `Temperature of ${city} is ${weatherinfo} degree Centigrade.outside Weather is hot. My suggestion is juice, cold drink , soda and cheeled water`]
        
        
    
        
        if(city){
           if(Number(weatherinfo)<=20){
               
               return handlerInput.responseBuilder
                    .speak(speech[0])
                    .reprompt(speech[0])
                    .getResponse();
           } 
           else if(Number(weatherinfo)<=30){
               
               return handlerInput.responseBuilder
                    .speak(speech[1])
                    .reprompt(speech[1])
                    .getResponse();
           } 
           else if(Number(weatherinfo)<=40){
               
               return handlerInput.responseBuilder
                    .speak(speech[2])
                    .reprompt(speech[2])
                    .getResponse();
           } 
           else{
            return handlerInput.responseBuilder
                .speak(`Temperature is too hot please any time you need to hydrated`)
                .reprompt(`Default checking`)
                .getResponse();
           } 

        }
        
    }
};

const OrderDrinkandDishesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OrderDrinkandDishesIntent';
    },
    handle(handlerInput) {
        const slots=handlerInput.requestEnvelope.request.intent.slots;
        const drinks=slots.drink.value;
        const foods=slots.food.value;
        let orderspeek="";
        if(weatherinfo){
            
            orderspeek=`Thank you for ordering ${drinks} and ${foods}`
            return handlerInput.responseBuilder
            .speak(orderspeek)
            .reprompt(orderspeek)
            .getResponse();
            
            
            

        }else{
            return handlerInput.responseBuilder
                .speak(`please tell me city name. It's required, then i will suggest you to drinks and dishes`)
                .reprompt(`please tell me city name. It's required, then i will suggest you to drinks and dishes`)
                .getResponse();
            
        }
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        OrderProductandWeatherIntentHandler,
        OrderDrinkandDishesIntentHandler,
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();