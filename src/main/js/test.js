class Header extends React.Component {
    render() {
        return (
            <header className="header">
                <h1>Todo List (React only)</h1>
                <h3>All To-Do {this.props.countTodo}</h3>
            </header>
        )
    }
}

class Form extends React.Component {
    render() {
        return (
            <form className="form">
                <input type="text" className="form__input"
                       placeholder="Add todo" onChange={this.props.handleChange} value={this.props.todoValue}/>
                <button className="form__button" type="submit" onClick={this.props.handleClick}>╋</button>
                <Todo todos={this.props.todos} handleToggle={this.props.handleToggle}
                      handleDelete={this.props.handleDelete}/>
            </form>
        )
    }
}

class Todo extends React.Component {
    render() {
        return (
            <ul className="todos-list">
                {
                    this.props.todos.map((item) => {
                        return (
                            <li className="todo-item" key={item.id} onClick={() =>                 this.props.handleToggle(item.id)}>
                                <span className={item.done ? "todo-item__name disabled" : "todo-item__name"}>{item.text}</span>
                                <span className="todo-item__delete-button" onClick={() => this.props.handleDelete(item.id)}>×</span>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

class Footer extends React.Component {

    isActive = (text) => {
        let filter = this.props.filter === text ? "active" : "";
        return `footer__button ${filter}`
    }

    render() {
        return (
            <footer className="footer">
                <Button className={this.isActive}  text="All" setActiveFilter={this.props.setActiveFilter} />
                <Button className={this.isActive} text="Active" setActiveFilter={this.props.setActiveFilter}/>
                <Button className={this.isActive}  text="Complited" setActiveFilter={this.props.setActiveFilter}/>
                <ButtonDelete className={"footer__button"} deleteCompleted={this.props.deleteCompleted} text="Delete completed"  />
            </footer>
        )
    }
}

const ButtonDelete = ({text, className, deleteCompleted}) => {
    return <button className={`${className} delete-completed`} onClick={() => deleteCompleted()}>{text}</button>
}

const Button = ({className, text, setActiveFilter}) => {
    return <button className={className(text)} onClick={() => setActiveFilter(text)}>{text}</button>
}


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            todoValue: "",
            filterType: "All",
            todos: [],
        }
    }

    handleChange = (event) => {
        this.setState({
            todoValue: event.target.value,
        })
    }

    handleClick = (event) => {
        event.preventDefault();
        if (this.state.todoValue !== "") {
            const todo = {
                id: Date.now(),
                text: this.state.todoValue,
                done: false,
            }
            this.setState({
                todoValue: "",
                todos: [todo, ...this.state.todos],
            })
        }
    }

    handleToggle = (id) => {
        this.setState((prevState) => {
            return {
                todos: prevState.todos.map((item, i) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            done: !prevState.todos[i].done,
                        }
                    }
                    return item;
                })
            }
        })
    }

    handleDelete = (id) => {
        this.setState({
            todos: this.state.todos.filter(item => item.id !== id)
        })
    }

    deleteCompleted = () => {
        this.setState({
            todos: this.state.todos.filter(item => !item.done)
        })
    }

    getVisibleTodos = () => {
        const filterType = this.state.filterType;
        let filterState = null;
        switch (filterType) {
            case "Complited":
                return filterState = this.state.todos.filter(item => item.done);
            case "Active":
                return filterState = this.state.todos.filter(item => !item.done);
            default:
                return filterState = this.state.todos;
        }
    }

    setActiveFilter = (text) => {
        this.setState({
            filterType: text,
        })
    }

    render() {
        return (
            <div className="container">
                <Header countTodo={this.state.todos.length}/>
                <Form handleDelete={this.handleDelete}
                      handleToggle={this.handleToggle}
                      handleClick={this.handleClick}
                      handleChange={this.handleChange}
                      todoValue={this.state.todoValue}
                      todos={this.getVisibleTodos()}/>
                <Footer setActiveFilter={this.setActiveFilter}
                        deleteCompleted={this.deleteCompleted}
                        filter={this.state.filterType}/>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("todo"))