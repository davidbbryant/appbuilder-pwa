import { writable, get } from "svelte/store";
import { setDefaultStorage } from "./storage";
import { refs } from "./scripture";
import { findBookmarkByChapter } from "$lib/data/bookmarks";

function createBookmarks() {
    const {subscribe, set} = writable([]);
    const fetchData = async (item: {
        collection: string;
        book: string;
        chapter: string;
    }) => {
        const foundBookmarks = await findBookmarkByChapter(item);
        console.log(foundBookmarks);
        set(foundBookmarks);
    };

    refs.subscribe(item => {
        fetchData(item);
    });
    
    return {
        subscribe, 
        sync: async () => await fetchData(get(refs))
    };
}
export const bookmarks = createBookmarks();

setDefaultStorage('highlights', '[]');
export const highlights = writable(JSON.parse(localStorage.highlights));
highlights.subscribe(value => {
    localStorage.highlights = JSON.stringify(value);
})

setDefaultStorage('notes', '[]');
export const notes = writable(JSON.parse(localStorage.notes));
notes.subscribe(value => {
    localStorage.notes = JSON.stringify(value);
})