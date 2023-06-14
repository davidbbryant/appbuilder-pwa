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
    bookIndex: number;
}
interface Bookmarks extends DBSchema {
    bookmarks: {
        key: number;
        value: BookmarkItem;
        indexes: { "collection, book, chapter, verse": string, "collection, book, chapter": string };
    };
}

let bookmarkDB = null;
async function openBookmarks() {
    if (!bookmarkDB) {
        bookmarkDB = await openDB<Bookmarks>("bookmarks", 1, {
            upgrade(db) {
                const bookmarkStore = db.createObjectStore("bookmarks", {
                    keyPath: "date",
                });
        
                bookmarkStore.createIndex("collection, book, chapter, verse", ["collection", "book", "chapter", "verse"])
                bookmarkStore.createIndex("collection, book, chapter", ["collection", "book", "chapter"])
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
    const bookmarks = await openBookmarks();
    const date = new Date()[Symbol.toPrimitive]('number');
    const bookIndex = config.bookCollections
        .find((x) => x.id === item.collection)
        .books.findIndex((x) => x.id === item.book);
    const nextItem = {...item, bookIndex: bookIndex, date: date};
    await bookmarks.add("bookmarks", nextItem);
}

export async function findBookmark(item: {
    collection: string;
    book: string;
    chapter: string;
    verse: string;
}) {
    const bookmark = await openBookmarks();
    const tx = bookmark.transaction("bookmarks", "readonly");
    const index = tx.store.index("collection, book, chapter, verse");
    const result = await index.getAll([item.collection, item.book, item.chapter, item.verse]);
    await tx.done;
    return result[0] ? result[0].key : -1;
}

export async function findBookmarkByChapter(item: {
    collection: string;
    book: string;
    chapter: string;
}) {
    const bookmarks = await openBookmarks();
    const tx = bookmarks.transaction("bookmarks", "readonly");
    const index = tx.store.index("collection, book, chapter");
    const result = await index.getAll([item.collection, item.book, item.chapter]);
    await tx.done;
    return result;
}

export async function removeBookmark(key: number) {
    const bookmarks = await openBookmarks();
    await bookmarks.delete("bookmarks", key);
}

export async function clearBookmarks() {
    const bookmarks = await openBookmarks();
    await bookmarks.clear("bookmarks");
}

export async function getBookmarks() :Promise<BookmarkItem[]> {
    const bookmarks = await openBookmarks();   
    return await bookmarks.getAll("bookmarks");
}