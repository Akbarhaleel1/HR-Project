import {PrettyChatWindow} from 'react-chat-engine-pretty'

const ChatsPage = (props) => {
const sendMessageToServer = async (message) => {
  await axios.post('http://localhost:3001/store-message', message);
};

  return (
    <div style={{height:'100vh'}}>
      <PrettyChatWindow
            projectId='3c0cc79b-f720-4cc5-aaf5-c770582e6bc3'
            username={props.user.username}
            secret={props.user.secret}
            style={{height:'100%'}}
      />
    </div>
  )
}

export default ChatsPage
