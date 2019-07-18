import React from 'react'
import io from 'socket.io-client'
import uniqid from 'uniqid'
import './Canvas.css';

const socket = io('http://localhost:8080')

export default class Canvas extends React.Component {
  constructor(){
    super()
    this.state = {
      isActive: false,
      inputFormValue: '',
      selectPostIt: {id:'', content:''},
      postIts: []
    }
  }
  componentDidMount(){
    const rePosicion = (postIt) => {
      this.setState({
        postIts: [
          ...this.state.postIts.filter((x)=>x.id!==postIt.id),
          postIt
        ]
      })
    }
    socket.on('postIt move', function(postIt){
      console.log(postIt)
      rePosicion(postIt)
    })

  }
  handlerInputChange = (e)=>this.setState({inputFormValue: e.target.value})

  potItSelect = (e) => {
    e.stopPropagation()
    this.setState({isActive: !this.state.isActive, selectPostIt: {id:e.target.id, content:e.target.innerText}})
  }
  
  mouseEventMove = (e)=> {
    const selectPostIt = this.state.selectPostIt
    socket.emit('postIt move', {...selectPostIt ,posX:e.clientX-50, posY:e.clientY-50})
  }
  addPostIt= (e) => {
    e.preventDefault()
    console.log('añade un postIt')
    const newPostIt={
          id: uniqid('id-'),
          posX: 100,
          posY:100,
          content: this.state.inputFormValue
    }
    this.setState({inputFormValue:'',postIts: [...this.state.postIts, newPostIt]})
  }
  
  render(){
    return (
      <div className='Canvas' onMouseMove={this.state.isActive ? this.mouseEventMove:null}>
        {this.state.postIts.map(x => 
          <div id={x.id} key={x.id} className='postIt' style={{left:x.posX, top:x.posY}} onClick={this.potItSelect}>{x.content}
          </div>
        )}
        <form className="addPostItForm" onSubmit={this.addPostIt} >
          <input value={this.state.inputFormValue} onChange={this.handlerInputChange} type="text" placeholder='+'/>
        </form>
      </div>
    )
  }
}