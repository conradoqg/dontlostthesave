var React = require('react');
var SaveSlot = require('components/parts/saveSlot.js');

module.exports = React.createClass({
    render: function() {
        var counter = 0;
        var noSlots = this.props.slots.length === 0;

        if (noSlots) {
            return (<div className="ui center aligned black"><h4>No slots...</h4></div>);
        } else {
            var slots =  this.props.slots.map(function(slot) {
                return (
                    <SaveSlot slot={slot} key={counter++}/>
                );
            });
            return (
                <div className="ui five column center aligned padded grid">
                    {slots}
                </div>
            );
        }
    }
});