/* jshint browserify: true */
'use strict';

// Required modules.
var form = require('./form');
var $    = require('jQuery');

/*
var json =
{
    id:'datatip', label:'Data Tip',
    groups:
    [
        {
            id:'font', label:'Font',
            controls:
            [
                {id:'fontFamily', label:'Font Family', value:'arial', type:'string', options: ['Arial', 'Helvetica', 'sans-serif']},
                {id:'fontSize', label:'Font Size', value: 12, type:'integer'},
                {id:'fontColor', label:'Font Color', value:'#666666', type:'color'}
            ]
        },
        {
            id:'border', label:'Border',
            controls:
            [
                {id:'borderStyle', label:'Border Style', value:'solid', type:'string', options: ['dotted', 'dashed','solid', 'double', 'groove', 'ridge', 'inset', 'outset']},
                {id:'borderColor', label:'Border Color', value:'#666666', type:'color'},
                {id:'borderWidth', label:'Border Width', value: 1, type:'integer'},
                {id:'borderRadius', label:'Border Radius', value: 2, type:'integer'}
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
*/

var controls =
[
    {id:'position', label:'Position', description:'The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right', value:'top', type:'string', options: ['top', 'bottom', 'left', 'right']},
    {id:'padding', label:'Padding', value: 7, type:'integer'},
    {id:'fontFamily', label:'Font Family', value:'arial', type:'string', options: ['Arial', 'Helvetica', 'sans-serif']},
    {id:'fontSize', label:'Font Size', value: 12, type:'integer'},
    {id:'fontColor', label:'Font Color', value:'#666666', type:'color'},
    {id:'backgroundColor', label:'Background Color', value:'#fafafa', type:'color'},
    {id:'borderStyle', label:'Border Style', value:'solid', type:'string', options: ['dotted', 'dashed','solid', 'double', 'groove', 'ridge', 'inset', 'outset']},
    {id:'borderColor', label:'Border Color', value:'#666666', type:'color'},
    {id:'borderWidth', label:'Border Width', value: 1, type:'integer'},
    {id:'borderRadius', label:'Border Radius', value: 2, type:'integer'},
    {id:'hideShadow', label:'Hide Shadow', value: false, type:'boolean'},
    {id:'hideNotch', label:'Hide Notch', value: false, type:'boolean'},
    {id:'followMouse', label:'Follow Mouse', description:'Should the tip follow the mouse', value: false, type:'boolean'},
    {id:'useAnimation', label:'Animate Tip', description:'Should the tip movement be animated', value: true, type:'boolean'},
];

ReactDOM.render(
<div className="panel panel-default">
    <div className="panel-heading">Panel heading without title</div>
    <div className="panel-body">
        <form.JsonForm controls={controls} />
    </div>
</div>
, document.getElementById('container')
);

var Panel = React.createClass(
{
    render : function () 
    {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">this.props.label</div>
                <div className="panel-body">
                    <form.JsonForm controls={this.props.controls} />
                </div>
            </div>
        );
    }
});