import React, { Component } from 'react';
import DataItem from "./DataItem.js";
import './App.css';
import keys from "./config";

class App extends Component {
  
  state={
    data:[],
    search_string:"",
    sortBy:""
  }

  onSearchInputChange=(e)=>{
    const value=e.target.value;
    this.setState(()=>{
        return {
            search_string: value
        }
    })
  }

  onFormSubmit=(e)=>{
    e.preventDefault();
    //Acceptable values for maxResults are 1 to 50, inclusive. The default value is 5.
    const url='https://www.googleapis.com/youtube/v3/search/?key='+keys.api_key+'&part=snippet&maxResults=5&q='+this.state.search_string;
    fetch(url).then((res)=>{
      return res.json()
    }).then(json=>this.updateData(json))
  }

  updateData=(json)=>{
    let data=[];
    for(let i=0;i<json.items.length;i++){
      //es6 object destructuring
      let temp={}
      const {publishedAt,title,description}=json.items[i].snippet;
      temp.publishedAt=publishedAt;
      temp.title=title;
      temp.description=description;
      data.push(temp);
    }
    this.setState(()=>{
      return {
        data: data
      }
    },()=>{
      if(this.state.sortBy==="Title"){
        this.sortByTitle();
      }
      if(this.state.sortBy==="Date"){
        this.sortByDate();
      }
    })
  }

  //sorts data by date(newest first)
  sortByDate=()=>{
    this.setState((prevState)=>{
      return{
        data: prevState.data.sort((a,b)=>{
          if (a.publishedAt < b.publishedAt)
            return 1;
          if (a.publishedAt > b.publishedAt)
            return -1;
          return 0;
        })
      }
    },()=>{
      this.setState(()=>{
        return {
          sortBy: "Date"
        }
      })
    })
  
  }

  //sorts data by title
  sortByTitle=()=>{
    this.setState((prevState)=>{
      return {
        data:prevState.data.sort((a,b)=>{
            if (a.title < b.title)
              return -1;
            if (a.title > b.title)
              return 1;
            return 0;
          }
        )
      }
    },()=>{
      this.setState(()=>{
        return {
          sortBy: "Title"
        }
      })
    })
    
  }

  onFilterChange=(e)=>{
    const filter=e.target.value;
    if(filter==="Date"){
      this.sortByDate();
    }else if(filter==="Title"){
      this.sortByTitle();
    }else{
      this.setState(()=>{
        return {
          sortBy:""
        }
      })
    }
  }

  render() {
    return (
      <div className="app">
        <div className="app-form-content">
          <form className="app-form" onSubmit={this.onFormSubmit}>
            <input className="app-form-input" onChange={this.onSearchInputChange} placeholder="Enter the text to Search" type="text"/>
            <button className="app-form-button" disabled={this.state.search_string===""?true:false}>Search</button>
          </form>
          <select className="app-filter" onChange={this.onFilterChange}>
            <option  value="">Select Filter</option>
            <option  value="Title">Name/Title</option>
            <option  value="Date">Date</option>
          </select>
          </div>
        <div>
          {this.state.data.map((item)=>{
              return <DataItem {...item} key={item.title}/>
          })}
        </div>
      </div>
    );
  }
}

export default App;
