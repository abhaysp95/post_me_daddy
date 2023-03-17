import express from 'express';

const app = express()
app.get("/", (_, res) => {
	res.send("A fine response from server").status(200)
})

app.listen('4000', () => {
	console.log("Server started at 127.0.0.1:4000")
})
