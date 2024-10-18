<script>
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

	const url = import.meta.env.VITE_API_BASE_URL + '/cohere';
	console.log(`url:`, url)

	const testConnection = async () => {
		const response = await fetch(url, {
			method: 'GET'
		});
		const data = await response.json();
		console.log(`response:`, data);
	};

	const sendMessage = async () => {
		if (input && !awaitingReplyFromCohere) {
			awaitingReplyFromCohere = true;
			const controller = new AbortController();
			const abortTimer = setTimeout(() => controller.abort(), 10000);

			try {
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ message: input }),
					signal: controller.signal
				});
				clearTimeout(abortTimer);

				const data = await response.json();
				console.log(`response:`, response, data);

				if (!!data?.message?.content?.[0]) {
					const { text } = data.message.content[0];
					if (!text) throw new Error(`AI error: malformed response`);
					// Will the code in this block stop executing if the error is thrown?
					pushMessage({ user: 'You', text: input });
					pushMessage({ user: 'AI', text: text });
					input = '';
				} else {
					throw new Error(`AI error - code:${data.finishReason}`);
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
	<!-- <button on:click={testConnection}>Test Connection</button> -->
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
