import React from 'react';
import { Link } from 'react-router';

const Task = React.createClass({
    // constructor(props) {
    //     super(props);
    // }

    plus(e) {
        console.log(e.target);
    },

    render() {
        return (
            <div>
                <li className={this.props.task.done ? 'nu-list-item nu-list-item-done' : 'nu-list-item'}>
                    <div className="nu-list-params">
                        <div className="nu-list-param nu-list-plus">
                            <div className="nu-list-icon" onClick={this.props.count.bind(null, '+', this.props.task['.key'])}><span className="glyphicon glyphicon-plus"></span></div>
                        </div>
                        <Link to={'/edit/'+this.props.task['.key']} className="nu-list-param nu-list-text">
                            <p className="nu-list-title">{this.props.task.name}</p>
                            {this.props.task.desc}
                        </Link>
                        <Link to={'/edit/'+this.props.task['.key']} className="nu-list-param nu-list-number">
                        {this.props.task.counter}
                        </Link>
                        <div className="nu-list-param nu-list-minus">
                            <div className="nu-list-icon" onClick={this.props.count.bind(null, '-', this.props.task['.key'])}><span className="glyphicon glyphicon-minus"></span></div>
                        </div>
                    </div>
                </li>
            </div>
        )
    }
});

export default Task;
