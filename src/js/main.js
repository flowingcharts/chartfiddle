/*
var NavigationItem = React.createClass({
    onClick: function() {
        this.props.itemSelected(this.props.item);
    },
    render: function() {
        return (
            <li onClick={this.onClick} className={this.props.selected ? "selected" : ""}>
                {this.props.item.data.display_name}
            </li>
        );
    }
});

var Navigation = React.createClass({
    setSelectedItem: function(item) {
        this.props.itemSelected(item);
    },
    render: function() {
        var _this = this;

        var items = this.props.items.map(function(item) {
            return (
                <NavigationItem key={item.data.id}
                    item={item} itemSelected={_this.setSelectedItem}
                    selected={item.data.url === _this.props.activeUrl} />
            );
        });

        return (
            <div className="navigation">
                <div className="header">Navigation</div>
                <ul>
                    {items}
                </ul>
            </div>
        );
    }
});

var StoryList = React.createClass({
    render: function() {
        var storyNodes = this.props.items.map(function(item) {
            return (
                <tr key={item.data.url}>
                    <td>
                        <p className="score">{item.data.score}</p>
                    </td>
                    <td>
                        <p className="title">
                            <a href={item.data.url}>
                                {item.data.title}
                            </a>
                        </p>
                        <p className="author">
                            Posted by <b>{item.data.author}</b>
                        </p>
                    </td>
                </tr>
            );
        });

        return (
            <table>
                <tbody>
                    {storyNodes}
                </tbody>
            </table>
        );
    }
});

var App = React.createClass({
    componentDidMount: function() {
        var _this = this;
        var cbname = "fn" + Date.now();
        var script = document.createElement("script");
        script.src = "https://www.reddit.com/reddits.json?jsonp=" + cbname;

        window[cbname] = function(jsonData) {
            _this.setState({
                navigationItems: jsonData.data.children
            });
            delete window[cbname];
        };

        document.head.appendChild(script);
    },
    getInitialState: function() {
        return ({
            activeNavigationUrl: "",
            navigationItems: [],
            storyItems: [],
            title: "Please select a sub"
        });
    },
    render: function() {
        return (
            <div>
                <h1>{this.state.title}</h1>
                <Navigation activeUrl={this.state.activeNavigationUrl}
                    items={this.state.navigationItems}
                    itemSelected={this.setSelectedItem} />
                <StoryList items={this.state.storyItems} />
            </div>
        );
    },
    setSelectedItem: function(item) {
        var _this = this;
        var cbname = "fn" + Date.now();
        var script = document.createElement("script");
        script.src = "https://www.reddit.com/" + item.data.url + ".json?sort=top&t=month&jsonp=" + cbname;

        window[cbname] = function(jsonData) {
            _this.setState({storyItems: jsonData.data.children});
            delete window[cbname];
        };
        
        document.head.appendChild(script);

        this.setState({
            activeNavigationUrl: item.data.url,
            title: item.data.display_name
        });
    }
});

React.render(
    <App />,
     document.getElementById('container')
);
*/

/*

var ProductCategoryRow = React.createClass({
  render: function() {
    return (<tr><th colSpan="2">{this.props.category}</th></tr>);
  }
});

var ProductRow = React.createClass({
  render: function() {
    var name = this.props.product.stocked ?
      this.props.product.name :
      <span style={{color:'red'}}>
        {this.props.product.name}
      </span>;
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.product.price}</td>
      </tr>
    );
  }
});

var ProductTable = React.createClass({
  render: function() {
    var rows = [];
    var lastCategory = null;
    this.props.products.forEach(function(product) {
      if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    }.bind(this));
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.value,
      this.refs.inStockOnlyInput.checked
    );
  },
  render: function() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange}
        />
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            ref="inStockOnlyInput"
            onChange={this.handleChange}
          />
          {' '}
          Only show products in stock
        </p>
      </form>
    );
  }
});

var FilterableProductTable = React.createClass({
  getInitialState: function() {
    return {
      filterText:'',
      inStockOnly: false
    };
  },

  handleUserInput: function(filterText, inStockOnly) {
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    });
  },

  render: function() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onUserInput={this.handleUserInput}
        />
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
});


var PRODUCTS = [
  {category:'Sporting Goods', price:'$49.99', stocked: true, name:'Football'},
  {category:'Sporting Goods', price:'$9.99', stocked: true, name:'Baseball'},
  {category:'Sporting Goods', price:'$29.99', stocked: false, name:'Basketball'},
  {category:'Electronics', price:'$99.99', stocked: true, name:'iPod Touch'},
  {category:'Electronics', price:'$399.99', stocked: false, name:'iPhone 5'},
  {category:'Electronics', price:'$199.99', stocked: true, name:'Nexus 7'}
];

ReactDOM.render(
  <FilterableProductTable products={PRODUCTS} />,
  document.getElementById('container')
);

*/


var $ = require('jQuery');

