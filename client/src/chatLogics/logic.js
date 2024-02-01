export const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  }

// export const isSameAsSender=(messages,index,user)=>{
//   return messages[index].sender._id===user._id
// }
export const formatMessageTime = (timestamp) => {
  console.log('time',timestamp)
  const messageTime = new Date(timestamp);
  return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};