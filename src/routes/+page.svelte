<script>
	let input = '';

	/**
	 * @typedef {Object} Message
	 * @property {string} user - Name of sender
	 * @property {string} text - Message content/body
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

	const sendMessage = () => {
		if (input) {
			pushMessage({ user: 'You', text: input });
			// AI Response, simulated for now
			pushMessage({ user: 'AI', text: 'Thinking...' });
			input = '';
		}
		console.log(`messages:`, messages);
	};
</script>

<div class="chat-container">
	<h1>AI Chatbot</h1>
	<div class="chat-window">
		{#each messages as message}
			<p class={message.user === 'You' ? 'user-message' : 'ai-message'}>
				<strong class={message.user === 'You' ? 'user-name' : 'ai-name'}>{message.user}:</strong>
				{message.text}
			</p>
		{/each}
	</div>
	<input
		bind:value={input}
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
	/* #endregion /User and AI messages */
</style>
