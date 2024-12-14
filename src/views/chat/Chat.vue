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

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  justify-content: flex-start;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f4f4f4;
}

.message.client {
  background-color: #d1f1d1;
}

.message.manager {
  background-color: #e0e0e0;
}

.message-header {
  font-size: 14px;
  color: #888;
}

.prefix {
  font-weight: bold;
}

.timestamp {
  margin-left: 10px;
}

.message-content {
  font-size: 16px;
}

.no-messages-alert {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
  font-size: 24px; /* Увеличенный размер текста */
  text-align: center;
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: #333;
}

.message-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

textarea {
  width: 80%;
  height: 40px;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
}

button {
  background-color: #1abc9c;
  color: white;
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #16a085;
}
</style>
