/* jshint browserify: true */
'use strict';

// Required modules.
var ui   = require('./ui');
var $    = require('jQuery');

var datatip =
{
    id:'datatip', label:'Data Tip',
    groups:
    [
        {
            id:'font', label:'Font',
            controls:
            [
                {id:'fontFamily', label:'Family', value:'arial', type:'string', options: ['Arial', 'Helvetica', 'sans-serif']},
                {id:'fontSize', label:'Size', value: 12, type:'integer'},
                {id:'fontColor', label:'Color', value:'#666666', type:'color'}
            ]
        },
        {
            id:'border', label:'Border',
            controls:
            [
                {id:'borderStyle', label:'Style', value:'solid', type:'string', options: ['dotted', 'dashed','solid', 'double', 'groove', 'ridge', 'inset', 'outset']},
                {id:'borderColor', label:'Color', value:'#666666', type:'color'},
                {id:'borderWidth', label:'Width', value: 1, type:'integer'},
                {id:'borderRadius', label:'Radius', value: 2, type:'integer'}
            ]
        },
        {
            id:'none', label:'',
            controls:
            [
                {id:'position', label:'Position', description:'The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right', value:'top', type:'string', options: ['top', 'bottom', 'left', 'right']},
                {id:'padding', label:'Padding', value: 7, type:'integer'},
                {id:'backgroundColor', label:'Background Color', value:'#fafafa', type:'color'},
                {id:'hideShadow', label:'Hide Shadow', value: false, type:'boolean'},
                {id:'hideNotch', label:'Hide Notch', value: false, type:'boolean'},
                {id:'followMouse', label:'Follow Mouse', description:'Should the tip follow the mouse', value: false, type:'boolean'},
                {id:'useAnimation', label:'Animate Tip', description:'Should the tip movement be animated', value: true, type:'boolean'},
            ]
        }
    ]
};

var chart =
[
    {
        id:'chart', label:'Chart',
        groups:
        [
            {
                id:'font', label:'Font',
                controls:
                [
                    {id:'fontFamily', label:'Family', value:'arial', type:'string', options: ['Arial', 'Helvetica', 'sans-serif']},
                    {id:'fontSize', label:'Size', value: 12, type:'integer'},
                    {id:'fontColor', label:'Color', value:'#666666', type:'color'}
                ]
            },
            {
                id:'border', label:'Border',
                controls:
                [
                    {id:'borderStyle', label:'Style', value:'solid', type:'string', options: ['dotted', 'dashed','solid', 'double', 'groove', 'ridge', 'inset', 'outset']},
                    {id:'borderColor', label:'Color', value:'#666666', type:'color'},
                    {id:'borderWidth', label:'Width', value: 1, type:'integer'},
                ]
            },
            {
                id:'none', label:'',
                controls:
                [
                    {id:'position', label:'Position', description:'The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right', value:'top', type:'string', options: ['top', 'bottom', 'left', 'right']},
                    {id:'padding', label:'Padding', value: 7, type:'integer'},
                    {id:'backgroundColor', label:'Background Color', value:'#fafafa', type:'color'},
                    {id:'hideShadow', label:'Hide Shadow', value: false, type:'boolean'},
                    {id:'hideNotch', label:'Hide Notch', value: false, type:'boolean'},
                    {id:'followMouse', label:'Follow Mouse', description:'Should the tip follow the mouse', value: false, type:'boolean'},
                    {id:'useAnimation', label:'Animate Tip', description:'Should the tip movement be animated', value: true, type:'boolean'},
                ]
            }
        ]
    },
    {
        id:'datatip', label:'Data Tip',
        groups:
        [
            {
                id:'font', label:'Font',
                controls:
                [
                    {id:'fontFamily', label:'Family', value:'arial', type:'string', options: ['Arial', 'Helvetica', 'sans-serif']},
                    {id:'fontSize', label:'Size', value: 12, type:'integer'},
                    {id:'fontColor', label:'Color', value:'#666666', type:'color'}
                ]
            },
            {
                id:'border', label:'Border',
                controls:
                [
                    {id:'borderStyle', label:'Style', value:'solid', type:'string', options: ['dotted', 'dashed','solid', 'double', 'groove', 'ridge', 'inset', 'outset']},
                    {id:'borderColor', label:'Color', value:'#666666', type:'color'},
                    {id:'borderWidth', label:'Width', value: 1, type:'integer'},
                    {id:'borderRadius', label:'Radius', value: 2, type:'integer'}
                ]
            },
            {
                id:'none', label:'',
                controls:
                [
                    {id:'position', label:'Position', description:'The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right', value:'top', type:'string', options: ['top', 'bottom', 'left', 'right']},
                    {id:'padding', label:'Padding', value: 7, type:'integer'},
                    {id:'backgroundColor', label:'Background Color', value:'#fafafa', type:'color'},
                    {id:'hideShadow', label:'Hide Shadow', value: false, type:'boolean'},
                    {id:'hideNotch', label:'Hide Notch', value: false, type:'boolean'},
                    {id:'followMouse', label:'Follow Mouse', description:'Should the tip follow the mouse', value: false, type:'boolean'},
                    {id:'useAnimation', label:'Animate Tip', description:'Should the tip movement be animated', value: true, type:'boolean'},
                ]
            }
        ]
    }
]

var JsonControls = React.createClass(
{
    updateJson : function (id, value)
    {
        console.log(id+' '+value);
        for (var i = 0; i < this.props.controls.length; i++)  
        {
            var ctrl = this.props.controls[i];
            if (ctrl.id === id)
            {
                ctrl.value = value;
                break;
            }
        }
    },

    handleUserInput : function (id, value)
    {
        this.updateJson(id, value);
    },

    render : function () 
    {
        var ctrls = [];
        for (var i = 0; i < this.props.controls.length; i++)  
        {
            var ctrl = this.props.controls[i];
            ctrls.push(<ui.FormControl  key             = {ctrl.id} 
                                        id              = {ctrl.id} 
                                        label           = {ctrl.label} 
                                        description     = {ctrl.description} 
                                        initialValue    = {ctrl.value} 
                                        onUserInput     = {this.handleUserInput} 
                                        type            = {ctrl.type} 
                                        options         = {ctrl.options} />);
        }

        return (<form>{ctrls}</form>);
    }
});

var JsonPanels = React.createClass(
{
    render : function () 
    {
        var panels = [];
        var groups = this.props.json.groups;
        for (var i = 0; i < groups.length; i++)  
        {
            var group = groups[i];
            panels.push( 
                <ui.Panel key={group.id} heading={group.label}>
                    <JsonControls controls={group.controls} />
                </ui.Panel>
            );
        }

        return (<div>{panels}</div>);
    }
});

ReactDOM.render(
    <div><JsonPanels json={datatip} /></div>
    , document.getElementById('container')
);