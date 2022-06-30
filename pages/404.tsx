import { useRouter } from "next/router"
import { useEffect } from "react"

const Custom404 = () => {
    const route = useRouter()
    useEffect(() => {
        route.push('/')
    }, [])
    return (
        <div>Custom404</div>
    )
}

export default Custom404