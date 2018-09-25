const { combineReducers, createStore } = Redux;
const { Component } = React;

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            if (!action.text == '') {
                return {
                    id: action.id,
                    text: action.text,
                    completed: false
                };
            }
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map( t => todo(t, action) );
        default:
            return state;
    }
};

const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const todoApp = combineReducers({
    todos,
    visibilityFilter
});

const store = createStore(todoApp);

const FilterLink = ({
                        filter,
                        children
                    }) => {
    return ( <a href = "#"
                onClick = {
                    e => {
                        e.preventDefault();
                        store.dispatch({
                            type: "SET_VISIBILITY_FILTER",
                            filter
                        });
                    }
                }>
            { children }
        </a>
    );
};

const getVisibleTodos = (
    todos,
    filter
) => {
    switch (filter) {
        case "SHOW_ALL":
            return todos;
        case "SHOW_COMPLETED":
            return todos.filter( t => t.completed );
        case "SHOW_ACTIVE":
            return todos.filter( t => !t.completed );
    }
};

let nextTodoId = 0;

class TodoApp extends Component {
    render() {
        const noTodos = "There are no todos here...";

        const visibleTodos = getVisibleTodos(
            this.props.todos,
            this.props.visibilityFilter
        );

        return ( <div className = "todoApp">
                <div className="form">
                    <input ref = {
                        node => {
                            this.input = node;
                        }}/>
                    <button type="button" onClick = {() => {
                        store.dispatch({
                            type: 'ADD_TODO',
                            text: this.input.value,
                            id: nextTodoId++
                        });
                        this.input.value = '';
                    }}>
                        Add Todo
                    </button>
                </div>
                <ul>{ visibleTodos.length> 0 ? null : <li className = "no-todos">{ noTodos }</li> }
                    { visibleTodos.map(todo =>
                        <li key={ todo.id }
                            onClick={() => {
                                store.dispatch({
                                    type: 'TOGGLE_TODO',
                                    id: todo.id
                                });
                            }}
                            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            { todo.text }
                        </li>
                    )}
                </ul>
                <p>
                    Show: {
                    ' '
                } <FilterLink filter = "SHOW_ALL">
                    All </FilterLink> {
                    ' '
                } <FilterLink filter = "SHOW_ACTIVE">
                    Active </FilterLink> {
                    ' '
                } <FilterLink filter = "SHOW_COMPLETED">
                    Completed </FilterLink> </p> </div>
        );
    }
}

const render = () => {
    ReactDOM.render( <TodoApp {...store.getState() } />,
        document.getElementById('root') );
};

store.subscribe(render);
render();
