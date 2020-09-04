const mongo = require('mongodb');
const client = new mongo.MongoClient('mongodb://localhost:27017', {
    useNewUrlParser: true
})

function deleteTodo(todosCollection, id){
    todosCollection.deleteOne({
        _id: mongo.ObjectID(id)
    }, err => {
        if (err) {
            console.log('Błąd podczas usuwania!');
        } else {
            console.log('Zadanie usunięte');
        }

        client.close();
    })
}

function doneTodos(todosCollection, id) {
    todosCollection.updateOne({
        _id: mongo.ObjectID(id)
    }, {
        $set: {
            done: true,
        },
    }, err => {
        if (err) {
            console.log('Błąd podczas zmiany statusu!');
        } else {
            console.log('Status zmieniony.');
        }

        client.close();
    })
}

function showAllToDos(todosCollection) {
    todosCollection.find({}).toArray((err, todos) => {
        if (err) {
            console.log('Błąd podczas pobierania!', err);
        } 
            else {
            const todoActive = todos.filter(todo => !todo.done);
            const todoDone = todos.filter(todo => todo.done);

            console.log('Aktywne zadania:', todoActive.length ? todoActive.length : 'Hura, nie masz nic do zrobienia ');
            for (const todo of todoActive) {
                console.log(` ${todo._id}  - ${todo.title} `);
            }
            console.log('Zakończone zadania:', todoDone.length);
            for (const todo of todoDone) {
                console.log(` ${todo.title}`);
            }
        }
        client.close()
    })
}

function addNewTodo(todosCollection, title) {
    todosCollection.insertOne({
        title,
        done: false,
    }, err => {
        if (err) {
            console.log('Błąd podczas dodawania!', err);
        } else {
            console.log('Zadanie dodane.');
        }

        client.close();
    });
}

function doTheToDo(todosCollection) {
    const [command, ...args] = process.argv.splice(2);
    console.log(command, args);

    switch (command) {
        case 'add':
            addNewTodo(todosCollection, args[0]);
            break;
        case 'list':
            showAllToDos(todosCollection);
            break;
        case 'done':
            doneTodos(todosCollection, args[0]);
            break;
        case 'delete':
            deleteTodo(todosCollection, args[0]);
            break;
    }
    client.close();
}

client.connect(err => {
    if (err) {
        console.log('błąd połączenia', err);
    } else {
        console.log('działa');

        const db = client.db('test');
        const todosCollection = db.collection('todos');
        doTheToDo(todosCollection);



    }
});