var controls =
[
    {id:'viewportMargin', name:'Viewport Margin', description:'Margin around the viewport edge that the tip isnt allowed to overlap', value: 10, type:'integer'},
    {id:'position', name:'Position', description:'The preferred position of the data tip relative to the x and y coords - one of top, bottom, left or right', value:'top', type:'string', choices: ['top', 'bottom', 'left', 'right']},
    {id:'padding', name:'Padding', description:'Padding', value: 7, type:'integer'},
    {id:'fontFamily', name:'Font Family', description:'Font family', value:'arial', type:'string', choices: ['Arial', 'Helvetica', 'sans-serif']},
    {id:'fontSize', name:'Font Size', description:'Font size', value: 12, type:'integer'},
    {id:'fontColor', name:'Font Color', description:'Font color', value:'#666666', type:'color'},
    {id:'backgroundColor', name:'Background Color', description:'Background color', value:'#fafafa', type:'color'},
    {id:'borderStyle', name:'Border Style', description:'Border style', value:'solid', type:'string', choices: ['dotted', 'dashed','solid', 'double', 'groove', 'ridge', 'inset', 'outset']},
    {id:'borderColor', name:'Border Color', description:'Border color', value:'#666666', type:'color'},
    {id:'borderWidth', name:'Border Width', description:'Border width', value: 1, type:'integer'},
    {id:'borderRadius', name:'Border Radius', description:'Border radius', value: 2, type:'integer'},
    {id:'shadowSize', name:'Shadow Size', description:'Shadow size', value: 1, type:'integer'},
    {id:'hideShadow', name:'Hide Shadow', description:'Hide shadow', value: false, type:'boolean'},
    {id:'notchSize', name:'Notch Size', description:'Notch size', value: 8, type:'integer'},
    {id:'notchPadding', name:'Notch Padding', description:'Padding between notch and edge of tip', value: 5, type:'integer'},
    {id:'hideNotch', name:'Hide Notch', description:'Hide notch', value: false, type:'boolean'},
    {id:'followMouse', name:'Follow Mouse', description:'Should the tip follow the mouse', value: false, type:'boolean'},
    {id:'useAnimation', name:'Use Animation', description:'Should the tip movement be animated', value: true, type:'boolean'},
    {id:'speed', name:'Animation Speed', description:'The speed of the animation. A value between 0 and 1 that controls the speed of the animation', value: 0.01, type:'float', min: 0, max: 1},
    {id:'speedIncr', name:'Animation Speed Increment', description:'Increases the animation speed so that it remains more constant and smooth as gaps between start and end points get smaller', value: 0.05, type:'float'},
    {id:'snapDistance', name:'Snap Distance', description:'The distance away from a given xy position at which the tip will snap to a point', value: 5, type:'integer'}
];

var CheckboxControl = React.createClass(
{  
    render : function() 
    {
        return (
            <div className="form-group" data-toggle="popover" data-trigger="focus" data-placement="bottom" data-content={this.props.tip}>
                <div className={'checkbox col-sm-offset-' + this.props.col1 + ' col-sm-' + this.props.col2}>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" id={this.props.id} checked={this.props.value} onChange={this.props.onChange} /> {this.props.label}
                        </label>
                    </div>
                </div>
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
            <div className="form-group" data-toggle="popover" data-trigger="focus" data-placement="bottom" data-content={this.props.tip}>
                <label htmlFor={this.props.id} className={'control-label col-sm-' + this.props.col1}>
                    <i className="fa fa-question-circle"></i> {this.props.label}
                </label>
                <div className={'col-sm-' + this.props.col2} >
                    <select className="form-control" id={this.props.id} value={this.props.value} onChange={this.props.onChange}>{options}</select>
                </div>
            </div>
        );
    }
});

var TextControl = React.createClass(
{  
    render : function () 
    { 
        return (
            <div className="form-group" data-toggle="popover" data-trigger="focus" data-placement="bottom" data-content={this.props.tip}>
                <label htmlFor={this.props.id} className={'control-label col-sm-' + this.props.col1}>
                    <span style={{cursor: 'pointer'}}><i className="fa fa-question-circle"></i></span> {this.props.label}
                </label>
                <div className={'col-sm-' + this.props.col2}>
                    <input type="text" className="form-control" id={this.props.id} value={this.props.value} onChange={this.props.onChange} />
                </div>
            </div>
        );
    }
});

var FormControl = React.createClass(
{  
    getDefaultProps : function () 
    {
        return {
            col1 : '2',
            col2 : '10'
        };
    },

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
        var control;
        if (this.props.options !== undefined)   control = <SelectControl {...this.props} onChange={this.handleChange} value={this.state.value} />
        else if (this.props.type === 'boolean') control = <CheckboxControl {...this.props} onChange={this.handleChange} value={this.state.value} />
        else                                    control = <TextControl {...this.props} onChange={this.handleChange} value={this.state.value} />
        return (control);
    }
});

var JsonForm = React.createClass(
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
        var rows = [];
        for (var i = 0; i < this.props.controls.length; i++)  
        {
            var ctrl = this.props.controls[i];
            rows.push(<FormControl col1={this.props.col1} col2={this.props.col2} key={ctrl.id} id={ctrl.id} label={ctrl.name} tip={ctrl.description} initialValue={ctrl.value} onUserInput={this.handleUserInput} type={ctrl.type} options={ctrl.choices} />);
        }

        return (<form className="form-horizontal">{rows}</form>);
    }
});

ReactDOM.render(<JsonForm controls={controls} col1="5" col2="7" />, document.getElementById('container'));