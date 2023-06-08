import { openDB, type DBSchema } from "idb";
import config from '$lib/data/config';

export interface BookmarkItem {
    date: number;
    collection: string;
    book: string;
    chapter: string;
    verse: string;
    text: string;
    reference: string;
}
interface Bookmarks extends DBSchema {
    bookmarks: {
        key: number;
        bookIndex: number;
        value: BookmarkItem;
        indexes: { "bookIndex": number, "collection, book, chapter, verse": string };
    };
}

let bookmarkDB = null;
async function openBookmarks() {
    if (!bookmarkDB) {
        bookmarkDB = await openDB<Bookmarks>("bookmarks", 1, {
            upgrade(db) {
                const bookmarkStore = db.createObjectStore("bookmarks", {
                    keyPath: "bookIndex",
                });
        
                bookmarkStore.createIndex("bookIndex", "bookIndex");
                bookmarkStore.createIndex("collection, book, chapter, verse", ["collection", "book", "chapter", "verse"])
            },
        });
    }
    return bookmarkDB;
}

export async function addBookmark(item: {
    collection: string;
    book: string;
    chapter: string;
    verse: string;
    text: string;
    reference: string;
}) {
    let bookmark = await openBookmarks();
    const date = new Date()[Symbol.toPrimitive]('number');
    const bookIndex = config.bookCollections
        .find((x) => x.id === item.collection)
        .books.findIndex((x) => x.id === item.book);
    const nextItem = {...item, key: date, bookIndex: bookIndex};
    await bookmark.add("bookmarks", nextItem);
}

export async function findBookmark(item: {
    collection: string;
    book: string;
    chapter: string;
    verse: string;
}) {
    let bookmark = await openBookmarks();
    bookmark.index("collection, book, chapter, verse").get([item.collection, item.book, item.chapter, item.verse]);
    //should be an object store
    return -1;
}

export async function removeBookmark(key: number) {
    let bookmark = await openBookmarks();
    //await bookmark.delete(key);
    //What are these kinds of functions actually calling? I don't see this in the documentation
}

export async function clearBookmarks() {
    let bookmarks = await openBookmarks();
    await bookmarks.clear("bookmarks");
}

export async function getBookmarks() :Promise<BookmarkItem[]> {
    const bookmarks = await openBookmarks();   
    return await bookmarks.getAllFromIndex("bookmarks", "bookIndex");
}