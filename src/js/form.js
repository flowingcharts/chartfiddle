/* jshint browserify: true */
/* globals DEBUG */
'use strict';

/**
 * @fileoverview    Contains functions for manipulating the dom.
 * @author          Jonathan Clare 
 * @copyright       FlowingCharts 2015
 * @module          dom 
 */

var CheckboxControl = React.createClass(
{  
    render : function() 
    {
        return (
            <div className="checkbox">
                <label>
                    <input type="checkbox" id={this.props.id} checked={this.props.value} onChange={this.props.onChange} /> {this.props.label}
                </label> {this.props.helpLink} 
            </div>
        );
    }
});

var SelectControl = React.createClass(
{  
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
                <label htmlFor={this.props.id}>{this.props.label}</label> {this.props.helpLink} 
                <select className="form-control" id={this.props.id} value={this.props.value} onChange={this.props.onChange}>{options}</select>
            </div>
        );
    }
});

var TextControl = React.createClass(
{  
    render : function () 
    { 
        return (
            <div className="form-group">
                <label htmlFor={this.props.id}>{this.props.label}</label> {this.props.helpLink} 
                <input type="text" className="form-control" id={this.props.id} value={this.props.value} onChange={this.props.onChange} />
            </div>
        );
    }
});

var FormControl = React.createClass(
{  
    getInitialState : function () 
    {
        return {value: this.props.initialValue};
    },

    handleChange : function (event) 
    {
        //var newValue = event.target.value ? event.target.value : event.target.checked;
        this.setState({value: event.target.value});
        if (this.props.onUserInput) this.props.onUserInput(this.props.id, event.target.value);
    },

    render : function () 
    {
        var helpLink = this.props.description ? <a href="javascript:;"
                                                data-toggle="popover" 
                                                data-trigger="focus" 
                                                data-placement="right" 
                                                data-container="body" 
                                                data-content={this.props.description}>
                                                    <i className="fa fa-question-circle" ></i>
                                                </a> : '';

        var control;
        if (this.props.options !== undefined)   control = <SelectControl    {...this.props} onChange={this.handleChange} value={this.state.value} helpLink={helpLink} />
        else if (this.props.type === 'boolean') control = <CheckboxControl  {...this.props} onChange={this.handleChange} value={this.state.value} helpLink={helpLink} />
        else                                    control = <TextControl      {...this.props} onChange={this.handleChange} value={this.state.value} helpLink={helpLink} />
        return (control);
    }
});

var Form = React.createClass(
{
    componentDidMount : function () 
    {
        console.log("componentDidMount")
        this.attachPopover();
    },

    componentDidUpdate : function () 
    {
        console.log("componentDidUpdate")
        this.attachPopover();
    },

    attachPopover : function () 
    {
        $('[data-toggle="popover"]').popover()
    },

    render : function () 
    {
        return (<form>{this.props.controls}</form>);
    }
});

var JsonForm = React.createClass(
{
    updateJson : function (id, value)
    {
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
            ctrls.push(<FormControl key={ctrl.id} 
                                    id={ctrl.id} 
                                    label={ctrl.label} 
                                    description={ctrl.description} 
                                    initialValue={ctrl.value} 
                                    onUserInput={this.handleUserInput} 
                                    type={ctrl.type} 
                                    options={ctrl.options} />);
        }

        return (<Form controls={ctrls} />);
    }
});

module.exports = 
{
    JsonForm : JsonForm
};