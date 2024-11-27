export const useGetUser = () => {
    async function getUser(user = null) {
        if (user) return user;

        const token = localStorage.getItem('access_token')

        await axios.get('/auth/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log(res);
            user = res.data
        })
        .catch((err) => {
            console.log(err);
        })

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        console.log(user, 'user');
        return user
    }

    return { getUser }
}