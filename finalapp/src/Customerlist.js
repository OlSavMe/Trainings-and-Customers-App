import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css' 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CSVLink, CSVDownload} from 'react-csv';
import AddCustomer from './AddCustomer';


class Customerlist extends Component {
  state = {id: '', customers: [], trains: []};

  componentDidMount() {
    this.loadCustomers();
  }
  
 
  loadCustomers = () => {
    fetch('https://customerrest.herokuapp.com/api/customers')
    .then((response) => response.json()) 
    .then((responseData) => { 
      this.setState({ 
        customers: responseData.content,
       
      }); 
    })   
  }

 
  onDelClick = (link) => {
        fetch(link, {method: 'DELETE'})
        .then(res => {
            toast.success("Customer deleted", {
                position: toast.POSITION.TOP_CENTER
            });
            this.loadCustomers();
        })
        .catch(err => {
            toast.error("Error when deleting", {
                position: toast.POSITION.TOP_CENTER
            });
            console.error(err)
        })
      
      }


    
    
      confirmDelete = (link) => {
        confirmAlert({
          message: 'Are you sure to delete?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.onDelClick(link)
            },
            {
              label: 'No',
            }
          ]
        })
      }
      

      getTrainings = (tlink) => {
        fetch(tlink, {method: 'GET'})
        .then(res => this.loadCustomers())
        .catch(err => 
            console.error(err))
      
      }


  addCustomer(customer) {
    fetch('https://customerrest.herokuapp.com/api/customers', 
    {   method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer)
    })
    .then(res => this.loadCustomers())
    .catch(err => console.error(err))
  }

  updateCustomer(customer, link) {
    fetch(link, 
    { method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer)
    })
    .then(
      toast.success("Changes saved", {
        position: toast.POSITION.BOTTOM_LEFT
      })         
    )
    .catch( err => console.error(err))
  }



  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#F0FFF0" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.customers];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ customers: data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.customers[cellInfo.index][cellInfo.column.id]
        }}                
      />
    );
  }  

  render() {
    return (
      <div className="App-body">
       <div className="row">
        <AddCustomer addCustomer={this.addCustomer} loadCustomers={this.loadCustomers} />
        </div>
        <ReactTable data={this.state.customers}
        columns={[
            {
              columns: [
                {
                  accessor: "links[0].href",
                  show: false
                },
                {
                  Header: "First name",
                  accessor: "firstname",
                  Cell: this.renderEditable
                },
                {
                  Header: "Last name",
                  accessor: "lastname",
                  Cell: this.renderEditable
                },
                  {
                    Header: "Street address",
                    accessor: "streetaddress",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Post code",
                    accessor: "postcode",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "City",
                    accessor: "city",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "email",
                    accessor: "email",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Phone",
                    accessor: "phone",
                    Cell: this.renderEditable
                  },

                  {
                    id: 'button',
                    sortable: false,
                    filterable: false,
                    width: 100,
                    accessor: 'links[2].href',
                    Cell: ({value}) => (<button className="btn btn-default btn-link" onClick={()=>{this.getTrainings(value)}}>Trainings</button>)
                  }, 
                   
                 
                  {
                    id: 'button',
                    sortable: false,
                    filterable: false,
                    width: 100,
                    accessor: 'links[0].href',
                    Cell: ({value, row}) => (<button className="btn btn-default btn-link" onClick={()=>{this.updateCustomer(row, value)}}>Save</button>)
                  }, 
                   
                  {
                    id: 'button',
                    sortable: false,
                    filterable: false,
                    width: 100,
                    accessor: 'links[0].href',
                    Cell: ({value}) => (<button className="btn btn-default btn-link" onClick={()=>{this.confirmDelete(value)}}>Delete</button>)
                  }  ,      
                          
              ]
            }
          ]}
          filterable
          className="-highlight" > 
        </ReactTable>
        <ToastContainer autoClose={3000}/>
      </div>
    );
  }
}

export default Customerlist;

 