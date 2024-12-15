import Cookies from 'js-cookie';
const accessToken = Cookies.get("accessToken");

export const login = async ({email, password,role}:{email: string; password: string; role: string;})=>{
    try {

        const res = await fetch('http://localhost:3000/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                role: role
            })

            
        })
        if (res.ok) {
            const data = await res.json(); // Parse the JSON response once

            // Store accessToken and user in localStorage
            Cookies.set("accessToken", data.data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.data.user));

            console.log("Login successful!");
            return data;
        } else {
            // Log the error message from the response
            const errorText = await res.text();
            throw new Error(`Login failed: ${errorText}`);
        }
    } catch (error) {
        console.log(error);
    }
}

export const signup = async ({username,email, password,role}:{username: string; email: string; password: string; role: string;})=>{
    try {
        
        const res = await fetch('http://localhost:3000/api/v1/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                role: role
            })

        })
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export const logout = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/v1/users/logout', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}` 
            },
        })
        return res.json();
    } catch (error) {
        console.log(error);
    }
}


export const deposit = async ({amount,userId}:{amount:string,userId:string}) => {
    try {
        const res = await fetch(`http://localhost:3000/api/v1/users/deposit/${userId}`, {
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}` 

            },
            body: JSON.stringify({
                amount: amount
            })
        })
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export const withdraw = async ({amount,userId}:{amount:string,userId:string}) => {
    try {
        const res = await fetch(`http://localhost:3000/api/v1/users/withdrawal/${userId}`, {
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}` 

            },
            body: JSON.stringify({
                amount: amount
            })
        })
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export const getBalance = async (userId: string) => {
    try {
        

        const res = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
            method: 'GET',
            credentials: 'include', // Required for cookies
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`Error fetching balance: ${res.statusText}`);
        }
        const data =  await res.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error("Error in getBalance:", error);
        throw error;
    }
};

export const AllAccounts = async () => {
    try {
        const res = await fetch(`http://localhost:3000/api/v1/accounts`, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}` 
            },
        })
        return res.json();
    } catch (error) {
        console.log(error);
    }
}


export const SingleAccount = async (userId:string) => {
    try {
        const res = await fetch(`http://localhost:3000/api/v1/accounts/${userId}`, {
            method: 'GET',
            credentials:'include',  
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}` 

            },
        })
        return res.json();
    } catch (error) {
        console.log(error);
    }
}   