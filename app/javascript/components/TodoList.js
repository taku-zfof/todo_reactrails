import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import { AiFillEdit } from 'react-icons/ai'


const SearchAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SearchForm = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 10px;
`

const RemoveAllButton = styled.button`
  width: 16%;
  height: 40px;
  background: #f54242;
  border: none;
  font-weight: 500;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
`

const TodoName = styled.span`
  font-size: 27px;
  ${({ is_completed }) => is_completed && `
    opacity: 0.4;
  `}
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 7px auto;
  padding: 10px;
  font-size: 25px;
`

const CheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  color: green;
  cursor: pointer;
`

const UncheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  cursor: pointer;
`

const EditButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`


function TodoList(){
  const [todos,setTodos] = useState([])
  const[searchName,setSearchName] = useState("")

  useEffect(
    ()=>{
      axios.get('/api/v1/todos.json')
      .then(resp => {
        console.log(resp.data)
        setTodos(resp.data)     //ここでtodosの中身に全todoを入れてる
      })
    },[] )

  const removeAllTodos = () => {
    const sure =window.confirm("全てのTodoを削除してよろしいですか？")
    if (sure){
      axios.delete("/api/v1/todos/destroy_all")
      .then(resp =>{
        setTodos([])
      })
    }
  }

  const updateIsCompleted = (number,val) =>{
    var data = {
      id: val.id,
      name: val.name,
      is_completed: !val.is_completed    //この画面での更新は実行済みか否かだけ。だからis_compretedだけ反転したものを「data」と命名して準備。
    }
    axios.patch(`/api/v1/todos/${val.id}`,data)  //updateアクションに渡す値を「data」で用意してる。paramsと同じ。
    .then(resp =>{
      const newTodos = [...todos]   //todosを展開
      newTodos[number].is_completed = resp.data.is_completed   //todosのnumber番目のis_compretedにrespのis_compretedを入れる
      setTodos(newTodos)
    })
  }

  return(
    <div>
     <h1>Todo List</h1>
     <SearchAndButton>
       <SearchForm type="text" placeholder="Search todo..." onChange={event=>{setSearchName(event.target.value)}}/>
       <RemoveAllButton onClick={removeAllTodos}>Remove All</RemoveAllButton>
     </SearchAndButton>
     
     <div>
      {todos.filter((todo) => {
        if(searchName==""){
          return todo
        }else if(todo.name.toLowerCase().includes(searchName.toLowerCase())){
          return todo
        }
      })
      .map((todo,key)=>{
        return(
        <Row key={key}>
         {todo.is_completed ? (
         <CheckedBox> <ImCheckboxChecked onClick={()=>updateIsCompleted(key,todo)}/> </CheckedBox>
         ) : (
         <UncheckedBox> <ImCheckboxUnchecked onClick={()=>updateIsCompleted(key,todo)}/> </UncheckedBox>
         )}
         <TodoName is_completed={todo.is_completed}>{todo.name}</TodoName>
         <Link to={"/todos/"+todo.id+"/edit"}> <EditButton> <AiFillEdit/> </EditButton> </Link>
        </Row>
        )
      })}
     </div>
    </div>
    )
}

export default TodoList