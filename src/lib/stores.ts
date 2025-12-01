import { writable } from 'svelte/store';

export const dRotation = writable(0);

export interface GuestbookEntry {
    id: string;
    name: string;
    message: string;
    date: Date;
    upvotes: number;
    downvotes: number;
}

export const guestbookEntries = writable<GuestbookEntry[]>([
    {
        id: '1',
        name: 'Alice',
        message: 'This is such a cool guestbook!',
        date: new Date('2023-10-27T10:00:00'),
        upvotes: 5,
        downvotes: 0
    },
    {
        id: '2',
        name: 'Bob',
        message: 'I love the 3D effect!',
        date: new Date('2023-10-26T14:30:00'),
        upvotes: 12,
        downvotes: 1
    },
    {
        id: '3',
        name: 'Charlie',
        message: 'Svelte is awesome.',
        date: new Date('2023-10-25T09:15:00'),
        upvotes: 3,
        downvotes: 0
    },
    {
        id: '4',
        name: 'Diana',
        message: 'Can I flip it back and forth forever?',
        date: new Date('2023-10-24T16:45:00'),
        upvotes: 8,
        downvotes: 2
    },
    {
        id: '5',
        name: 'Evan',
        message: 'Hello world!',
        date: new Date('2023-10-23T11:20:00'),
        upvotes: 1,
        downvotes: 0
    }
]);
