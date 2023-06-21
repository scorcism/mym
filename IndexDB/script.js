console.log("Working")


let db;
let dbReq = indexedDB.open('myDatabase', 1);

dbReq.onupgradeneeded = function (event) {


    // Create an object store named notes. Object stores
    // in databases are where data are stored.
    db = event.target.result;

    // Create the notes object store, or retrieve that store if it
    // already exists.
    let notes;
    if (!db.objectStoreNames.contains('notes')) {
        notes = db.createObjectStore('notes', { autoIncrement: true });
    } else {
        notes = dbReq.transaction.objectStore('notes');
    }

    // If there isn't already a timestamp index in our notes object
    // store, make one so we can query notes by their timestamps
    if (!notes.indexNames.contains('timestamp')) {
        notes.createIndex('timestamp', 'timestamp');
    }
}

dbReq.onerror = function (event) {
    alert('error opening database ' + event.target.errorCode);
}

dbReq.onsuccess = function (event) {
    db = event.target.result;
    // Once the database is ready, display the notes we already have!
    getAndDisplayNotes(db);
}

function addStickyNote(db, message) {
    // Start a database transaction and get the notes object store
    let tx = db.transaction(['notes'], 'readwrite');
    let store = tx.objectStore('notes');

    // Put the sticky note into the object store
    let note = { text: message, timestamp: Date.now() };
    store.add(note);

    // Wait for the database transaction to complete
    tx.oncomplete = function () { getAndDisplayNotes(db); }
    tx.onerror = function (event) {
        alert('error storing note ' + event.target.errorCode);
    }
}

dbReq.onsuccess = function (event) {
    db = event.target.result;
    getAndDisplayNotes(db)
    
    // Add some sticky notes
    // addStickyNote(db, 'Sloths are awesome!');
    // addStickyNote(db, 'Order more hibiscus tea');
    // addStickyNote(db, 'And Green Sheen shampoo, the best for sloth fur algae grooming!');
}

function submitNote() {
    // let db = "notes"
    let message = document.getElementById('newmessage');
    addStickyNote(db, message.value);
    message.value = '';
}

// // Set up an object store and transaction
// let tx = db.transaction(['notes'], 'readonly');
// let store = tx.objectStore('notes');

// // Set up a request to get the sticky note with the key 1
// let req = store.get(1);

// // We can use the note if the request succeeds, getting it in the
// // onsuccess handler
// req.onsuccess = function (event) {
//     let note = event.target.result;

//     if (note) {
//         console.log(note);
//     } else {
//         console.log("note 1 not found")
//     }
// }

// // If we get an error, like that the note wasn't in the object
// // store, we handle the error in the onerror handler
// req.onerror = function (event) {
//     alert('error getting note 1 ' + event.target.errorCode);
// }

function getAndDisplayNotes(db) {
    let tx = db.transaction(['notes'], 'readonly');
    let store = tx.objectStore('notes');

    // Create a cursor request to get all items in the store, which 
    // we collect in the allNotes array
    let req = store.openCursor();
    let allNotes = [];

    req.onsuccess = function (event) {
        // The result of req.onsuccess in openCursor requests is an
        // IDBCursor
        let cursor = event.target.result;

        if (cursor != null) {
            // If the cursor isn't null, we got an item. Add it to the
            // the note array and have the cursor continue!
            allNotes.push(cursor.value);
            cursor.continue();
        } else {
            // If we have a null cursor, it means we've gotten
            // all the items in the store, so display the notes we got.
            displayNotes(allNotes);
        }
    }

    req.onerror = function (event) {
        alert('error in cursor request ' + event.target.errorCode);
    }
}

function displayNotes(notes) {
    let listHTML = '<ul>';
    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];
        listHTML += '<li>' + note.text + ' ' +
            new Date(note.timestamp).toString() + '</li>';
    }

    document.getElementById('notes').innerHTML = listHTML;
}



// We update the version of the database to 2 to trigger
// onupgradeneeded

// let dbReq = indexedDB.open('myDatabase', 2);
// dbReq.onupgradeneeded = function (event) {
//     db = event.target.result;

//     // Create the notes object store, or retrieve that store if it
//     // already exists.
//     let notes;
//     if (!db.objectStoreNames.contains('notes')) {
//         notes = db.createObjectStore('notes', { autoIncrement: true });
//     } else {
//         notes = dbReq.transaction.objectStore('notes');
//     }

//     // If there isn't already a timestamp index in our notes object
//     // store, make one so we can query notes by their timestamps
//     if (!notes.indexNames.contains('timestamp')) {
//         notes.createIndex('timestamp', 'timestamp');
//     }
// }




