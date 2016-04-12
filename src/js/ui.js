/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Combines React/Bootstrap/FontAwesome for building user interfaces
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          ui 
 */

var HelpIcon = React.createClass(
{ 
    componentDidMount : function () 
    {
        this.attachPopover();
    },

    componentDidUpdate : function () 
    {
        this.attachPopover();
    },

    attachPopover : function () 
    {
        $('[data-toggle="popover"]').popover();
    },

    render : function () 
    { 
         var HelpIcon = this.props.content ? <a href            = "javascript:;"
                                                data-toggle     = "popover" 
                                                data-trigger    = "focus" 
                                                data-placement  = "right" 
                                                data-container  = "body" 
                                                data-content    = {this.props.content}>
                                                <i className="fa fa-question-circle" ></i></a> : '';
        return (<span>{HelpIcon}</span>);
    }
});

var CheckboxControl = React.createClass(
{  
    getInitialState : function () 
    {
        return {value: this.props.initialValue};
    },

    handleChange : function (event) 
    {
        this.setState({value: event.target.checked});
        if (this.props.onUserInput) this.props.onUserInput(this.props.id, event.target.checked);
    },

    render : function() 
    {
        return (
            <div className="checkbox">
                <label>
                    <input type="checkbox" id={this.props.id} checked={this.state.value} onChange={this.handleChange} /> {this.props.label}
                </label> <HelpIcon content={this.props.description} /> 
            </div>
        );
    }
});

var SelectControl = React.createClass(
{  
    getInitialState : function () 
    {
        return {value: this.props.initialValue};
    },

    handleChange : function (event) 
    {
        this.setState({value: event.target.value});
        if (this.props.onUserInput) this.props.onUserInput(this.props.id, event.target.value);
    },

    render : function () 
    {
        var options = [];
        for (var i = 0; i < this.props.options.length; i++)  
        {
            var option = this.props.options[i];
            options.push(<option key={option} value={option}>{option}</option>);
        }

        return (
            <div className="form-group">
                <label htmlFor={this.props.id}>{this.props.label}</label> <HelpIcon content={this.props.description} /> 
                <select className="form-control" id={this.props.id} value={this.state.value} onChange={this.handleChange}>{options}</select>
            </div>
        );
    }
});

var TextControl = React.createClass(
{  
    getInitialState : function () 
    {
        return {value: this.props.initialValue};
    },

    handleChange : function (event) 
    {
        this.setState({value: event.target.value});
        if (this.props.onUserInput) this.props.onUserInput(this.props.id, event.target.value);
    },

    render : function () 
    { 
        return (
            <div className="form-group">
                <label htmlFor={this.props.id}>{this.props.label}</label> <HelpIcon content={this.props.description} /> 
                <input type="text" className="form-control" id={this.props.id} value={this.state.value} onChange={this.handleChange} />
            </div>
        );
    }
});

var FormControl = React.createClass(
{  
    render : function () 
    {
        var control;
        if (this.props.options !== undefined)   control = <SelectControl   {...this.props} />
        else if (this.props.type === 'boolean') control = <CheckboxControl {...this.props} />
        else                                    control = <TextControl     {...this.props} />
        return (control);
    }
});

var Panel = React.createClass(
{
    render : function () 
    {
        var panelHeading = this.props.heading ? <div className="panel-heading">{this.props.heading}</div> : '';

        return (
            <div className="panel panel-default">
                {panelHeading}
                <div className="panel-body">
                      {this.props.children}
                </div>
            </div>
        );
    }
});

var AccordionPanel = React.createClass(
{
    render : function () 
    {
        var headingId = 'heading-'+this.props.id;
        var panelId   = 'panel-'+this.props.id;

        return (
            <div className="panel panel-default">
                <div className="panel-heading" role="tab" id={headingId} data-toggle="collapse" data-parent={'#'+this.props.parentId} href={'#'+panelId} aria-expanded={this.props.expanded ? this.props.expanded : false} aria-controls={panelId}>
                    <h4 className="panel-title">{this.props.heading}</h4>
                </div>
                <div id={panelId} className={this.props.expanded ? 'panel-collapse collapse in' : 'panel-collapse collapse'} role="tabpanel" aria-labelledby={headingId}>
                    <div className="panel-body">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});

var Accordion = React.createClass(
{
    render : function () 
    {
        return (<div className="panel-group" id={this.props.id} role="tablist" aria-multiselectable="true">{this.props.children}</div>);
    }
});

module.exports = 
{
    HelpIcon        : HelpIcon,
    CheckboxControl : CheckboxControl,
    SelectControl   : SelectControl,
    TextControl     : TextControl,
    FormControl     : FormControl,
    Panel           : Panel,
    AccordionPanel  : AccordionPanel,
    Accordion       : Accordion
};