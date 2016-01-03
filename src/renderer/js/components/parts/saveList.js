var React = require('react');
var Save = require('components/parts/save.js');

module.exports = React.createClass({
    render: function() {
        var saves =  this.props.saves.map(function(save) {
            return (
                <Save save={save} key={save.path}/>
            );
        });

        return (
            <div className="ui one cards">
                {saves}
            </div>
        );
    }
});