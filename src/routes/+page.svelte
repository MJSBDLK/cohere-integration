<script>
	import axios from 'axios';

	console.warn(`Don't store API keys in the frontend in prod!`);
	const apiKey = import.meta.env.VITE_COHERE_API_KEY; // Working properly

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
				// Make request to the Cohere API:
				console.warn(`Need to install a Cohere library for this:`, `https://docs.cohere.com/reference/about`)
				const response = await axios.post(
					'https://api.cohere.ai/generate',
					{
						model: 'command-r-plus-08-2024',
						prompt: input, // Simply reads from the input
						max_tokens: 50
					},
					{
						headers: {
							Authorization: `Bearer ${apiKey}`,
							'Content-Type': 'application/json'
						}
					}
				);

				console.log(`response.data:`, response.data);

				const responseSuccess = response.data.finish_reason === "COMPLETE"
				const aiResponse = response.data.meta.text;
				if (responseSuccess) {
					pushMessage({ user: 'You', text: input });
					pushMessage({ user: 'AI', text: aiResponse });
					// Only clear the input if the API call succeeds
					input = '';
				} else {
					throw new Error('Robot is down I repeat robot is down');
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
