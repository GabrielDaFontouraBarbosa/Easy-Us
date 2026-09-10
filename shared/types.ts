export type Message = {
    autor: string,
    texto: string,
    image: string,
    id: string
    hora: string;
}
export type User = {
    username: string;
    avatar: string;
    id: string;
}
export type UserContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}