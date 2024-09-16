require('dotenv').config()

const body = {
    commitId: process.env.commitId,
    githubUsername: process.env.githubUsername,
    status: process.env.ACTION_STATUS === 'FAIL' ? 'FAIL' : 'OK'
}

console.log(body)

const TARGET_URL = 
    process.env.WORKFLOW_ENV === 'dev'
        ? "http://localhost:5000/api/builds"
        : "https://blogilista.fly.dev/api/builds"

fetch(TARGET_URL, {
    body: JSON.stringify(body),
    headers: {
        "Authorization": `Bearer ${process.env.BUILD_AUTHENTICATION_KEY}`,
        "Content-Type": "application/json"
    },
    method: "POST"
})
    .then(res => {
        if (res.status !== 200) {
            console.error(res)
            throw new Error('Failed!')
        }

        console.log(res)
    })