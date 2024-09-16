import axios from "axios"
import { useEffect, useState } from "react"


const BuildView = () => {
    const [builds, setBuilds] = useState(null)

    useEffect(() => {
        axios.get('/api/builds')
            .then(res => setBuilds(res.data))
    }, [])

    const latestBuild = builds
        ? builds[builds.length - 1]
        : null

    console.log(latestBuild)

    if (!latestBuild) {
        return <></>
    }

    return (
        <div>
            <h4>Latest build</h4>
            <p>Commit: {latestBuild.commitId}</p>
            <p>User: {latestBuild.githubUsername }</p>
            <p>Status: {latestBuild.status}</p>
        </div>
    )
}

export default BuildView