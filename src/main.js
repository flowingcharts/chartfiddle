var HelloMessage = React.createClass(
{
  render: function() 
  {
    return <div>Hello {this.props.name}</div>;
  }
});

ReactDOM.render(
  <HelloMessage name="Jonathan Clare" />,
  document.getElementById('container')
);