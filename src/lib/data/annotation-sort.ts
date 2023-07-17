export const SORT_DATE = 1;
export const SORT_REFERENCE = 2;
export const SORT_COLOR = 3;

export function compareReference(a, b) {
    if (a.bookIndex > b.bookIndex) {
        return 1;
    } else if (a.bookIndex < b.bookIndex) {
        return -1;
    } else if (parseInt(a.chapter) > parseInt(b.chapter)) {
        return 1;
    } else if (parseInt(a.chapter) < parseInt(b.chapter)) {
        return -1;
    } else if (parseInt(a.verse) > parseInt(b.verse)) {
        return 1;
    } else {
        return -1;
    }
}

export function compareDate(a, b) {
    if (a.date < b.date) {
        return 1;
    } else {
        return -1;
    }
}

export function toSorted(items, sortType) {
    if (sortType === SORT_REFERENCE) {
        return items.toSorted(compareReference);
    } else if (sortType === SORT_DATE) {
        return items.toSorted(compareDate);
    }
    return items;
}
