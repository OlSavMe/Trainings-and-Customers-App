import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css' 
import { ToastContainer, toast } from 'react-toastify';
import Moment from 'react-moment';
import {CSVLink, CSVDownload} from 'react-csv';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';

import AddTraining from './AddTraining';


class Traininglist extends Component {
  state = {trainings: [] };

  componentDidMount() {
    this.loadTrainings();
  }
  

  loadTrainings = () => {
    fetch('https://customerrest.herokuapp.com/api/trainings')
    .then((response) => response.json()) 
    .then((responseData) => { 
      this.setState({ 
        trainings: responseData.content,
      }); 
    })   
  }


 
  onDelClick = (link) => {
    fetch(link, {method: 'DELETE'})
    .then(res => {
        toast.success("Training deleted", {
            position: toast.POSITION.BOTTOM_CENTER
        });
        this.loadTrainings();
    })
    .catch(err => {
        toast.error("Error when deleting", {
            position: toast.POSITION.BOTTOM_CENTER
        });
        console.error(err)
    })
  
  }

 
  addTraining(training) {
    fetch('https://customerrest.herokuapp.com/api/trainings', 
    {   method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(training)
    })
    .then(res => this.loadTrainings())
    .catch(err => console.error(err))
  }


  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#F0FFF0" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.trainings];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ trainings: data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.trainings[cellInfo.index][cellInfo.column.id]
        }}                
      />
    );
  }  

 

  render() {
  
        
    return (
      <div className="App-body">
       <div className="row">
        <AddTraining addTraining={this.addTraining} loadTrainings={this.loadTrainings} />
        </div>
        <ReactTable data={this.state.trainings}
        columns={[
            {
              columns: [
                {
                  accessor: "links[0].href",
                  show: false
                },
                {
                  Header: "Date",
                  accessor:  "date",
               
                },
                {
                  Header: "Duration",
                  accessor: "duration",
               
                },
                  {
                    Header: "Activity",
                    accessor: "activity",
                    
                  }, 
              

                  {
                    id: 'button',
                    sortable: false,
                    filterable: false,
                    width: 100,
                    accessor: 'links[0].href',
                    Cell: ({value}) => (<button className="btn btn-default btn-link" onClick={()=>{this.onDelClick(value)}}>Delete</button>)
                  }        
                               
              ]
            }
          ]}
          filterable
          className="-highlight" > 
        </ReactTable>
        <ToastContainer autoClose={2000}/>
      </div>
    );
  }
}

export default Traininglist;
