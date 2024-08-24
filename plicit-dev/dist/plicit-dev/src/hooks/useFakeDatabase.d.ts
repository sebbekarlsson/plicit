import { Signal } from "plicit";
export type User = {
    firstname: string;
    lastname: string;
    age: number;
    id: string;
};
export type UseFakeDatabase = {
    users: Signal<User[]>;
    totalCount: Signal<number>;
    insertUser: (user: Omit<User, 'id'>) => void;
};
export declare const useFakeDatabase: (props: {
    query: Signal<string>;
    count?: number;
    seed?: number;
}) => UseFakeDatabase;
