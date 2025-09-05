import { useMemo } from 'react';
import {
  type ReceivedChatMessage,
  type TextStreamData,
  useChat,
  useRoomContext,
  useTranscriptions,
} from '@livekit/components-react';
import { transcriptionToChatMessage } from '@/lib/utils';

export default function useChatAndTranscription() {
  // console.log('useChatAndTranscription start');
  const transcriptions: TextStreamData[] = useTranscriptions();
  const chat = useChat();
  const room = useRoomContext();

  let allmessages = '';
  transcriptions.forEach((transcription) => {
    if (transcription.participantInfo.identity == room.localParticipant.identity) {
      allmessages += transcription.text + ' ';
    }
  });
  // console.log(allmessages);

  const mergedTranscriptions = useMemo(() => {
    const merged: Array<ReceivedChatMessage> = [
      ...transcriptions.map((transcription) => transcriptionToChatMessage(transcription, room)),
      ...chat.chatMessages,
    ];
    return merged.sort((a, b) => a.timestamp - b.timestamp);
  }, [transcriptions, chat.chatMessages, room]);

  // console.log(chat.chatMessages);
  // console.log(mergedTranscriptions);
  // mergedTranscriptions.forEach((entry) => {
  //   const isUser = entry.from?.isLocal ?? false;
  //   if (isUser) {
  //     console.log(entry.message);
  //   }
  // });
  // const messageOrigin = isUser ? 'remote' : 'local';

  return { allmessages: allmessages, messages: mergedTranscriptions, send: chat.send };
}
