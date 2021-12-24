const SET_MESSAGES = 'SET_MESSAGES';
const CLEAR_MESSAGES = 'CLEAR_MESSAGES';

export const defaultMessages = [];

export function setMessages(messages) {
    return {
        type: SET_MESSAGES,
        messages
    }
}

export function clearMessages() {
    return {
        type: CLEAR_MESSAGES
    }
}

function messages(state=defaultMessages, action) {
    switch (action.type) {
        case SET_MESSAGES:
            return action.messages;
        case CLEAR_MESSAGES:
            return defaultMessages;
        default:
            return state;
    }
}

export default messages;