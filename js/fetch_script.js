(function () {
	// 重写 fetch
	const originalFetch = window.fetch;
	window.fetch = async function (resource, options) {
		const response = await originalFetch(resource, options);
		if (
			(resource.includes("/backend-api/sentinel/chat-requirements") ||
				resource.includes("backend-anon/sentinel/chat-requirements")) &&
			options.method === "POST"
		) {
			const clonedResponse = response.clone();
			clonedResponse
				.json()
				.then((data) => {
					const difficulty = data.proofofwork
						? data.proofofwork.difficulty
						: "N/A";
					const persona = data.persona || "N/A";
					window.postMessage({
						'difficulty': difficulty,
						'persona': persona
					}, "*");
				})
				.catch((e) => console.error("Response Error:", e));
		}
		return response;
	};
})();
