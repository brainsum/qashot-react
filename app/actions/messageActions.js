export function removeAllMessages(message_type) {
  return {
    type: "CLEAR_MESSAGES_FROM",
    payload: message_type,
  }
}

export function removeMessage(id, message_type) {
  return {
    type: "REMOVE_MESSAGE_FROM",
    payload: {
      id: id,
      message_type: message_type,
    },
  }
}