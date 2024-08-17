import { Signal } from "plicit";
export type User = {
    firstname: string;
    lastname: string;
    age: number;
};
export declare const useFakeDatabase: (props: {
    query: Signal<string>;
    count?: number;
}) => {
    users: Signal<User[]>;
};
