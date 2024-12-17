<script setup>
import {onMounted, ref, watch} from 'vue';
import Pusher from 'pusher-js';
import {useChatStore} from "@/stores/chatStore.js";
import {useUserStore} from "@/stores/userStore.js";

const chatStore = useChatStore();
const userStore = useUserStore();
const messageInput = ref('');
const messagesContainer = ref(null);

function formatDate(date) {
  const createdAt = new Date(date);
  return createdAt.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

const sendMessage = async () => {
  await chatStore.sendMessage(messageInput.value);
  messageInput.value = '';
};

onMounted(async () => {
  await chatStore.getChat();
  await chatStore.getMessages();
  Pusher.logToConsole = true;
  const pusher = new Pusher('0c48b8eef40cc5d2451b', {
    cluster: 'eu',
  });

  const channel = pusher.subscribe(`chat.${chatStore.chatId}`);
  channel.bind('App\\Events\\SendMessageEvent', (data) => {
    chatStore.pushMessage(data.message);
  });

  scrollToBottom();
});

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(() => chatStore.messages, scrollToBottom, {deep: true});
</script>

<template>
  <div class="chat-container">
    <div ref="messagesContainer" class="messages" v-if="chatStore.messages.length > 0">
      <div
          v-for="message in chatStore.messages"
          :key="message.id"
          class="message"
          :class="message.sender_id === chatStore.clientId ?  'manager':'client'"
      >
        <div class="message-header">
          <span class="prefix">
            {{ message.sender_id === chatStore.clientId ?  'Ви' :'Менеджер' }}
          </span>
          <span class="timestamp">{{ formatDate(message.created_at) }}</span>
        </div>
        <p class="message-content">{{ message.message }}</p>
      </div>
    </div>
    <v-alert v-else type="info" icon="" class="no-messages-alert">No messages</v-alert>
    <div class="message-input">
      <textarea v-model="messageInput" placeholder="Type a message..."></textarea>
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>
