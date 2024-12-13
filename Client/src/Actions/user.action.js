export const login = async ({email="himasnhu@gmail.com", password="123456"})=>{
    try {

        const res = await fetch('http://localhost:3000/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })

        })
    } catch (error) {
        console.log(error);
    }
}
