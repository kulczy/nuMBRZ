import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
// import TransitionGroup from 'react-addons-transition-group';

require('./less/index.less');

import TaskList from './components/TaskList';
import EditTask from './components/EditTask';

// firebase libraries and init
var firebase = require('firebase');
import ReactFireMixin from 'reactfire';
import Fire from './firebase';
firebase.initializeApp(Fire);

// main app component
const App = React.createClass({
    mixins: [ReactFireMixin],

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            tasks: [],
            firebaseLoaded: false,
            searched: '',
            searchOn: false
        };
    },

    componentWillMount() {
        const _self = this;
        const firebaseRef = firebase.database().ref('counter');
        firebaseRef.on('value', function(snapshot) {
            _self.setState({ firebaseLoaded: true });
        });
        _self.bindAsArray(firebaseRef.orderByChild('name'), 'tasks');
    },

    _findTask(key) {
        return this.state.tasks.filter(function (task) { return task['.key'] == key });
    },

    _addTask(newValues) {
        firebase.database().ref('counter').push({
            name: newValues.name,
            desc: newValues.desc,
            counter: newValues.counter,
            done: newValues.done
        });
    },

    _updateTask(key, newValues) {
        firebase.database().ref('counter/' + key).set({
            name: newValues.name,
            desc: newValues.desc,
            counter: newValues.counter,
            done: newValues.done
        });
    },

    _removeTask(key) {
        firebase.database().ref('counter/' + key).remove();
    },

    _count(axn, key) {
        const clicked = this._findTask(key);
        firebase.database().ref('counter/' + key).set({
            name: clicked[0].name,
            desc: clicked[0].desc,
            counter: axn === '+' ? clicked[0].counter + 1 : clicked[0].counter - 1,
            done: clicked[0].done,
        });
    },

    _display(sorted) {
        if(this.state.firebaseLoaded) {
            return React.cloneElement(this.props.children, {
                // tasks: this.state.tasks,
                tasks: sorted,
                count: this._count,
                findTask: this._findTask,
                addTask: this._addTask,
                updateTask: this._updateTask,
                removeTask: this._removeTask,
                searched: this.state.searched
            })
        } else {
            return 'loading...'
        }
    },

    _search(e) {
        this.setState({searched: e.target.value});
    },

    _templateNavbarDefault() {
        return (
            <div className="nu-nanbar">
                <div className="col-xs-4">
                    <div className="nu-navbar-icon" onClick={this._openSearchBar}><span className="glyphicon glyphicon-search"></span></div>
                </div>
                <div className="col-xs-4 text-center">
                <Link to="/">
                    <img src="./app/img/logo.png" width="60"/>
                </Link>
                </div>
                <div className={this.props.location.pathname == '/' ? 'col-xs-4 text-right' : 'col-xs-4 text-right hidden'}>
                    <Link to="/edit">
                        <div className="nu-navbar-icon"><span className="glyphicon glyphicon-plus"></span></div>
                    </Link>
                </div>
            </div>
        )
    },

    _templateNavbarSearch() {
        return (
            <div className="nu-nanbar">
                <div className="col-xs-9">
                    <div className="nu-navbar-search">
                        <input type="text" className="form-control" onChange={this._search}
                            ref={function(input) {if (input != null) { input.focus(); } }} />
                    </div>
                </div>
                <div className="col-xs-3 text-right">
                    <div className="nu-navbar-icon" onClick={this._closeSearchBar}><span className="glyphicon glyphicon-remove"></span></div>
                </div>
            </div>
        )
    },

    _templateLoading() {
        return (
            <div className="nu-loading">
                <span><img src="./app/img/logo.png" width="140"/></span>
            </div>
        )
    },

    _openSearchBar() {
        this.setState({searchOn: true});
        this.context.router.push('/');
    },

    _closeSearchBar() {
        this.setState({searchOn: false, searched: ''});
    },

    render() {
        // get done tasks
        let sortedDone = this.state.tasks.filter(
            (task) => {
                return task.done == true;
            }
        );

        // sort done tasks by name
        sortedDone.sort(function (a, b) {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });

        // get undone tasks
        let sortedUndone = this.state.tasks.filter(
            (task) => {
                return task.done == false;
            }
        );

        // sort undone tasks by name
        sortedUndone.sort(function (a, b) {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });

        // merge arrays of tasks
        var sorted = sortedUndone.concat(sortedDone);

        return (
            <div>

                {this.state.firebaseLoaded ? '' : this._templateLoading()}
                {this.state.searchOn ? this._templateNavbarSearch() : this._templateNavbarDefault()}

                <div className="nu-content container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            {this._display(sorted)}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
});

render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={TaskList}/>
            <Route path="/list" component={TaskList} />
            <Route path="/edit(/:taskKey)" component={EditTask} />
        </Route>
    </Router>,
    document.getElementById('app')
);
