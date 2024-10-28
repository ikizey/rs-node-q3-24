export const decodeMessage = (message: Buffer) => {
  const messageString = message.toString();
  const messageObject = JSON.parse(messageString);
  try {
    const messageData = JSON.parse(messageObject.data);
    return { type: messageObject.type, data: messageData };
  } catch (error) {
    const messageData = messageObject.data;
    return { type: messageObject.type, data: messageData };
  }
};

export const encodeMessage = ({
  type,
  data,
}: {
  type: string;
  data: object;
}) => {
  const dataString = JSON.stringify(data);
  const messageString = JSON.stringify({ type, data: dataString, id: 0 });
  const messageBuffer = Buffer.from(messageString);
  return messageBuffer;
};
