const SET_MESSAGES = 'SET_MESSAGES';

export const defaultMessages = [];

export function setMessages(messages) {
    return {
        type: SET_MESSAGES,
        messages
    }
}

function messages(state=defaultMessages, action) {
    switch (action.type) {
        case SET_MESSAGES:
            return action.messages;
        default:
            return state;
    }
}

export default messages;