var React = require('react');
var ReactDOM = require('react-dom');
var SaveActions = require('actions/saveActions.js');
var SaveSlotList = require('components/parts/saveSlotList.js');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            editingName: false,
            name: null
        };
    },

    getFormatedDateFromNow: function(date) {
        return moment(date, moment.ISO_8601).fromNow();
    },

    getFormatedDate: function(date) {
        return moment(date, moment.ISO_8601).format('llll');
    },

    getModalQuestion: function(title, text, icon) {
        var self=this;
        return (
            <div className="ui basic modal">
                <i className="close icon"></i>
                <div className="header">{title}</div>
                <div className="image content">
                    <div className="image"><i className={icon + 'icon'}></i></div>
                    <div className="description">
                    <p>{text + ' ' + self.props.save.path + '?'}</p>
                    </div>
                </div>
                <div className="actions">
                    <div className="ui red deny inverted button">
                        <i className="remove icon"></i>No
                    </div>
                    <div className="ui green approve basic inverted button">
                        <i className="checkmark icon"></i>Yes
                    </div>
                </div>
            </div>
        );
    },

    handleNameItClick: function(event) {
        event.preventDefault();
        this.setState({
            editingName: true,
            name: (this.state.name ? this.state.name : this.props.save.name)
        });
    },

    handleChangeName: function(event) {
        this.setState({
            name: event.target.value
        });
    },

    handleSaveNameClick: function(event) {
        event.preventDefault();
        SaveActions.nameIt(this.state.name, this.props.save.path);
        this.setState({editingName:false});
    },

    handleCancelEditClick: function(event) {
        event.preventDefault();
        this.setState({
            editingName:false,
            name: null
        });
    },

    handleRestoreClick: function(event) {
        event.preventDefault();
        var self = this;
        ReactDOM.render(this.getModalQuestion('Restore Save', 'Are you sure that you want to restore the', 'undo'), document.getElementById('modals'));
        $('.modal')
            .modal({
                detachable: false,
                onApprove: function() {
                    SaveActions.restore(self.props.save.path);
                }
            })
            .modal('show');
    },

    handleRemoveClick: function(event) {
        event.preventDefault();
        var self = this;
        ReactDOM.render(this.getModalQuestion('Remove Save', 'Are you sure that you want to remove the', 'trash'), document.getElementById('modals'));
        $('.modal')
            .modal({
                detachable: false,
                onApprove: function() {
                    SaveActions.remove(self.props.save.path);
                }
            })
            .modal('show');
    },

    render: function() {
        var header = null;

        if (this.state.editingName)
            header = (
                <div className="ui moreMini action input">
                    <input type="text" value={this.state.name} className="moreMini" placeholder="Name" onChange={this.handleChangeName}/>
                    <button className="ui green icon button" onClick={this.handleSaveNameClick}>
                        <i className="checkmark icon"></i>
                    </button>
                    <button className="ui red icon button" onClick={this.handleCancelEditClick}>
                        <i className="remove icon"></i>
                    </button>
                </div>
            );
        else
            header = (this.props.save.name ? this.props.save.name + ' - ' : '' );

        return (
            <div className="ui card">
                <div className="content">
                    <div className="ui right floated horizontal link list">
                        <div className="item"><a href="#" onClick={this.handleNameItClick}>name it</a></div>
                        <div className="item"><a href="#" onClick={this.handleRestoreClick}>restore</a></div>
                        <div className="item"><a href="#" onClick={this.handleRemoveClick}>remove</a></div>
                    </div>
                    <div className="header">
                        {header} {this.getFormatedDateFromNow(this.props.save.date)}
                    </div>
                    <div className="meta">{this.getFormatedDate(this.props.save.date)}</div>
                    <div className="description">
                        <SaveSlotList slots={this.props.save.slots}/>
                    </div>
                </div>
            </div>
        );
    }
});