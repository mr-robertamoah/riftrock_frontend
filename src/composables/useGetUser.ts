export const useGetUser = () => {
    async function getUser(user = null) {
        if (user) return user;
        
        await axios.get('/auth/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then((res) => {
            console.log(res);
            user = res.body
        })
        .catch((err) => {
            console.log(err);
        })

        console.log(user, 'user');
        return user
    }

    return { getUser }
}