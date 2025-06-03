import axios from 'axios'

// TODO rename function
export const getTodos = async () => {
    return (
        // TODO remove static url
        (await axios.get('http://localhost:3001/progress/get-current-progress'))
            .data ?? null
    )
}
