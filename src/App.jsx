import axios from "axios";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TodoList() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let [editname,seteditname] = useState("");
  let [editdesc,seteditdesc] = useState("");
  let [idx,setIdx] = useState(null);

  let [todos, setTodos] = useState([]);

  async function getTodo() {
    try {
      let { data } = await axios.get("http://65.108.148.136:8080/ToDo/get-to-dos");
      setTodos(data?.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function postTodo(formDat) {
    try {
      let { data } = await axios.post("http://65.108.148.136:8080/ToDo/add-to-do", formDat);
      getTodo();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTodo(id) {
    try {
      let { data } = await axios.delete(`http://65.108.148.136:8080/ToDo/delete-to-do?id=${id}`);
      getTodo();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteImg(id) {
    try {
      let { data } = await axios.delete(`http://65.108.148.136:8080/ToDo/delete-to-do-image?imageId=${id}`);
      getTodo();
    } catch (error) {
      console.error(error);
    }
  }

  async function clearTodos() {
    try {
      await Promise.all(todos.map(todo => deleteTodo(todo.id)));
      getTodo();
    } catch (error) {
      console.error(error);
    }
  }

  async function puttodo(obj){
    try {
      let {data} = await axios.put(`http://65.108.148.136:8080/ToDo/update-to-do`, obj )
      getTodo()
    } catch (error) {
      console.error(error);
    }
  }

  async function complate(el){
    console.log(el);
    try {
      let {data} = await axios.put(`http://65.108.148.136:8080/ToDo/is-completed?id=${el.id}` )
      getTodo()
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getTodo();
  }, []);

  function changeA(e) {
    e.preventDefault();
    let formDat = new FormData();
    let title = e.target.name.value;
    let desc = e.target.desc.value;
    let images = e.target.images.files;
    formDat.append("Name", title);
    formDat.append("Description", desc);
    for (let i = 0; i < images.length; i++) {
      formDat.append("Images", images[i]);
    }
    postTodo(formDat);
  }

  
  return (
    <div>
      <div className="block-ad">
        <form onSubmit={changeA}>
          <input name="name" type="text" />
          <input name="desc" type="text" />
          <input name="images" multiple type="file" />
          <button onClick={() => {}} type="submit">Add</button>
        </form>
      </div>
      <button onClick={clearTodos}>Clear All</button>
      {todos?.map((el) => {
        return (
          <div key={el.id}>
            <input type="checkbox" checked={el.isCompleted} onChange={() => {complate(el)}} />
            <p>{el.name}</p>
            <p>{el.description}</p>
            {el?.images?.map((e) => {
              return (
                <div key={e.id}>
                  <img src={"http://65.108.148.136:8080/images/" + e.imageName} alt="todo" />
                  <button onClick={() => deleteImg(e.id)}>Delete This Img</button>
                </div>
              );
            })}
            <button onClick={() => deleteTodo(el.id)}>Delete</button>
            <button onClick={()=>{handleOpen(),seteditname(el.name),seteditdesc(el.description),setIdx(el.id)}}>Edit</button>
          </div>
        );
      })}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <input type="text" style={{width:"100%",marginBottom:"20px",height:"30px"}} value={editname} onChange={(e)=>{seteditname(e.target.value)}} placeholder="Name"/><br />
          <input type="text" style={{width:"100%",marginBottom:"20px",height:"30px"}} value={editdesc} onChange={(e)=>{seteditdesc(e.target.value)}} placeholder="Description"/><br />
          <button onClick={()=>{puttodo({name: editname, description: editdesc, id: idx})}} style={{marginRight:"20px"}}>Save</button>
          <button onClick={()=>{handleClose()}}>Cancel</button>
        </Box>
      </Modal>
    </div>
  );
}
