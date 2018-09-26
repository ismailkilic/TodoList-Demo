'use strict';


const React = require('react');
const ReactDOM = require('react-dom');

const Col = require('react-bootstrap').Col;
const Divider = require('react-bootstrap').Divider;
const Row = require('react-bootstrap').Row;
const Form = require('react-bootstrap').Form;
const Label = require('react-bootstrap').Label;
const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const FormControl = require('react-bootstrap').FormControl;
const FormGroup = require('react-bootstrap').FormGroup;
const ControlLabel = require('react-bootstrap').ControlLabel;
const Button = require('react-bootstrap').Button;
const InputGroup = require('react-bootstrap').InputGroup;
const Checkbox = require('react-bootstrap').Checkbox;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            todoLists: [],
            newListName: '',
            updatedListName: '',
            todoItemAdderName: [],
            todoItemAdderDescription: [],
            todoItemAdderDeadline: []
        };
        this.handleNewListNameChange = this.handleNewListNameChange.bind(this);
        this.handleUpdatedListNameChange = this.handleUpdatedListNameChange.bind(this);
        this.handleItemAdderNameChange = this.handleItemAdderNameChange.bind(this);
        this.handleItemAdderDescriptionChange = this.handleItemAdderDescriptionChange.bind(this);
        this.handleItemAdderDeadlineChange = this.handleItemAdderDeadlineChange.bind(this);

        this.handleNewList = this.handleNewList.bind(this);
        this.handleDeleteList = this.handleDeleteList.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleNewItem = this.handleNewItem.bind(this);
    }

    componentDidMount() {
        fetch('/lists', {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => {
            return response.json();

        }).then(json => {
            this.setState({
                todoLists: json,
                todoItemAdderName: new Array(json.length).fill(''),
                todoItemAdderDescription: new Array(json.length).fill(''),
                todoItemAdderDeadline: new Array(json.length).fill(moment().format("DD/MM/YYYY"))
            });
        });
    }

    handleItemAdderNameChange(index, name) {
        this.setState(function (prevState, props) {
            let myTodoItemAdders = prevState.todoItemAdderName;
            myTodoItemAdders[index] = name;
            return {
                todoItemAdderName: myTodoItemAdders
            };
        });
    }

    handleItemAdderDescriptionChange(index, name) {
        this.setState(function (prevState, props) {
            let myTodoItemAdders = prevState.todoItemAdderDescription;
            myTodoItemAdders[index] = name;
            return {
                todoItemAdderDescription: myTodoItemAdders
            };
        });
    }

    handleItemAdderDeadlineChange(index, name) {
        this.setState(function (prevState, props) {
            let myTodoItemAdders = prevState.todoItemAdderDeadline;
            myTodoItemAdders[index] = name;
            return {
                todoItemAdderDeadline: myTodoItemAdders
            };
        });
    }


    handleNewListNameChange(listName) {
        this.setState({newListName: listName});
    }

    handleUpdatedListNameChange(listName) {
        this.setState({updatedListName: listName});
    }

    handleNewList() {
        let newList = {
            name: this.state.newListName
        };
        fetch('/lists', {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(newList),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(response => {
            return response.json();
        }).then(json => {
            this.setState(function (prevState, props) {
                let myTodoLists = prevState.todoLists;
                myTodoLists.push(json);
                return {
                    todoLists: myTodoLists,
                    newListName: ''
                };
            });
        });
    }

    handleNewItem(index, listId) {

        let newItem = {
            name: this.state.todoItemAdderName[index],
            description: this.state.todoItemAdderDescription[index],
            deadline: moment(this.state.todoItemAdderDeadline[index], "DD/MM/YYYY").isValid() ? moment(this.state.todoItemAdderDeadline[index], "DD/MM/YYYY").format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")
        }

        fetch('/lists/' + listId + '/items', {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(newItem),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(response => {
            return response.json();
        }).then(json => {
            this.setState(function (prevState, props) {
                let myTodoLists = prevState.todoLists;
                myTodoLists.forEach(function (todoList) {
                    if (todoList.id == listId) {
                        todoList.items.push(json);
                    }
                });
                let myTodoItemAdders = prevState.todoItemAdderName;
                myTodoItemAdders[index] = '';
                let myTodoItemAddersDescription = prevState.todoItemAdderDescription;
                myTodoItemAddersDescription[index] = '';
                let myTodoItemAddersDeadline = prevState.todoItemAdderDeadline;
                myTodoItemAddersDeadline[index] = moment().format("DD/MM/YYYY");
                console.log("window.location.reload(); // shity code, It will be fix.  TodoItemList is not refreshing when delete todoItem after than add a new todoItem")
                window.location.reload(); // shity code, It will be fix.  TodoItemList is not refreshing when delete todoItem after than add a new todoItem

                return {
                    todoLists: myTodoLists,
                    todoItemAdderName: myTodoItemAdders,
                    todoItemAdderDescription: myTodoItemAddersDescription,
                    todoItemAdderDeadline: myTodoItemAddersDeadline
                };
            });
        });
    }

    handleUpdateList(listId) {
        let updatedList = {
            name: this.state.updatedListName
        };
        fetch('/lists/' + listId, {
            method: 'PUT',
            credentials: 'same-origin',
            body: JSON.stringify(updatedList),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(response => {
            this.setState(function (prevState, props) {
                let myTodoLists = prevState.todoLists;
                myTodoLists.forEach(function (todoList) {
                    if (todoList.id === listId) {
                        todoList.name = prevState.updatedListName;
                    }
                });
                return {
                    todoLists: myTodoLists,
                    updatedListName: ''
                };
            });
        });
    }

    handleDeleteList(listId) {
        fetch('/lists/' + listId, {
            method: 'DELETE',
            credentials: 'same-origin'
        }).then(response => {
            this.setState(function (prevState, props) {
                let myTodoLists = prevState.todoLists.filter((todoList =>
                        todoList.id !== listId
                ));
                return {
                    todoLists: myTodoLists
                };
            });
        });
    }

    render() {
        const newListName = this.state.newListName;
        return (
            <div>

                <br/>

                <AddTodoList listName={newListName}
                             onAddList={this.handleNewList}
                             onListNameChange={this.handleNewListNameChange}/>

                <TodoLists lists={this.state.todoLists}
                           itemAdderName={this.state.todoItemAdderName}
                           itemAdderDescription={this.state.todoItemAdderDescription}
                           itemAdderDeadline={this.state.todoItemAdderDeadline}

                           updatedListName={this.state.updatedListName}
                           onDeleteList={this.handleDeleteList}
                           onUpdateList={this.handleUpdateList}
                           onListNameChange={this.handleUpdatedListNameChange}
                           onItemAdderDescriptionChange={this.handleItemAdderDescriptionChange}
                           onItemAdderDeadlineChange={this.handleItemAdderDeadlineChange}

                           onItemAdderNameChange={this.handleItemAdderNameChange}
                           onAddItem={this.handleNewItem}
                />

            </div>
        );
    }

}

class AddTodoList extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.props.onListNameChange(e.target.value);
    }

    handleClick() {
        this.props.onAddList();
    }

    handleSubmit(e) {
        e.preventDefault();
        this.handleClick();
    }

    render() {
        const listName = this.props.listName;
        return (
            <form onSubmit={this.handleSubmit}>
                <FormGroup>


                    <header className="header">

                        <h3>

                            <input type="text" className="create_list_input"
                                   placeholder="New List Name" value={listName}
                                   onChange={this.handleChange}/>


                            <Button
                                className="create_button"
                                onClick={this.handleClick}>Create List</Button>
                        </h3>
                    </header>

                </FormGroup>
            </form>
        );
    }
}


class TodoLists extends React.Component {
    constructor(props) {
        super(props);

        this.handleListNameClick = this.handleListNameClick.bind(this);
        this.renderNameOrEditField = this.renderNameOrEditField.bind(this);
        this.toggleEditingOff = this.toggleEditingOff.bind(this);

        this.state = {editing: '', filter: 0};
    }

    toggleEditingOff() {
        this.setState({editing: ''});
    }

    handleListNameClick(listId, listName) {
        this.props.onListNameChange(listName);
        this.setState({editing: listId});
    }


    renderNameOrEditField(list) {
        if (this.state.editing === list.id) {
            return (
                <EditUpdateDeleteObject object={list}
                                        updatedName={this.props.updatedListName}
                                        onDeleteObject={this.props.onDeleteList}
                                        onUpdateObject={this.props.onUpdateList}
                                        onNameChange={this.props.onListNameChange}
                                        toggleOff={this.toggleEditingOff}
                />
            );
        } else {
            return (
                <header className="header">
                    <h3 onClick={() => this.handleListNameClick(list.id, list.name)}>{list.name}

                        <Button
                            className="delete_button"
                            onClick={() => this.props.onDeleteList(list.id)}>Delete</Button>
                    </h3>
                </header>

            )
        }
    }

    render() {
        var todoLists = this.props.lists.map((list, index) =>
            <div key={list.id}>
                {this.renderNameOrEditField(list)}


                <TodoList index={index}
                          listId={list.id}
                          items={list.items}

                          onItemAdderNameChange={this.props.onItemAdderNameChange}
                          onItemAdderDescriptionChange={this.props.onItemAdderDescriptionChange}
                          onItemAdderDeadlineChange={this.props.onItemAdderDeadlineChange}


                          onAddItem={this.props.onAddItem}
                          itemAdderName={this.props.itemAdderName[index]}
                          itemAdderDescription={this.props.itemAdderDescription[index]}
                          itemAdderDeadline={this.props.itemAdderDeadline[index]}

                />


            </div>
        );
        return (
            <div>
                {todoLists}
            </div>
        );
    }
}

class TodoList extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleItemNameClick = this.handleItemNameClick.bind(this);
        this.handleItemNameChange = this.handleItemNameChange.bind(this);
        this.handleUpdateItem = this.handleUpdateItem.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.handleOrderBy = this.handleOrderBy.bind(this);
        this.toggleEditingOff = this.toggleEditingOff.bind(this);
        this.handleItemCheckboxChange = this.handleItemCheckboxChange.bind(this);
        this.handleChangeFilter = this.handleChangeFilter.bind(this);

        this.state = {editing: '', updatedItemName: '', items: [], originalitems: []};
    }

    //
    componentDidMount() {
        this.setState({items: this.props.items, originalitems: this.props.items});

    }

    //
    // componentWillMount() {
    //     this.setState({items: this.props.items, originalitems: this.props.items});
    // }


    toggleEditingOff() {
        this.setState({editing: ''});
    }

    handleChangeFilter(filterType) {

        let myItems = this.state.originalitems;

        if (filterType === "noncompleted") {
            myItems = myItems.filter(item => !item.completed);

        }
        if (filterType === "completed") {
            myItems = myItems.filter(item => item.completed);

        }
        if (filterType === "expired") {
            myItems = myItems.filter(item => item.deadline < new Date());

        }
        // return {
        //     items: items
        // };

        this.setState({items: myItems});
        this.toggleEditingOff();
    }


    handleOrderBy(orderType) {


        let myItems = this.state.items;
        if (orderType == "name")
            myItems = this.state.items.sort((a, b) => a.name.localeCompare(b.name))
        if (orderType == "status")
            myItems = this.state.items.sort(function (a, b) {
                return a.completed - b.completed
            });
        if (orderType == "deadline")
            myItems = this.state.items.sort(function (a, b) {
                return a.deadline - b.deadline
            });

        this.setState({items: myItems});
        // this.toggleEditingOff();
    }

    handleItemNameClick(itemId, itemName) {
        this.handleItemNameChange(itemName);
        this.setState({editing: itemId});
    }

    handleItemNameChange(itemName) {
        this.setState({updatedItemName: itemName});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onAddItem(this.props.index, this.props.listId);

    }

    handleDeleteItem(listId, itemId) {

        fetch('/lists/' + listId + '/items/' + itemId, {
            method: 'DELETE',
            credentials: 'same-origin'
        }).then(response => {
            this.setState(function (prevState, props) {
                let myItems = prevState.items
                    .filter(item => item.id !== itemId);


                myItems.forEach(function (item) {
                    if (item.items != null && item.items.length > 0) {
                        item.items = item.items.filter(i => i.id !== itemId);
                    }
                });

                //this.state.originalitems = myItems;
                return {
                    items: myItems,
                    originalitems: myItems,
                    updatedItemName: ''
                };
            });
        })
    }

    handleUpdateItem(listId, itemId) {
        let updatedItem = {
            name: this.state.updatedItemName
        }
        fetch('/lists/' + listId + '/items/' + itemId, {
            method: 'PUT',
            credentials: 'same-origin',
            body: JSON.stringify(updatedItem),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(response => {
            this.setState(function (prevState, props) {
                let myItems = prevState.items;
                myItems.forEach(function (item) {
                    if (item.id === itemId) {
                        item.name = prevState.updatedItemName;
                    }
                });
                return {
                    items: myItems,
                    updatedItemName: ''
                }
            });
        });
    }

    handleItemCheckboxChange(listId, itemId) {
        let itemToToggle = this.state.items.filter(item => item.id === itemId)[0];
        if (itemToToggle == null) {
            console.log(itemId);

            itemToToggle = this.state.items.flatMap(x => x.items).filter(item => item.id === itemId)[0];

        }
        itemToToggle.completed = !itemToToggle.completed;
        fetch('/lists/' + listId + '/items/' + itemId, {
            method: 'PUT',
            credentials: 'same-origin',
            body: JSON.stringify(itemToToggle),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(response => {
            this.setState(function (prevState, props) {
                let myItems = prevState.items;
                myItems.forEach(function (item) {
                    if (item.id === itemId) {
                        item.completed = itemToToggle.completed;
                    }

                    if (item.items != null)
                        item.items.forEach(function (subitem) {
                            if (subitem.id === itemId) {
                                subitem.completed = itemToToggle.completed;
                            }
                        });

                });


                return {
                    items: myItems,
                    updatedItemName: ''
                }
            });
        })
    }

    render() {
        let editing = this.state.editing;
        let updatedItemName = this.state.updatedItemName;
        let handleItemNameClick = this.handleItemNameClick;
        let handleItemNameChange = this.handleItemNameChange;
        let handleDeleteItem = this.handleDeleteItem;
        let handleUpdateItem = this.handleUpdateItem;
        let handleOrderBy = this.handleOrderBy;
        let toggleEditingOff = this.toggleEditingOff;
        let handleSubmit = this.handleSubmit;
        let handleItemCheckboxChange = this.handleItemCheckboxChange;
        let handleChangeFilter = this.handleChangeFilter;
        let listId = this.props.listId;


        let items = this.state.items.filter(x => this.state.items.flatMap(t => t.items).filter(t => t != null).map(d => d.id).indexOf(x.id) == -1).map(function (item) {

            return (
                <div>

                    <li className="todo-item" key={item.id}
                    >
                            <span
                                className={item.completed || item.items != null && item.items.length == item.items.filter(x => x.completed).length && item.items.length > 0 ? "todo-item__name disabled" : "todo-item__name"}
                                onClick={() => item.items == null || item.items.length <= 0 ? handleItemCheckboxChange(listId, item.id) : null}
                            >{item.name} - {item.description} </span>
                        <span className="todo-item__delete-button"
                              onClick={() => handleDeleteItem(listId, item.id)}>×</span>
                        <span className="todo-item__deadline_span"
                        > {moment(item.deadline).format("DD-MM-YYYY")}</span>
                    </li>
                    {
                        item.items != null && item.items.length == item.items.filter(x => x.completed).length && item.items.length > 0 && !item.completed ?
                            handleItemCheckboxChange(listId, item.id) : null // if subitems complated, update maintodoItem;
                    }

                    {item.items != null && item.items.length != item.items.filter(x => x.completed).length && item.items.length > 0 && item.completed ?
                        handleItemCheckboxChange(listId, item.id) : null // if subitems complated, update maintodoItem
                    }

                    {item.items != null && item.items.length > 0 ?

                        <div>
                            {item.items.map((subitem) => (
                                <li className="sub_item" key={subitem.id}
                                >
                            <span
                                className={subitem.completed ? "sub_item__name disabled" : "sub_item__name"}
                                onClick={() => handleItemCheckboxChange(listId, subitem.id)}
                            >{subitem.name} - {subitem.description} </span>
                                    <span className="todo-item__delete-button"
                                          onClick={() => handleDeleteItem(listId, subitem.id)}>×</span>
                                    <span className="todo-item__deadline_span"
                                    > {moment(subitem.deadline).format("DD-MM-YYYY")}</span>


                                </li>
                            ))}
                        </div>
                        :
                        <div></div>}
                </div>
            );


        });
        return (
            <div>
                <div className='order_div'>
                    <Button className={'order_button'} onClick={() => handleOrderBy("name")}>Order by item name</Button>

                </div>

                <div className='order_div'>
                    <Button className={'order_button'} onClick={() => handleOrderBy("status")}>Order by item
                        status</Button>

                </div>

                <div className='order_div'>
                    <Button className={'order_button'} onClick={() => handleOrderBy("deadline")}>Order by item
                        deadline</Button>

                </div>

                <br/>
                <div> ( {this.state.originalitems.filter(e => e.completed).length} / {this.state.originalitems.length} Complated
                    )
                </div>

                <br/>

                <span className={"todo-item__header_span"}>Item Name and Description</span>
                <span className="todo-item__deadline_span todo-item__header_span"
                > Deadline</span>

                <ListGroup>
                    {items}
                </ListGroup>

                <Form onSubmit={this.handleSubmit} horizontal>
                    <FormGroup>

                        <Col sm={2}>
                            <Row>
                                <div>
                                    Item Name:
                                </div>
                            </Row>
                            <Row>

                                <input type="text" className="form__input"
                                       placeholder="Name" value={this.props.itemAdderName}
                                       onChange={(e) => this.props.onItemAdderNameChange(this.props.index, e.target.value)}/>


                            </Row>
                        </Col>


                        <Col sm={2}>
                            <Row>

                                <div>
                                    Item Description:
                                </div>
                            </Row>
                            <Row>
                                <input type="text" className="form__input"
                                       placeholder="description" value={this.props.itemAdderDescription}
                                       onChange={(e) => this.props.onItemAdderDescriptionChange(this.props.index, e.target.value)}/>

                            </Row>
                        </Col>

                        <Col sm={2}>

                            <Row>
                                <div> Expired Date:</div>
                            </Row>
                            <Row>

                                <input type="text" className="form__input"
                                       placeholder="DD/MM/YYYY" value={this.props.itemAdderDeadline}
                                       onChange={(e) => this.props.onItemAdderDeadlineChange(this.props.index, e.target.value)}/>

                            </Row>


                        </Col>
                        <Col sm={1}> <Row>
                            <div> '</div>

                        </Row>
                            <Row>

                                <Button className="form__button"
                                        onClick={(e) => this.props.onAddItem(this.props.index, this.props.listId)}>╋</Button>
                            </Row>


                        </Col>
                    </FormGroup>
                </Form>
                <Footer
                    changedFilter={handleChangeFilter}
                />
                <br/>
                <hr/>

            </div>
        );

    }
}

class Footer extends React.Component {


    render() {
        return (
            <footer className="footer">
                <Button className={'footer__button '} onClick={() => this.props.changedFilter("all")}>All</Button>
                <Button className={'footer__button '}
                        onClick={() => this.props.changedFilter("noncompleted")}>Active</Button>
                <Button className={'footer__button '}
                        onClick={() => this.props.changedFilter("completed")}>Completed</Button>
                <Button className={'footer__button '}
                        onClick={() => this.props.changedFilter("expired")}>Expired</Button>

            </footer>
        )
    }
}

class EditUpdateDeleteObject extends React.Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUpdateButtonClick = this.handleUpdateButtonClick.bind(this);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    }

    handleSubmit(e, objId) {
        e.preventDefault();
        this.handleUpdateButtonClick(objId);
    }

    handleNameChange(e) {
        this.props.onNameChange(e.target.value);
    }

    handleUpdateButtonClick(objId) {
        this.props.onUpdateObject(objId);
        this.props.toggleOff();
    }

    handleDeleteButtonClick(objId) {
        this.props.onDeleteObject(objId);
    }

    render() {
        let obj = this.props.object;
        return (
            <form onSubmit={(e) => this.handleSubmit(e, obj.id)}>
                <FormGroup>
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Enter text"
                            value={this.props.updatedName}
                            onChange={this.handleNameChange}
                        />
                        <InputGroup.Button>
                            <Button onClick={() => this.handleUpdateButtonClick(obj.id)}>Update</Button>
                        </InputGroup.Button>
                        <InputGroup.Button>
                            <Button bsStyle="danger"
                                    onClick={() => this.handleDeleteButtonClick(obj.id)}>Delete</Button>
                        </InputGroup.Button>

                    </InputGroup>
                </FormGroup>
            </form>
        );
    }

}


ReactDOM.render(
    <App/>,
    document.getElementById('react')
);
