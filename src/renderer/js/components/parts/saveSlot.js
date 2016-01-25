var React = require('react');

var charactersImages = {
    'wilson': './images/Wilson_portrait.png',
    'willow': './images/Willow_portrait.png',
    'wolfgang': './images/Wolfgang_portrait.png',
    'wendy': './images/Wendy_portrait.png',
    'wx78': './images/WX-78_portrait.png',
    'wickerbottom': './images/Wickerbottom_portrait.png',
    'woodie': './images/Woodie_portrait.png',
    'wes': './images/Wes_portrait.png',
    'wathgrithr': './images/Wigfrid_portrait.png',
    'webber': './images/Webber_portrait.png',
    'walani': './images/Walani_portrait.png',
    'waxwell': './images/Waxwell_portrait.png',
    'unknow': './images/unknow.png'
};

var charactersName = {
    'wilson': 'Wilson',
    'willow': 'Willow',
    'wolfgang': 'Wolfgang',
    'wendy': 'Wendy',
    'wx78': 'WX-78',
    'wickerbottom': 'Wickerbottom',
    'woodie': 'Woodie',
    'wes': 'Wes',
    'wathgrithr': 'Wigfrid',
    'webber': 'Webber',
    'walani': 'Walani',
    'waxwell': 'Maxwell',
    'unknow': 'Unknow'
};

var dlcImages = {
    'ROG': './images/Reign_of_Giants_icon.png',
    'Shipwrecked': './images/Shipwrecked_icon.png',
    'Normal': './images/Dont_Starve_icon.png'
};

var dlcName = {
    'ROG': 'Reign of Giants',
    'Shipwrecked': 'Shipwrecked',
    'Normal': 'Don\'t Starve'
};

module.exports = React.createClass({
    getCharacterImagePath: function(character) {
        if (!charactersImages[character])
            character = 'unknow';

        return charactersImages[character];
    },

    getCharacterName: function(character) {
        if (!charactersName[character])
            character = 'unknow';

        return charactersName[character];
    },

    getDLCImagePath: function(dlc) {
        if (!dlcImages[dlc])
            dlc = 'Normal';

        return dlcImages[dlc];
    },

    getDLCName: function(dlc) {
        if (!dlcName[dlc])
            dlc = 'Normal';

        return dlcName[dlc];
    },

    capitalizeFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    render: function() {
        return (
            <div className="column">
                <div className="item">
                    <div className="item">
                        <div className="ui moreTiny image">
                            <img src={this.getCharacterImagePath(this.props.slot.character)}/>
                        </div>
                        <div className="content">
                            <div className="header">{this.getCharacterName(this.props.slot.character)}</div>
                            <div className="meta">
                                <img className="ui avatar mini image hasPopup" data-content={this.getDLCName(this.props.slot.dlc)} src={this.getDLCImagePath(this.props.slot.dlc)}/><span>{this.capitalizeFirstLetter(this.props.slot.mode)}</span>
                            </div>
                            <div className="description">
                                Day {this.props.slot.day || '?'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});