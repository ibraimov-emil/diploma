import $host from "./index";

export const createChat = async (data) => {
    const {res} = await $host.post('chats', data)
    return res
}

//получить участников чата
export const chatUsers = async (id) => {
    const {data} = await $host.get('chats/' + id + '/participants')
    return data
}

export const userChats = async () => {
    const {data} = await $host.get('chats/')
    return data
}

export const deleteOneClient = async (id) => {
    const {data} = await $host.delete('clients/' + id)
    return data
}

export const getMessages = (id) => {
    return  $host.get('/chats/' + id + '/messages')

}

export const addMessage = (message) => {
    // const {data} =
    return $host.post('/chats/' + message.chatId + '/messages', message)
}