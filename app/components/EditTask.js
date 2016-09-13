import React from 'react';

// layout class
const EditTask = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            isEditing: false,
            task: {}
        };
    },

    componentWillMount() {
        if(this.props.params.taskKey) {
            this.setState({ isEditing: true });
            const current = this.props.findTask(this.props.params.taskKey);
            this.setState({ task: current[0] });
        } else {
            this.setState({ task: {name: '', desc: '', counter: 0, done: false} });
        }
    },

    _save(e) {
        e.preventDefault();
        if(!this.refs.name.value.length) {
            alert("Name can't be empty");
            return;
        }
        const toNumber = parseInt(this.refs.counter.value);
        const newValues = {
            name: this.refs.name.value,
            desc: this.refs.desc.value,
            counter: toNumber,
            done: this.state.task.done
        };
        if(this.state.isEditing) {
            this.props.updateTask(this.props.params.taskKey, newValues);
        } else {
            this.props.addTask(newValues);
        }
        this.context.router.push('/');
    },

    _remove() {
        this.props.removeTask(this.props.params.taskKey);
        this.context.router.push('/');
    },

    _cancel() {
        this.context.router.push('/');
    },

    _checkbox() {
        const newDone = this.state.task;
        newDone.done = this.state.task.done ? false : true;
        this.setState({ task: newDone });
    },

    render() {
        return (
            <div className="nu-edit">
                <form onSubmit={this._save}>

                    <div className="form-group">
                        <label>Name:
                            <input type="text" ref="name" className="form-control" placeholder="Name" defaultValue={this.state.task.name} />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Description:
                            <input type="text" ref="desc" className="form-control" placeholder="Description" defaultValue={this.state.task.desc} />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Number:
                            <input type="number" ref="counter" className="form-control" placeholder="Number" defaultValue={this.state.task.counter} />
                        </label>
                    </div>

                    <div className="checkbox">
                        <label>
                            <input type="checkbox" ref="done" checked={this.state.task.done ? 'checked' : ''} onChange={this._checkbox} /> Done
                        </label>
                    </div>

                    <div className="row nu-edit-actions">
                        <div className="col-xs-7">
                            <button type="submit" className="btn btn-success">Submit</button>
                        </div>
                        <div className="col-xs-5">
                            {this.state.isEditing ?
                                <button type="button" className="btn btn-danger" onClick={this._remove}>Delete</button> :
                                <button type="button" className="btn btn-link" onClick={this._cancel}>Cancel</button>
                            }
                        </div>
                    </div>

                </form>
            </div>
        )
    }
});

export default EditTask;
