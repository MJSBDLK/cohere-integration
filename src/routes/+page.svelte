<script>
	import { Cohere, CohereClientV2 } from 'cohere-ai';
	console.warn(`Don't store API keys in the frontend!`);
	const cohere = new CohereClientV2({
		token: import.meta.env.VITE_COHERE_API_KEY // Working properly
	});

	let input = '';

	/**
	 * @typedef {Object} Message
	 * @property {string} user - Name of sender
	 * @property {string} text - Message content/body
	 * @property {string} [className] - Optional class for custom CSS
	 */

	/**@type {Message[]}*/
	let messages = [];
	/**
	 * Pushes a new message into the messages array.
	 * @param {Message} newMessage
	 * @returns {void}
	 */
	const pushMessage = (newMessage) => {
		messages = [...messages, newMessage];
	};

	let awaitingReplyFromCohere = false;

	const sendMessage = async () => {
		if (input && !awaitingReplyFromCohere) {
			awaitingReplyFromCohere = true;
			try {
				const response = await cohere.chat({
					model: 'command',
					messages: [{ role: 'user', content: input }]
				});

				console.log(`response:`, response);
				//@ts-ignore
				if (response.finishReason === 'COMPLETE') {
					const text = response?.message?.content?.[0]?.text || null;
					if (!text) throw new Error(`AI error: malformed response`);
					// Will the code in this block stop executing if the error is thrown?
					pushMessage({ user: 'You', text: input });
					pushMessage({ user: 'AI', text: text });
					input = '';
				} else {
					throw new Error(`AI error - code:${response.finishReason}`);
				}
			} catch (error) {
				pushMessage({ user: 'AI', text: 'Error connecting to AI', className: 'error-message' });
				console.error(`Error:`, error);
			} finally {
				awaitingReplyFromCohere = false;
			}
		}
		console.log(`messages:`, messages);
	};
</script>

<div class="chat-container">
	<h1>AI Chatbot</h1>
	<div class="chat-window">
		{#each messages as message}
			<p class="{message.user === 'You' ? 'user-message' : 'ai-message'} {message.className}">
				<strong class={message.user === 'You' ? 'user-name' : 'ai-name'}>{message.user}:</strong>
				{message.text}
			</p>
		{/each}
	</div>
	<input
		bind:value={input}
		disabled={awaitingReplyFromCohere}
		on:keydown={(e) => e.key === 'Enter' && sendMessage()}
		placeholder="Talk to the robot..."
	/>
	<button on:click={sendMessage}>Send</button>
</div>

<style>
	.chat-container {
		max-width: 600px;
		margin: 0 auto;
		padding: 1em;
		font-family: Arial, sans-serif;
	}

	.chat-window {
		border: 1px solid #ccc;
		padding: 1em;
		height: 300px;
		overflow-y: scroll;
		margin-bottom: 1em;
	}

	input {
		width: 80%;
		padding: 0.5em;
		margin-right: 0.5em;
	}

	button {
		padding: 0.5em 1em;
	}

	/* #region User and AI messages */
	.user-message {
		text-align: right;
		color: black;
	}
	.ai-message {
		text-align: left;
		color: black;
	}
	.user-name {
		color: purple;
	}
	.ai-name {
		color: green;
	}
	.error-message {
		color: red;
		/* font-style: italic; */
		border: 1px solid red; /* 1px solid border */
		border-radius: 5px; /* Rounded corners */
		padding: 0.5em; /* Padding to space the text from the border */
	}
	/* #endregion /User and AI messages */
</style>
