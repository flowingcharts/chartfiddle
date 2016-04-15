/* jshint browserify: true */
'use strict';

// Required modules.
var ui   = require('./ui');
var $    = require('jQuery');

var jsonChart =
[
    {
        id:'chart', label:'Chart',
        groups:
        [
            {
                id:'font', label:'Font',
                properties:
                [
                    {id:'fontFamily', label:'Family', value:'arial', type:'string', options: ['Arial', 'Helvetica', 'sans-serif']},
                    {id:'fontSize', label:'Size', value: 12, min: 0, max:25, type:'integer'},
                    {id:'fontColor', label:'Color', value:'#666666', type:'color'}
                ]
            },
            {
                id:'border', label:'Border',
                properties:
                [
                    {id:'borderStyle', label:'Style', value:'solid', type:'string', options: ['dotted', 'dashed','solid', 'double', 'groove', 'ridge', 'inset', 'outset']},
                    {id:'borderColor', label:'Color', value:'#666666', type:'color'},
                    {id:'borderWidth', label:'Width', value: 1, type:'integer'},
                ]
            }
        ]
    },
    {
        id:'datatip', label:'Data Tip',
        groups:
        [
            {
                id:'position', label:' ',
                properties:
                [
                    {id:'position', label:'Position', description:'The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right', value:'top', type:'string', options: ['top', 'bottom', 'left', 'right']}
                ]
            },
            {
                id:'font', label:'Font',
                properties:
                [
                    {id:'fontFamily', label:'Family', value:'arial', type:'string', options: ['Arial', 'Helvetica', 'sans-serif']},
                    {id:'fontSize', label:'Size', value: 12, type:'integer'},
                    {id:'fontColor', label:'Color', value:'#666666', type:'color'}
                ]
            },
            {
                id:'border', label:'Border',
                properties:
                [
                    {id:'borderStyle', label:'Style', value:'solid', type:'string', options: ['dotted', 'dashed','solid', 'double', 'groove', 'ridge', 'inset', 'outset']},
                    {id:'borderColor', label:'Color', value:'#666666', type:'color'},
                    {id:'borderWidth', label:'Width', value: 1, type:'integer'},
                    {id:'borderRadius', label:'Radius', value: 2, type:'integer'}
                ]
            },
            {
                id:'style', label:'Style',
                properties:
                [
                    {id:'padding', label:'Padding', value: 7, type:'integer'},
                    {id:'backgroundColor', label:'Background Color', value:'#fafafa', type:'color'},
                    {id:'hideShadow', label:'Hide Shadow', value: false, type:'boolean'},
                    {id:'hideNotch', label:'Hide Notch', value: false, type:'boolean'}
                ]
            },
            {
                id:'movement', label:'Movement',
                properties:
                [
                    {id:'followMouse', label:'Follow Mouse', description:'Should the tip follow the mouse', value: false, type:'boolean'},
                    {id:'useAnimation', label:'Animation', description:'Enable or disable animation of the tip', value: true, type:'boolean'},
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
            ctrls.push(<ui.FormControl  key           = {ctrl.id} 
                                        id            = {ctrl.id} 
                                        label         = {ctrl.label} 
                                        description   = {ctrl.description} 
                                        initialValue  = {ctrl.value} 
                                        onUserInput   = {this.handleUserInput} 
                                        type          = {ctrl.type} 
                                        min           = {ctrl.min} 
                                        max           = {ctrl.max} 
                                        step          = {ctrl.step} 
                                        options       = {ctrl.options} />);
        }
        return (<form>{ctrls}</form>);
    }
});

var JsonPanels = React.createClass(
{
    render : function () 
    {
        var panels = [];
        for (var i = 0; i < this.props.panels.length; i++)  
        {
            var pnl = this.props.panels[i];
            panels.push( 
                <ui.Panel key={pnl.id} heading={pnl.label}>
                    <JsonControls controls={pnl.properties} />
                </ui.Panel>
            );
        }
        return (<div>{panels}</div>);
    }
});

var JsonAccordion = React.createClass(
{
    render : function () 
    {
        var panels = [];
        for (var i = 0; i < this.props.panels.length; i++)  
        {
            var pnl = this.props.panels[i];
            panels.push(
                <ui.AccordionPanel key={pnl.id} parentId={this.props.id} id={pnl.id} heading={pnl.label} expanded={i === 0 ? true : false}>
                    <JsonPanels panels={pnl.groups} />
                </ui.AccordionPanel>
            );
        }
        return (<ui.Accordion id={this.props.id}>{panels}</ui.Accordion>);
    }
});

ReactDOM.render(
    <JsonAccordion id="myAccordion" panels={jsonChart} />
    , document.getElementById('cf-sidebar')
);