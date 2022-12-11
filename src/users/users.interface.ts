interface User {
    username: string;
    email: string;
    password: string;
    role: 55 | 44 | 33;
    createdDate: string;
    active: 0 | 1 | 4 | 5;
}

interface UserDB {
    id: number;
    username: string;
    email: string;
    password: string;
    role: 55 | 44 | 33;
    created_date: string;
    active: 0 | 1 | 4 | 5;
}

export { User, UserDB };
