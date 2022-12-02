interface UserInterface {
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'user';
    createdDate: string;
    lastLogin: string;
    active: 0 | 1 | 4 | 5;
}

export { UserInterface };
